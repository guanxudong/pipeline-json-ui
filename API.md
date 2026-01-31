# API Integration Guide

This project supports both mock data and real backend API. Switch between them using environment variables.

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

- Data: `src/mocks/pipelines.ts`, `src/mocks/projects.ts`, `src/mocks/savedViews.ts`
- Filtering: Server-side simulation
- CRUD: In-memory storage that persists during session

### Real API Mode

To connect to your real backend:

1. Set `VITE_API_BASE_URL` to your API server URL
2. Ensure your API supports the endpoints below

## API Endpoints

### Pipelines

- **GET** `/api/pipelines` - Get pipelines list with optional filters

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status (success, failed, running, pending) |
| projectType | string | Filter by project type (java-11, java-17, python-3.6, node-22, dotNet-18) |
| executor | string | Filter by executor |
| durationGte | number | Minimum duration in seconds |
| durationLte | number | Maximum duration in seconds |
| limit | number | Number of results |
| offset | number | Pagination offset |

### Projects

- **GET** `/api/projects` - Get projects list with optional filters

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status (active, deploying, processing, configuring, error) |
| projectType | string | Filter by project type (java-11, java-17, python-3.6, node-22, dotNet-18) |
| language | string | Filter by programming language |
| limit | number | Number of results |
| offset | number | Pagination offset |

### Saved Views (Query Builder Library)

- **GET** `/api/saved-views` - Get all saved filter views
- **POST** `/api/saved-views` - Create a new saved view
  - Body: `{ name: string, conditions: FilterCondition[] }`
- **DELETE** `/api/saved-views/:id` - Delete a saved view

## Query Builder

The sidebar features a SQL-style query builder with two tabs:

### Builder Tab
Create WHERE conditions with:
- **Fields**: PIPELINE_ID, PROJECT_TYPE, STATUS, CREATED_AT, DURATION, EXECUTOR
- **Operators**: =, !=, >, <, >=, <=, LIKE, IN, NOT IN
- **Logic**: AND/OR between conditions
- Features: SQL preview, copy to clipboard, clear all, apply query (Ctrl+Enter)

### Library Tab
Manage saved filter views:
- Click to load a saved view into the Builder
- Delete views with hover button
- Shows condition preview for each view

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
3. Create API function in `src/api/` directory with mock/real switching

Example:
```typescript
// src/api/users.ts
import { get } from './client'
import { ENDPOINTS } from './endpoints'
import { USE_MOCK } from '../config/api'
import type { User, UserQuery } from '../types/api'

export async function getUsers(query: UserQuery = {}): Promise<User[]> {
  if (USE_MOCK) {
    return mockUsers // from src/mocks/users.ts
  }
  
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
