# API Integration Guide

This project now supports both mock data and real backend API. Switch between them using environment variables.

## Configuration

### Environment Variables

Create a `.env` file in the project root (optional):

```bash
# Use real API (default: empty, which uses mock)
VITE_API_BASE_URL=https://your-api-server.com

# Force mock mode (default: false)
VITE_USE_MOCK=true
```

### How it Works

- **If `VITE_API_BASE_URL` is empty**: Uses mock data from `src/mocks/`
- **If `VITE_API_BASE_URL` is set**: Makes HTTP requests to the API

### Mock Mode (Default)

By default, the app uses mock data. No configuration needed.

- Data: `src/mocks/pipelines.ts` and `src/mocks/projects.ts`
- Filtering: Server-side simulation (filter logic in `api/pipelines.ts` and `api/projects.ts`)

### Real API Mode

To connect to your real backend:

1. Set `VITE_API_BASE_URL` to your API server URL
2. Ensure your API supports these endpoints:
   - `GET /api/pipelines` - with query params for filtering
   - `GET /api/projects` - with query params for filtering

### Query Parameters

#### Pipelines
- `status`: Filter by status
- `projectType`: Filter by project type
- `executor`: Filter by executor
- `durationGte`: Minimum duration
- `durationLte`: Maximum duration
- `limit`: Number of results
- `offset`: Pagination offset

#### Projects
- `status`: Filter by status
- `projectType`: Filter by project type
- `language`: Filter by language
- `limit`: Number of results
- `offset`: Pagination offset

## Example Usage

```bash
# Use mock data (default)
npm run dev

# Use real API
VITE_API_BASE_URL=https://api.example.com npm run dev

# Force mock mode even with API URL set
VITE_API_BASE_URL=https://api.example.com VITE_USE_MOCK=true npm run dev
```

## Adding New API Endpoints

1. Define types in `src/types/api.ts`
2. Add endpoint URL to `src/api/endpoints.ts`
3. Create API function in `src/api/` directory

Example:
```typescript
// src/api/users.ts
import { get } from './client'
import { ENDPOINTS } from './endpoints'
import type { User, UserQuery } from '../types/api'

export async function getUsers(query: UserQuery = {}): Promise<User[]> {
  const params = {
    status: query.status,
    limit: query.limit,
    offset: query.offset
  }
  return get<User[]>(ENDPOINTS.users, params)
}
```

## Type Safety

All API calls are fully typed. The project uses TypeScript with strict mode enabled, ensuring type safety throughout the API layer.
