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

- **Components**: PascalCase (DataTable, FilterDrawer)
- **Functions/Variables**: camelCase (getData, handleFilter)
- **Constants**: camelCase (mockPipelines, savedViews)
- **Interfaces/Types**: PascalCase (TableRow, FilterCondition)
- **Props**: camelCase matching data shape (onViewJson, filterOpen)

### File Organization

```
src/
├── components/     # Reusable UI components
├── pages/         # Route components
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
- **Mock data in components** - replace with API calls when backend ready
- **State management**: React hooks only (no Redux/Context needed yet)
- **Routing**: React Router v7; Forms: controlled components with onChange

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
