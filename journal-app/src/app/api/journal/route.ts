import { NextRequest, NextResponse } from 'next/server';
import { journalStorage, JournalEntry } from '@/lib/storage';
import { format } from 'date-fns';

/**
 * @swagger
 * /api/journal:
 *   get:
 *     tags: [Journal]
 *     summary: Get journal entries
 *     description: Retrieve all journal entries or entries for a specific date
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format to filter entries
 *         example: "2025-09-03"
 *     responses:
 *       200:
 *         description: Successfully retrieved journal entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JournalEntry'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/journal:
 *   post:
 *     tags: [Journal]
 *     summary: Create a new journal entry
 *     description: Create a new journal entry with content, mood, and tags. Perfect for AI agents to add entries automatically.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: The main journal entry content
 *                 example: "今天心情很好，完成了API文档的编写。学到了很多关于Swagger的知识。"
 *               title:
 *                 type: string
 *                 description: Optional title for the entry
 *                 example: "API开发进展"
 *               mood:
 *                 type: string
 *                 enum: [amazing, happy, okay, sad, angry, excited, tired, grateful]
 *                 description: Mood emoji category
 *                 example: "happy"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags to categorize the entry
 *                 example: ["development", "learning", "progress"]
 *     responses:
 *       201:
 *         description: Journal entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JournalEntry'
 *       400:
 *         description: Bad request - missing required content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/journal:
 *   delete:
 *     tags: [Journal]
 *     summary: Delete a journal entry
 *     description: Delete a specific journal entry by ID and date
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Journal entry ID
 *         example: "journal_1725368400_abc123"
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date of the entry in YYYY-MM-DD format
 *         example: "2025-09-03"
 *     responses:
 *       200:
 *         description: Entry deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad request - missing required parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * components:
 *   schemas:
 *     JournalEntry:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the journal entry
 *           example: "journal_1725368400_abc123"
 *         type:
 *           type: string
 *           description: Entry type (always 'journal' for LifeOS compatibility)
 *           example: "journal"
 *         content:
 *           type: string
 *           description: Main content of the journal entry
 *           example: "今天心情很好，完成了API文档的编写。"
 *         metadata:
 *           type: object
 *           properties:
 *             date:
 *               type: string
 *               format: date
 *               description: Entry date in YYYY-MM-DD format
 *               example: "2025-09-03"
 *             title:
 *               type: string
 *               description: Optional entry title
 *               example: "API开发进展"
 *             mood:
 *               type: string
 *               enum: [amazing, happy, okay, sad, angry, excited, tired, grateful]
 *               description: Mood category with emoji mapping
 *               example: "happy"
 *             tags:
 *               type: array
 *               items:
 *                 type: string
 *               description: Categorization tags
 *               example: ["development", "learning"]
 *             source:
 *               type: string
 *               description: Source application
 *               example: "journal-app"
 *             created_at:
 *               type: string
 *               format: date-time
 *               description: Entry creation timestamp
 *               example: "2025-09-03T14:20:00Z"
 *             updated_at:
 *               type: string
 *               format: date-time
 *               description: Last update timestamp
 *               example: "2025-09-03T14:20:00Z"
 *         embedding:
 *           type: array
 *           items:
 *             type: number
 *           nullable: true
 *           description: Vector embedding for semantic search (future feature)
 *           example: null
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *           example: "Failed to save entry"
 */