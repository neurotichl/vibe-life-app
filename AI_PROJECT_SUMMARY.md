# AI Project Summary - LifeOS Prototype Collection

**Purpose**: This document provides context for AI assistants to quickly understand the current state of prototype projects without needing to re-scan all files in each session.

## Overall Vision: LifeOS

Building a personal "Life Operating System" with these core principles:
- **Universal data layer**: JSON/Parquet storage in cloud (eventually GCS)
- **Schema-driven**: Common data model across all life domains (journal, habits, meals, tasks, etc.)
- **API-centric**: LLMs interact via APIs rather than owning data
- **Multi-frontend**: Web, mobile, AI agents all use same data foundation
- **Vector embeddings**: For semantic search across all life data

## Current Projects Status

### 1. code_chunk/ - Code Indexing & Vector Search (ACTIVE PROTOTYPE)

**Status**: Functional but halfway complete
**Tech**: Python, ChromaDB, AST parsing, JSON storage
**Purpose**: Code repository indexer with semantic search capabilities

**Architecture**:
- `CodeChunk` dataclass: id, type, content, metadata, embedding
- `CodeIndexer` class: Processes repos into chunks
- Chunk types: repository_overview, file_overview, function, class, directory_context
- Output: JSON file with ~7000 lines of indexed code chunks

**Key Features**:
- AST parsing for Python (extensible to other languages)
- Multi-level chunking: repo → file → function/class → context
- Metadata extraction (imports, function calls, dependencies)
- Skip patterns for common directories (.git, node_modules, etc.)

**Current State**:
- ✅ Core indexing works
- ✅ JSON persistence
- ✅ ChromaDB dependency ready
- ❌ Vector embeddings not implemented yet
- ❌ Search/query interface missing
- ❌ API layer not built

**Data Schema Example**:
```json
{
  "id": "81e7aff5acbb",
  "type": "function", 
  "content": "def create_chunk(self, node, content)...",
  "metadata": {
    "repo_name": "project",
    "file_path": "src/core.py",
    "function_name": "create_chunk",
    "line_range": [45, 67],
    "calls": ["ast.parse", "hashlib.md5"]
  },
  "embedding": null
}
```

**LifeOS Relevance**: This is the FOUNDATION pattern - demonstrates:
- Schema-driven data storage ✅
- JSON-based persistence ✅ 
- Metadata-rich entries ✅
- Vector embedding ready ✅
- Could be extended to ANY domain (not just code)

### 2. meal-planner/ - Next.js Food Domain App (FUNCTIONAL DEMO)

**Status**: Working prototype with Chinese recipes
**Tech**: Next.js 15, React 19, TailwindCSS 4, Lucide icons
**Purpose**: Weekly meal planning with automated shopping lists

**Features**:
- Recipe database (breakfast/lunch/dinner)
- Random meal plan generation for entire week
- Individual meal regeneration
- Auto-generated shopping lists grouped by category
- Ingredient quantity tracking
- Chinese UI with emoji-rich design

**Data Structure**:
```javascript
{
  id: 'b1',
  name: '番茄炒蛋',
  ingredients: [
    { name: '鸡蛋', emoji: '🥚', amount: '3个', category: '蛋类' }
  ]
}
```

**Current State**:
- ✅ Complete UI working
- ✅ Recipe data embedded in component
- ✅ Shopping list aggregation
- ❌ No persistence (resets on reload)
- ❌ No backend/API
- ❌ Hardcoded recipe data

**LifeOS Relevance**: Perfect example of domain-specific frontend that could be:
- Backed by universal schema
- Powered by APIs
- Enhanced with AI (recipe suggestions, dietary analysis)

### 3. weekly_meal/ - Standalone Meal Planning (LEGACY)

**Status**: Basic JavaScript prototype
**Purpose**: Earlier attempt at meal planning functionality
**Current State**: Appears superseded by meal-planner/ Next.js version

## Schema Evolution Path

The projects show clear evolution toward unified LifeOS schema:

**code_chunk schema** → **universal life schema**:
```json
{
  "id": "journal_2025-09-03T14:20:00",
  "type": "journal", // was "function"
  "content": "Felt motivated today, worked on storage design.",
  "metadata": {
    "date": "2025-09-03",
    "tags": ["motivation", "work"],
    "source": "web-app", // was "repo_name"
    "created_at": "2025-09-03T14:20:00Z",
    "updated_at": "2025-09-03T14:20:00Z"
  },
  "embedding": null // for semantic search
}
```

**meal-planner data** → **universal life schema**:
```json
{
  "id": "recipe_tomato_eggs",
  "type": "recipe",
  "content": "番茄炒蛋 - 3个鸡蛋, 2个番茄",
  "metadata": {
    "recipe_name": "番茄炒蛋",
    "meal_type": "breakfast",
    "ingredients": [...],
    "tags": ["chinese", "eggs"],
    "source": "meal-planner",
    "created_at": "2025-09-03T14:20:00Z"
  },
  "embedding": null
}
```

## Next Development Priorities

Based on current prototypes and LifeOS vision:

### Phase 1: Foundation
1. **Extract universal schema** from code_chunk pattern
2. **Implement vector embeddings** in code_chunk (ChromaDB)
3. **Build API layer** around code_chunk data
4. **Test AI integration** with code search

### Phase 2: Domain Extension  
1. **Migrate meal-planner** to universal schema
2. **Add persistence layer** (JSON → eventual GCS)
3. **Create journal/habit** prototypes using same pattern
4. **Build unified web interface**

### Phase 3: AI Integration
1. **LLM tool calling** to read/write via APIs
2. **Semantic search** across all domains
3. **Cross-domain insights** (habits affecting mood affecting meal choices)
4. **Mobile app** using same API foundation

## Technical Debt & Completion Tasks

### code_chunk/:
- Add vector embedding generation and storage
- Build query/search interface
- Create REST API endpoints
- Add error handling and validation
- Extend AST parsing to JavaScript/TypeScript

### meal-planner/:
- Extract hardcoded recipes to data layer
- Add persistence (localStorage → API)
- Implement CRUD operations for recipes
- Add nutritional data and analysis
- Connect to universal schema

### Overall:
- Set up proper development environment
- Add testing frameworks
- Design unified API specification
- Plan cloud storage migration strategy

## Key Insights for AI Assistants

1. **Don't start from scratch** - build on code_chunk foundation
2. **Schema-first approach** - ensure new features fit universal model  
3. **API-centric design** - frontends consume data, don't own it
4. **Vector embeddings everywhere** - prepare all data for semantic search
5. **Prototype → production path** exists and is partially validated

This collection represents a solid foundation for LifeOS with clear evolution paths from working prototypes to unified system.