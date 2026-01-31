# Agents Guide - Pipeline Logs UI

Project-specific guidelines for AI coding agents working on this codebase.

## Project Overview

- **Tech Stack**: React 19, TypeScript 5.9, Vite 7, Tailwind CSS v4, React Router 7
- **Architecture**: SPA with component-based architecture
- **Design**: Professional DevOps dashboard, high-density data tables, light mode theme

## Essential Commands

```bash
npm run dev              # Start dev server (http://localhost:5173)
npm run lint            # Run ESLint on all files
npm run build           # Build for production (typecheck + vite build)
npm run preview         # Preview production build
```

**Note**: No test framework configured. Add Vitest/RTL when testing needed.

## Using Context7 for Framework Documentation

**IMPORTANT**: When creating or modifying React or Tailwind CSS code, always use Context7 MCP to retrieve latest documentation.

### When to Use Context7

You MUST use Context7 in these scenarios:

1. **React questions**: Hooks, component patterns, state management, lifecycle, events
2. **Tailwind CSS questions**: Utility classes, responsive design, plugins, customization
3. **Framework updates**: New features, deprecations, breaking changes, migration guides
4. **Best practices**: Performance, accessibility, testing, patterns
5. **Troubleshooting**: Unexpected behavior, errors, compatibility issues

### How to Use Context7

```bash
# For React queries
"Use context7 to get the latest React documentation about [topic]"

# For Tailwind CSS queries
"Use context7 to get the latest Tailwind CSS documentation about [topic]"
```

The MCP will resolve correct library ID, query latest documentation, and return up-to-date examples.

### Library IDs

- **React**: `/facebook/react`
- **Tailwind CSS**: `/tailwindlabs/tailwindcss`
- **React Router**: `/remix-run/react-router`

### Examples

✅ "How do I use React 19's new use() hook?" → Call Context7
✅ "What's the Tailwind CSS v4 syntax for custom properties?" → Call Context7
❌ "What color is gray-500?" → Use existing codebase patterns
❌ "How to run the dev server?" → See Essential Commands

## Code Style Guidelines

### TypeScript Configuration

- **Strict Mode**: Enabled (strict: true)
- **Type Imports**: Must use `import { type }` due to `verbatimModuleSyntax: true`
- **No Implicit Any**: Explicit types required for all variables/parameters/returns
- **Unused Checks**: Enabled (noUnusedLocals, noUnusedParameters)
- **Null Safety**: Use optional chaining (`?.`) and nullish coalescing (`??`)

### Import Organization

```typescript
// 1. React imports first
import { useState, useEffect } from 'react'
// 2. Third-party libraries
import { Link, useLocation } from 'react-router-dom'
// 3. Local components (use type imports)
import DataTable, { type TableRow } from '../components/DataTable'
```

### Component Structure

```typescript
interface ComponentProps {
  data: TableRow[]
  onAction?: (item: TableRow) => void  // Optional callbacks use ?
}

export default function ComponentName({ data, onAction }: ComponentProps) {
  const [state, setState] = useState(initialValue)
  return <div className="...">...</div>
}
```

### Type Definitions

- Use `interface` for object shapes (props, data structures)
- Use `type` for unions, literals, or mapped types
- Export types used by other components
- Use `Record<string, unknown>` instead of `any` for generic objects
- When type assertions needed, use `as unknown as Type` chain for safety

### React Patterns

- **Functional Components**: Use only, no class components
- **Hooks**: Prefer built-in hooks over custom unless complexity warrants it
- **Event Handlers**: Inline arrow functions for simple cases, memoized for complex
- **Conditional Rendering**: Use ternary operators and short-circuit evaluation (`&&`)
- **Lists**: Always provide `key` prop, prefer stable IDs over indices

**When in doubt about React patterns, use Context7 to get the latest React documentation.**

### Tailwind CSS v4

- Use `@import "tailwindcss"` in index.css (not v3 @tailwind directives)
- Prefer utility classes over custom CSS
- Use semantic color tokens (blue-600, not arbitrary values)
- Responsive design: mobile-first approach

**When in doubt about Tailwind CSS classes or features, use Context7 to get the latest Tailwind CSS documentation.**

```css
/* index.css */
@import "tailwindcss";
```

### Styling Conventions

- **Spacing**: Use Tailwind scale (p-4, m-2, space-x-4)
- **Typography**: text-sm, text-xs for dense data; font-medium, font-semibold for hierarchy
- **Colors**: Primary: blue-600 (hover: blue-700); Borders: gray-200/300; Text: gray-900/600/500
- **Transitions**: transition-colors, transition-all duration-300; Shadows: shadow-sm, shadow-2xl (modals)

