# Test Coverage Report

This document outlines the unit test coverage for the Pipeline Logs UI project.

## Test Files

### Components

1. **Pagination.test.tsx** - Tests pagination component
   - Row range calculations
   - Page navigation
   - Page number display
   - Rows per page selection
   - Button states (disabled/enabled)

2. **JsonModal.test.tsx** - Tests JSON modal component
   - Modal open/close behavior
   - JSON data display
   - Copy to clipboard functionality
   - Syntax highlighting
   - Various data types (objects, arrays, nested data)

3. **DataTable.test.tsx** - Tests data table component
   - Column rendering
   - Status badges
   - Date formatting
   - Row interactions
   - Custom column configurations

4. **QueryBuilderSidebar.test.tsx** - Tests query builder sidebar
   - Tab switching (Builder/Library)
   - Adding/removing conditions
   - Field/operator/value selection
   - SQL generation
   - Saved views management
   - Template quick-start

5. **Layout.test.tsx** - Tests main layout component
   - Header and navigation
   - Sidebar toggle
   - Active route highlighting
   - Escape key handling
   - ActiveFilterBar component

### Utilities

6. **filter.test.ts** - Tests filtering utilities
   - Filter conditions (=, !=, >, <, >=, <=, LIKE, IN, NOT IN)
   - Case insensitive matching
   - Multiple condition combinations
   - Date formatting
   - Status badge classes
   - Column header mapping

## Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with UI (requires @vitest/ui)
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Configuration

- **Test Runner**: Vitest
- **Testing Library**: React Testing Library
- **Environment**: jsdom
- **Setup File**: `src/test/setup.ts`

## Coverage Goals

- Components: >90%
- Utilities: >100%
- Overall: >80%

## Notes

- All tests use Vitest globals (describe, it, expect, vi)
- Mocks are set up in `src/test/setup.ts`
- ResizeObserver and navigator.clipboard are mocked
- Tests cleanup after each run
