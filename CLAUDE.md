# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pipeline Logs UI is a React-based monitoring dashboard for tracking pipeline executions and project deployments. It features a dual-mode API layer that seamlessly switches between mock data (for development) and real backend APIs (for production).

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (uses mock data by default)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint
```

## Architecture

### Dual-Mode API Pattern

The codebase implements a **mock/real API switching pattern** controlled by environment variables:

- **Mock Mode (default)**: Uses in-memory data from `src/mocks/` with simulated delays
- **Real API Mode**: Makes HTTP requests to backend when `VITE_API_BASE_URL` is set

Configuration logic in `src/config/api.ts`:
```typescript
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !API_BASE_URL
```

All API functions follow this pattern:
```typescript
export async function getData(query: Query = {}): Promise<Data[]> {
  if (USE_MOCK) {
    return mockData // from src/mocks/
  }
  return get<Data[]>(ENDPOINTS.data, params)
}
```

### Directory Structure

```
src/
├── api/              # API layer with mock/real switching
│   ├── client.ts     # HTTP client with 30s timeout
│   ├── endpoints.ts  # API endpoint constants
│   ├── pipelines.ts  # Pipeline data fetching
│   ├── projects.ts   # Project data fetching
│   └── savedViews.ts # Saved filter views CRUD
├── components/       # Reusable UI components
│   ├── Layout.tsx    # Main layout with header & resizable sidebar
│   ├── DataTable.tsx # Generic memoized data table
│   ├── QueryBuilderSidebar.tsx # Advanced filter builder
│   └── ...
├── pages/            # Route pages (Pipelines, Projects)
├── types/            # TypeScript type definitions
│   ├── api.ts        # API data models
│   └── common.ts     # Common types (TableRow, FilterCondition)
├── mocks/            # Mock data with simulated delays
└── config/           # Configuration (API settings)
```

### Key Components

**Layout Component** (`src/components/Layout.tsx`):
- Wraps all pages with header and navigation
- Provides resizable right sidebar for query builder
- Keyboard shortcut: `Esc` to toggle sidebar
- Displays active filter bar when filters are applied

**Page Components** (`src/pages/Pipelines.tsx`, `src/pages/Projects.tsx`):
- Handle data fetching and state management
- Implement filtering, pagination, and JSON modal display
- Manage saved views (load, save, delete)
- Use `useCallback` for memoized event handlers

**QueryBuilderSidebar** (`src/components/QueryBuilderSidebar.tsx`):
- **Builder Tab**: Create WHERE conditions (field, operator, value)
- **Library Tab**: Save and load frequently used filter views
- Smart tooltips show full query conditions on hover
- Resizable via drag handle

### State Management

Uses React hooks with memoization:
- `useState` for local component state
- `useCallback` for event handlers to prevent unnecessary re-renders
- `useEffect` for data fetching side effects
- State lifted to page components for shared state
- `memo()` on DataTable component for performance

### Type Safety Conventions

- TypeScript strict mode enabled (no implicit any)
- Explicit type imports: `import type { ... }`
- Use `Record<string, unknown>` instead of `any` for generic objects
- All API responses and UI state are fully typed

## Testing

- **Framework**: Vitest with jsdom environment
- **Testing Library**: React Testing Library
- Test files: `*.test.ts` or `*.test.tsx`
- Setup file: `src/test/setup.ts`

## Environment Variables

Create `.env` file (optional):
```bash
# Use real API (default: empty, uses mock data)
VITE_API_BASE_URL=https://your-api-server.com

# Force mock mode even with API URL set
VITE_USE_MOCK=true
```

## Adding New Features

### Adding a New API Endpoint

1. Define types in `src/types/api.ts`
2. Add endpoint URL to `src/api/endpoints.ts`
3. Create mock data in `src/mocks/`
4. Create API function in `src/api/` with mock/real switching pattern
5. Use the API function in page components

### Adding a New Page

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Layout.tsx`
4. Follow existing patterns for data fetching and state management

## Important Patterns

### Mock Data Delays

Mock functions include simulated delays to mimic real API behavior:
- Pipelines: 1500ms delay
- Saved views: 800ms delay
- Projects: 800ms delay

### Filter Conditions

The query builder uses a structured filter format:
```typescript
interface FilterCondition {
  field: string
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'NOT IN'
  value: string
  logic?: 'AND' | 'OR'
}
```

### Saved Views

Saved views store filter conditions for reuse:
- Stored via API (or mock in-memory storage)
- Include name and array of FilterCondition objects
- Can be loaded, saved, and deleted from Library tab

## Tech Stack

- **React 19** with hooks (no class components)
- **React Router 7** for routing
- **TypeScript 5.9** with strict mode
- **Vite 7** for build and dev server
- **Tailwind CSS v4** + **daisyUI 5** for styling
- **Vitest** for testing

## API Documentation

See `API.md` for detailed API endpoint documentation, query parameters, and integration examples.
