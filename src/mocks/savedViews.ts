import type { SavedView } from '../types'

export const mockSavedViews: SavedView[] = [
  {
    id: 'view-1',
    name: 'Failed Pipelines',
    conditions: [
      { id: '1', field: 'STATUS', operator: '=', value: 'failed', logic: 'AND' }
    ]
  },
  {
    id: 'view-2',
    name: 'Running or Pending',
    conditions: [
      { id: '1', field: 'STATUS', operator: '=', value: 'running', logic: 'OR' },
      { id: '2', field: 'STATUS', operator: '=', value: 'pending', logic: 'OR' }
    ]
  },
  {
    id: 'view-3',
    name: 'Long Running (>5min)',
    conditions: [
      { id: '1', field: 'DURATION', operator: '>', value: '300', logic: 'AND' }
    ]
  },
  {
    id: 'view-4',
    name: 'GitLab CI Only',
    conditions: [
      { id: '1', field: 'PROJECT_TYPE', operator: '=', value: 'gitlab', logic: 'AND' }
    ]
  }
]
