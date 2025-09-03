import { NextRequest, NextResponse } from 'next/server';
import { journalStorage, JournalEntry } from '@/lib/storage';
import { format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (date) {
      const entries = await journalStorage.getEntriesByDate(date);
      return NextResponse.json(entries);
    } else {
      const entries = await journalStorage.getAllEntries();
      return NextResponse.json(entries);
    }
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, title, mood, tags } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const now = new Date();
    const entry: JournalEntry = {
      id: `journal_${now.getTime()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'journal',
      content,
      metadata: {
        date: format(now, 'yyyy-MM-dd'),
        title: title || undefined,
        mood: mood || undefined,
        tags: tags || [],
        source: 'journal-app',
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
    };

    await journalStorage.saveEntry(entry);
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('Error saving journal entry:', error);
    return NextResponse.json(
      { error: 'Failed to save entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get('id');
    const date = searchParams.get('date');

    if (!entryId || !date) {
      return NextResponse.json(
        { error: 'Entry ID and date are required' },
        { status: 400 }
      );
    }

    await journalStorage.deleteEntry(entryId, date);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 }
    );
  }
}