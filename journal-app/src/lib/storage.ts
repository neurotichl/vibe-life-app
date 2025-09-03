import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: 'ch-life-1028',
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const bucket = storage.bucket('ch-life-journal');

export interface JournalEntry {
  id: string;
  type: 'journal';
  content: string;
  metadata: {
    date: string;
    title?: string;
    mood?: string;
    tags: string[];
    source: string;
    created_at: string;
    updated_at: string;
  };
  embedding?: number[] | null;
}

export class JournalStorage {
  private getFileName(date: string): string {
    return `journal/${date}.json`;
  }

  async saveEntry(entry: JournalEntry): Promise<void> {
    const fileName = this.getFileName(entry.metadata.date);
    const file = bucket.file(fileName);
    
    // Check if file exists and merge with existing entries
    let entries: JournalEntry[] = [];
    
    try {
      const [exists] = await file.exists();
      if (exists) {
        const [content] = await file.download();
        entries = JSON.parse(content.toString());
      }
    } catch (error) {
      console.log('No existing file found, creating new one');
    }

    // Remove existing entry with same id if it exists
    entries = entries.filter(e => e.id !== entry.id);
    
    // Add new entry
    entries.push(entry);
    
    // Sort by created_at
    entries.sort((a, b) => new Date(a.metadata.created_at).getTime() - new Date(b.metadata.created_at).getTime());

    await file.save(JSON.stringify(entries, null, 2), {
      metadata: {
        contentType: 'application/json',
      },
    });
  }

  async getEntriesByDate(date: string): Promise<JournalEntry[]> {
    const fileName = this.getFileName(date);
    const file = bucket.file(fileName);

    try {
      const [exists] = await file.exists();
      if (!exists) {
        return [];
      }

      const [content] = await file.download();
      return JSON.parse(content.toString());
    } catch (error) {
      console.error('Error reading entries:', error);
      return [];
    }
  }

  async getAllEntries(): Promise<JournalEntry[]> {
    const [files] = await bucket.getFiles({
      prefix: 'journal/',
    });

    const allEntries: JournalEntry[] = [];

    for (const file of files) {
      try {
        const [content] = await file.download();
        const entries: JournalEntry[] = JSON.parse(content.toString());
        allEntries.push(...entries);
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error);
      }
    }

    // Sort by date desc
    return allEntries.sort((a, b) => 
      new Date(b.metadata.created_at).getTime() - new Date(a.metadata.created_at).getTime()
    );
  }

  async deleteEntry(entryId: string, date: string): Promise<void> {
    const fileName = this.getFileName(date);
    const file = bucket.file(fileName);

    try {
      const [exists] = await file.exists();
      if (!exists) {
        return;
      }

      const [content] = await file.download();
      let entries: JournalEntry[] = JSON.parse(content.toString());
      
      entries = entries.filter(e => e.id !== entryId);

      if (entries.length === 0) {
        await file.delete();
      } else {
        await file.save(JSON.stringify(entries, null, 2), {
          metadata: {
            contentType: 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  }
}

export const journalStorage = new JournalStorage();