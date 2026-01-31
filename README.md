# Pipeline Logs UI

A modern React application for monitoring and managing pipeline executions and projects. Built with React 19, TypeScript 5.9, Vite 7, and Tailwind CSS v4.

## Features

- **Pipelines Dashboard** - Monitor data pipelines, ETL jobs, ML training runs, and more
- **Projects Dashboard** - Track application deployments, services, and infrastructure
- **SQL Query Builder** - Advanced filtering with a sidebar query builder featuring:
  - Builder tab: Create WHERE conditions with field, operator, and value
  - Library tab: Save and load frequently used filter views (via API)
- **JSON Viewer** - Click attributes button to view detailed JSON data
- **Real-time Status** - Visual status badges for success, failed, running, pending

## Tech Stack

- **Framework**: React 19 + React Router 7
- **Language**: TypeScript 5.9 (strict mode)
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4 + daisyUI 5
- **Icons**: Inline SVG (Heroicons style)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (uses mock data by default)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

### Environment Variables

Create a `.env` file in the project root (optional):

```bash
# Use real API (default: empty, uses mock data)
VITE_API_BASE_URL=https://your-api-server.com

# Force mock mode even with API URL set
VITE_USE_MOCK=true
```

By default, the app uses mock data from `src/mocks/` directory.

### Project Structure

```
src/
├── api/           # API layer with mock/real switching
├── components/    # Reusable UI components
├── mocks/         # Mock data for development
├── pages/         # Route pages (Pipelines, Projects)
├── types/         # TypeScript types
├── config/        # Configuration files
└── App.tsx        # Router configuration
```

## API Integration

See [API.md](./API.md) for detailed API documentation including endpoints, query parameters, and examples.

## Code Style

The project follows strict TypeScript and React best practices:
- Strict mode enabled with no implicit any
- Explicit type imports (`import type`)
- Functional components with hooks only
- No `any` types - use `Record<string, unknown>` for generic objects

Run linting:
```bash
npm run lint
```

## License

MIT
