# Life Dashboard

A modular web application for managing personal life aspects including expenses, habits, savings/investments, and journaling.

**Tech Stack:** Next.js 14 (TypeScript) + FastAPI (Python) + SQLite

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- npm

### 1. Start Backend

```bash
cd backend
.venv/bin/python api.py
```

Backend runs on `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

### 2. Start Frontend

```bash
cd frontend
npm install  # First time only
npm run dev
```

Frontend runs on `http://localhost:3000`

## Project Structure

```
.
├── backend/
│   ├── api.py                      # FastAPI application
│   ├── config.py                   # Categories and budgets
│   ├── database/
│   │   └── sqlite_impl.py          # Database operations
│   ├── services/
│   │   ├── expense_service.py      # Expense business logic (ACTIVE)
│   │   ├── budget_service.py       # Budget management (ACTIVE)
│   │   ├── recurring_service.py    # Recurring transactions (ACTIVE)
│   │   ├── habit_service.py        # Placeholder
│   │   ├── savings_service.py      # Placeholder
│   │   └── journal_service.py      # Placeholder
│   └── data/
│       └── expenses.db             # SQLite database
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx                # Landing page
│   │   ├── expense-tracker/        # Expense tracker (ACTIVE)
│   │   ├── habit-tracker/          # Placeholder
│   │   ├── savings/                # Placeholder
│   │   └── journal/                # Placeholder
│   ├── components/ui/              # UI components
│   └── lib/
│       ├── api.ts                  # API client
│       └── utils.ts                # Utility functions
│
└── PROJECT_SUMMARY.md              # Detailed documentation
```

## Current Modules

- ✅ **Expense Tracker** - Fully functional
- 🚧 **Habit Tracker** - Planned
- 🚧 **Savings & Investment** - Planned
- 🚧 **Journal** - Planned

## Common Commands

**Kill backend port:**
```bash
lsof -ti:8000 | xargs kill -9
```

**Database query:**
```bash
sqlite3 backend/data/expenses.db "SELECT * FROM expenses LIMIT 10;"
```

**Clear frontend cache:**
```bash
cd frontend
rm -rf .next
npm run dev
```

## Documentation

For detailed documentation including architecture, features, API endpoints, and development guidelines, see [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md).

## Database

SQLite database located at `backend/data/expenses.db`

**Tables:**
- `expenses` - All expense records
- `budgets` - Monthly budget allocations
- `recurring_transactions` - Recurring expense templates
- `applied_recurring` - Tracking of applied recurring expenses

## Environment

Default configuration:
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`
- Database: `backend/data/expenses.db`
- CORS: Allows frontend origin

---

**For comprehensive documentation, see [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)**
