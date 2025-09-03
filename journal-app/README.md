# 📖 Journal App - LifeOS Project

A cute, emoji-rich journaling application with Google Cloud Storage backend. Part of the LifeOS prototype collection.

## ✨ Features

- **Daily journaling** with date picker and calendar view
- **Mood tracking** with emoji-rich mood selection
- **Tag system** for organizing entries  
- **Google Cloud Storage** persistence
- **Cute, minimalist UI** with gradients and animations
- **LifeOS schema** compatible (universal data model)

## 🚀 Quick Start

### Prerequisites

1. **Google Cloud Setup**:
   - Create a Google Cloud Project
   - Enable Cloud Storage API  
   - Create a service account and download credentials JSON
   - Create a storage bucket in `asia-southeast1`

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set environment variables**:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/credentials.json"
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Visit [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Backend**: Next.js API Routes
- **Storage**: Google Cloud Storage (JSON files)
- **UI Components**: Lucide React icons
- **Date Handling**: date-fns

### Data Schema (LifeOS Compatible)
```typescript
interface JournalEntry {
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
  embedding?: number[] | null; // For future semantic search
}
```

### Storage Structure
```
ch-life-journal/
├── journal/
│   ├── 2025-09-03.json
│   ├── 2025-09-04.json
│   └── ...
```

## 🎨 Design Philosophy

This app follows the **cute, naughty design** aesthetic:
- Emoji-rich interface (📖✨🌟💫🏷️)
- Gradient backgrounds and shadows
- Playful animations and transitions
- Chinese UI for personal use
- Rounded corners and soft shadows

## 🔮 LifeOS Integration

This journal app is designed as part of the broader **LifeOS** ecosystem:

- **Universal Schema**: Uses the same data pattern as other LifeOS apps
- **API-First**: Data accessible via REST endpoints for AI agents
- **Vector-Ready**: Schema supports embeddings for semantic search
- **Multi-Frontend**: Storage layer can power web, mobile, and AI interfaces

### API Endpoints

- `GET /api/journal?date=YYYY-MM-DD` - Get entries for specific date
- `GET /api/journal` - Get all entries
- `POST /api/journal` - Create new entry
- `DELETE /api/journal?id=ID&date=DATE` - Delete entry

## 🛠️ Development

### Project Structure
```
src/
├── app/
│   ├── page.tsx              # Main journal UI
│   └── api/journal/route.ts  # REST API
└── lib/
    └── storage.ts            # Google Cloud Storage client
```

### Key Files
- `src/lib/storage.ts` - Storage abstraction layer
- `src/app/page.tsx` - Main React component with cute UI
- `src/app/api/journal/route.ts` - API endpoints

## 🚧 Next Steps

1. **Vector Embeddings** - Add semantic search capability
2. **AI Integration** - Connect with LLM for writing assistance
3. **Mobile App** - Build React Native version using same APIs
4. **Analytics** - Add mood tracking and insights
5. **Export** - Add PDF/markdown export functionality

## 🔗 Related Projects

Part of the **LifeOS** prototype collection:
- **code_chunk/** - Code indexing with vector search
- **meal-planner/** - Weekly meal planning
- **journal-app/** - This journaling app (current)

See `AI_PROJECT_SUMMARY.md` in the parent directory for full LifeOS vision.
