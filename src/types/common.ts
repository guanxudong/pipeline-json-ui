export interface TableRow {
  id: string
  name: string
  status: 'success' | 'failed' | 'running' | 'pending'
  createdAt: string
  data: Record<string, unknown>
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