### Naming Conventions

- **Components**: PascalCase (DataTable, Layout, JsonModal)
- **Functions/Variables**: camelCase (getData, handleFilter, addCondition)
- **Constants**: camelCase (mockPipelines, savedViews, fields, operators)
- **Interfaces/Types**: PascalCase (TableRow, FilterCondition, SavedView)
- **Props**: camelCase matching data shape (onViewJson, onFilterApply)

### File Organization

```
src/
├── components/     # Reusable UI components
│   ├── DataTable.tsx           # Table component with JSON viewer
│   ├── JsonModal.tsx           # Modal for displaying JSON data
│   ├── Layout.tsx              # Main layout with top nav
│   ├── Pagination.tsx          # Pagination controls
│   └── QueryBuilderSidebar.tsx # SQL query builder sidebar with Builder/Library tabs
├── pages/         # Route components
│   ├── Pipelines.tsx           # Pipelines page with filter support
│   └── Projects.tsx            # Projects page with filter support
├── mocks/         # Mock data and API responses
│   ├── pipelines.ts            # Pipeline mock data (20+ records)
│   ├── projects.ts             # Projects mock data (20+ records)
│   └── savedViews.ts           # Saved filter views mock data
├── App.tsx        # Router configuration
├── main.tsx       # Entry point
└── index.css      # Global styles
```

### Error Handling & Accessibility

- Use optional chaining: `selectedRow?.data ?? {}`
- Provide fallbacks: `onViewJson?.(row)`
- Include title attributes on icon-only buttons
- Use semantic HTML (button, nav, aside, main)
- Keyboard navigation: focus-visible styles

### SVG Icons

- Inline SVGs in components (no separate icon files)
- Use Heroicons-style stroke-based icons
- Consistent sizing: w-4 h-4 (small), w-5 h-5 (medium), w-6 h-6 (large)

```tsx
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="..." />
</svg>
```

## When Adding Features

1. **Always run `npm run lint` after changes** - fix all errors before committing
2. **Always run `npm run build`** - ensures type safety and production compatibility
3. **Follow existing patterns** - mimic component structure, naming, and styling
4. **Keep components focused** - single responsibility, extract when complexity grows
5. **Maintain type safety** - use TypeScript strictly, avoid `any`, use proper interfaces
6. **Test responsive behavior** - design works at mobile/tablet/desktop breakpoints

## Key Architectural Decisions

- **No external UI library** - custom components with Tailwind
- **Mock/Real API switching** - All API modules support USE_MOCK flag for seamless backend integration
- **State management**: React hooks only (no Redux/Context needed yet)
- **Routing**: React Router v7; Forms: controlled components with onChange
- **Layout structure**: Top navigation bar + toggleable right sidebar with SQL query builder
- **Filter architecture**: Query Builder as separate QueryBuilderSidebar component with onFilterApply callback
- **Query builder state**: Managed internally in QueryBuilderSidebar (activeTab, conditions, savedViews)

## Layout Architecture

The application uses a flexible layout system with:

### Top Navigation Bar
- Logo and app branding on the left
- Navigation links (Pipelines, Projects) as pills in the center
- Toggle button for right sidebar (blue background, "Search" label, icon)
- Responsive padding with space-x-6 for proper spacing

### Right Sidebar (SQL Query Builder)

- Toggleable sidebar (resizable, min 240px, max 600px)
- Two tabs: Builder and Library
- **Builder Tab**: SQL-style WHERE clause builder
  - Add/remove conditions with AND/OR logic
  - Field dropdown: PIPELINE_ID, PROJECT_TYPE, STATUS, CREATED_AT, DURATION, EXECUTOR
  - Operator dropdown: =, !=, >, <, >=, <=, LIKE, IN, NOT IN
  - Value text input
  - SQL Preview with Copy button
  - Quick-start templates for common queries
  - Save views to Library
  - Clear All and Apply Query buttons
- **Library Tab**: Saved views
  - List of named filter configurations
  - Click to load into Builder
  - Displays condition preview (truncated if long)
  - **Tooltip on hover**: Shows full query conditions for truncated text
  - Backend API integration for CRUD operations
  - Loading state support with spinner
  - Resize-aware: Tooltip only shows when text is actually truncated

### Layout Component Props
```typescript
interface LayoutProps {
  children: React.ReactNode
  onFilterApply?: (conditions: FilterCondition[]) => void
  activeConditions?: FilterCondition[]
  onClearFilters?: () => void
  savedViews?: SavedView[]
  onSaveView?: (name: string, conditions: FilterCondition[]) => void
  onDeleteView?: (viewId: string) => void
  isLoadingViews?: boolean
}

export interface FilterCondition {
  id: string
  field: string
  operator: string
  value: string
  logic: 'AND' | 'OR'
}

export interface SavedView {
  id: string
  name: string
  conditions: FilterCondition[]
}
```

### Page Integration
Pages (Pipelines, Projects) are wrapped in Layout component and provide `onFilterApply` callback:

```typescript
export default function Pipelines() {
  const [filteredData, setFilteredData] = useState(mockPipelines)

  const handleFilterApply = (conditions: FilterCondition[]) => {
    // Filter logic implementation
    setFilteredData(filtered)
  }

  return (
    <Layout onFilterApply={handleFilterApply}>
      {/* Page content */}
    </Layout>
  )
}
```

## Common Anti-Patterns to Avoid

```typescript
// DON'T: Use 'any'
const data: any = fetchData()

// DON'T: Type assertions without validation
const item = response as TableRow

// DON'T: Use index as key
items.map((item, i) => <div key={i}>{item}</div>)

// DON'T: Nested ternaries
condition ? a : (b ? c : d)  // Use helper function instead

// DON'T: Hardcoded strings in multiple places
"Pipeline Logs"  // Define as constant
```

## SQL Query Builder Implementation

The Layout component includes a fully functional SQL query builder in the right sidebar:

### Constants
```typescript
const fields = [
  'PIPELINE_ID',
  'PROJECT_TYPE',
  'STATUS',
  'CREATED_AT',
  'DURATION',
  'EXECUTOR'
]

const operators = ['=', '!=', '>', '<', '>=', '<=', 'LIKE', 'IN', 'NOT IN']
```

### Key Functions
- `addCondition()`: Creates new condition with auto-generated ID
- `removeCondition(id)`: Removes condition by ID
- `updateCondition(id, updates)`: Updates specific condition fields
- `clearAll()`: Resets all conditions
- `applyQuery()`: Calls onFilterApply callback with current conditions
- `loadView(view)`: Loads saved view conditions into builder
- `generateSQL()`: Generates SQL query from conditions
- `copySQL()`: Copies generated SQL to clipboard

### Filter Logic in Pages
Pages implement `handleFilterApply` to filter mock data:

```typescript
const handleFilterApply = (conditions: FilterCondition[]) => {
  let filtered = [...mockPipelines]

  conditions.forEach((condition) => {
    filtered = filtered.filter((row) => {
      const rowValue = String((row.data as unknown as Record<string, unknown>)[condition.field.toLowerCase()] || (row as unknown as Record<string, unknown>)[condition.field.toLowerCase()]).toLowerCase()
      const conditionValue = condition.value.toLowerCase()

      switch (condition.operator) {
        case '=':
          return rowValue === conditionValue
        case '!=':
          return rowValue !== conditionValue
        case 'LIKE':
          return rowValue.includes(conditionValue)
        default:
          return true
      }
    })
  })

  setFilteredData(filtered)
  setCurrentPage(1)
}
```

## Data Table Component

The DataTable component provides flexible column configuration:

### Column Configuration
- Configurable columns via `columns` prop
- Available column types: 'id', 'project', 'projectType', 'timestamp', 'lastUpdate', 'status', 'attributes'
- Default columns: ['id', 'name', 'status', 'createdAt', 'attributes']

### Column Definitions

| Column Type | Description | Display |
|-------------|-------------|---------|
| 'id' | Pipeline/Project ID | Monospace font |
| 'project' or 'name' | Project name | Plain text |
| 'projectType' | Runtime type | java-11, java-17, python-3.6, node-22, dotNet-18 |
| 'timestamp' or 'createdAt' | Creation timestamp | Formatted date/time |
| 'lastUpdate' | Last update timestamp | Formatted date/time |
| 'status' | Status badge | Badge with colors: success (green), failed (red), running (blue), pending (gray) |
| 'attributes' | JSON viewer button | Eye icon button that opens JSON modal |

### Usage
```typescript
<DataTable
  data={filteredData}
  columns={['id', 'project', 'status', 'attributes']}
  onViewJson={handleViewJson}
/>
```

## Page Column Configurations

### Pipelines Page
**Columns:** ID | Project | Project Type | Timestamp | Last Update | Status | Attributes

### Projects Page
**Columns:** ID | Project | Project Type | Timestamp | Last Update | Attributes
