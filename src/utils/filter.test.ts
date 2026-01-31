import type { FilterCondition } from '../types'

describe('Filter Utilities', () => {
  const mockData = [
    {
      id: 'pipe-001',
      pipeline_id: 'pipe-001',
      name: 'Data Ingestion',
      status: 'success',
      project_type: 'java-11',
      created_at: '2024-01-24T10:30:00Z',
      duration: '245.67',
      executor: 'k8s-pod',
    },
    {
      id: 'pipe-002',
      pipeline_id: 'pipe-002',
      name: 'ML Training',
      status: 'running',
      project_type: 'java-17',
      created_at: '2024-01-24T11:15:00Z',
      duration: '1234.5',
      executor: 'gpu-pod',
    },
    {
      id: 'pipe-003',
      pipeline_id: 'pipe-003',
      name: 'ETL Job',
      status: 'failed',
      project_type: 'python-3.6',
      created_at: '2024-01-24T12:00:00Z',
      duration: '45.23',
      executor: 'aws-lambda',
    },
  ]

  describe('filterByConditions', () => {
    const filterByConditions = (
      data: Record<string, unknown>[],
      conditions: FilterCondition[]
    ): Record<string, unknown>[] => {
      let filtered = [...data]

      conditions.forEach((condition) => {
        filtered = filtered.filter((row) => {
          const rowValue = String(
            (row[condition.field.toLowerCase()] as string | undefined) ?? ''
          ).toLowerCase()
          const conditionValue = condition.value.toLowerCase()

          switch (condition.operator) {
            case '=':
              return rowValue === conditionValue
            case '!=':
              return rowValue !== conditionValue
            case '>':
              return parseFloat(rowValue) > parseFloat(conditionValue)
            case '<':
              return parseFloat(rowValue) < parseFloat(conditionValue)
            case '>=':
              return parseFloat(rowValue) >= parseFloat(conditionValue)
            case '<=':
              return parseFloat(rowValue) <= parseFloat(conditionValue)
            case 'LIKE':
              return rowValue.includes(conditionValue)
            case 'IN':
              const values = condition.value.split(',').map((v) => v.trim().toLowerCase())
              return values.includes(rowValue)
            case 'NOT IN':
              const notInValues = condition.value.split(',').map((v) => v.trim().toLowerCase())
              return !notInValues.includes(rowValue)
            default:
              return true
          }
        })
      })

      return filtered
    }

    it('filters by exact match (=)', () => {
      const conditions: FilterCondition[] = [
        { id: '1', field: 'STATUS', operator: '=', value: 'success', logic: 'AND' },
      ]

      const result = filterByConditions(mockData, conditions)
      expect(result).toHaveLength(1)
      expect(result[0].status).toBe('success')
    })

    it('filters by not equal (!=)', () => {
      const conditions: FilterCondition[] = [
        { id: '1', field: 'STATUS', operator: '!=', value: 'failed', logic: 'AND' },
      ]

      const result = filterByConditions(mockData, conditions)
      expect(result).toHaveLength(2)
    })

    it('filters by greater than (>)', () => {
      const conditions: FilterCondition[] = [
        { id: '1', field: 'DURATION', operator: '>', value: '200', logic: 'AND' },
      ]

      const result = filterByConditions(mockData, conditions)
      expect(result).toHaveLength(2)
    })

    it('filters by less than (<)', () => {
      const conditions: FilterCondition[] = [
        { id: '1', field: 'DURATION', operator: '<', value: '100', logic: 'AND' },
      ]

      const result = filterByConditions(mockData, conditions)
      expect(result).toHaveLength(1)
      expect(result[0].duration).toBe('45.23')
    })

    it('filters by greater than or equal (>=)', () => {
      const conditions: FilterCondition[] = [
        { id: '1', field: 'DURATION', operator: '>=', value: '245.67', logic: 'AND' },
      ]

      const result = filterByConditions(mockData, conditions)
      expect(result).toHaveLength(2)
    })

    it('filters by less than or equal (<=)', () => {
      const conditions: FilterCondition[] = [
        { id: '1', field: 'DURATION', operator: '<=', value: '100', logic: 'AND' },
      ]

      const result = filterByConditions(mockData, conditions)
      expect(result).toHaveLength(1)
    })

    it('filters by LIKE (contains)', () => {
      const conditions: FilterCondition[] = [
        { id: '1', field: 'STATUS', operator: 'LIKE', value: 'succ', logic: 'AND' },
      ]

      const result = filterByConditions(mockData, conditions)
      expect(result).toHaveLength(1)
      expect(result[0].status).toBe('success')
    })

    it('filters by IN operator', () => {
      const conditions: FilterCondition[] = [
        { id: '1', field: 'STATUS', operator: 'IN', value: 'success, running', logic: 'AND' },
      ]

      const result = filterByConditions(mockData, conditions)
      expect(result).toHaveLength(2)
    })

    it('filters by NOT IN operator', () => {
      const conditions: FilterCondition[] = [
        { id: '1', field: 'STATUS', operator: 'NOT IN', value: 'failed', logic: 'AND' },
      ]

      const result = filterByConditions(mockData, conditions)
      expect(result).toHaveLength(2)
    })

    it('handles case insensitive matching', () => {
      const conditions: FilterCondition[] = [
        { id: '1', field: 'STATUS', operator: '=', value: 'SUCCESS', logic: 'AND' },
      ]

      const result = filterByConditions(mockData, conditions)
      expect(result).toHaveLength(1)
    })

    it('combines multiple conditions with AND logic', () => {
      const conditions: FilterCondition[] = [
        { id: '1', field: 'STATUS', operator: '=', value: 'success', logic: 'AND' },
        { id: '2', field: 'PROJECT_TYPE', operator: '=', value: 'java-11', logic: 'AND' },
      ]

      const result = filterByConditions(mockData, conditions)
      expect(result).toHaveLength(1)
      expect(result[0].status).toBe('success')
      expect(result[0].project_type).toBe('java-11')
    })

    it('returns empty array when no matches', () => {
      const conditions: FilterCondition[] = [
        { id: '1', field: 'STATUS', operator: '=', value: 'pending', logic: 'AND' },
      ]

      const result = filterByConditions(mockData, conditions)
      expect(result).toHaveLength(0)
    })

    it('returns all data when conditions are empty', () => {
      const result = filterByConditions(mockData, [])
      expect(result).toHaveLength(3)
    })

    it('handles unknown operator', () => {
      const conditions: FilterCondition[] = [
        { id: '1', field: 'STATUS', operator: '~=' as any, value: 'success', logic: 'AND' },
      ]

      const result = filterByConditions(mockData, conditions)
      expect(result).toHaveLength(3)
    })

    it('handles missing fields gracefully', () => {
      const conditions: FilterCondition[] = [
        { id: '1', field: 'UNKNOWN_FIELD', operator: '=', value: 'value', logic: 'AND' },
      ]

      const result = filterByConditions(mockData, conditions)
      expect(result).toHaveLength(0)
    })

    it('handles numeric comparisons correctly', () => {
      const conditions: FilterCondition[] = [
        { id: '1', field: 'DURATION', operator: '>', value: '1000', logic: 'AND' },
      ]

      const result = filterByConditions(mockData, conditions)
      expect(result).toHaveLength(1)
      expect(result[0].duration).toBe('1234.5')
    })

    it('handles IN operator with comma-separated values', () => {
      const conditions: FilterCondition[] = [
        { id: '1', field: 'STATUS', operator: 'IN', value: 'success,failed,running', logic: 'AND' },
      ]

      const result = filterByConditions(mockData, conditions)
      expect(result).toHaveLength(3)
    })

    it('handles LIKE with partial matches', () => {
      const conditions: FilterCondition[] = [
        { id: '1', field: 'NAME', operator: 'LIKE', value: 'ML', logic: 'AND' },
      ]

      const result = filterByConditions(mockData, conditions)
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('ML Training')
    })
  })

  describe('Date Utilities', () => {
    it('formats date correctly', () => {
      const dateString = '2024-01-24T10:30:00Z'
      const formatted = new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })

      expect(formatted).toContain('Jan')
      expect(formatted).toContain('24')
      expect(formatted).toContain('2024')
    })

    it('handles different date formats', () => {
      const dates = [
        '2024-01-24T10:30:00Z',
        '2024-12-31T23:59:59Z',
        '2024-06-15T00:00:00Z',
      ]

      dates.forEach((date) => {
        expect(() => new Date(date).toISOString()).not.toThrow()
      })
    })
  })

  describe('Status Badge Utilities', () => {
    const getStatusBadgeClass = (status: string): string => {
      switch (status) {
        case 'success':
          return 'badge-success'
        case 'failed':
          return 'badge-error'
        case 'running':
          return 'badge-info'
        case 'pending':
          return 'badge-warning'
        default:
          return 'badge-neutral'
      }
    }

    it('returns correct badge class for success', () => {
      expect(getStatusBadgeClass('success')).toBe('badge-success')
    })

    it('returns correct badge class for failed', () => {
      expect(getStatusBadgeClass('failed')).toBe('badge-error')
    })

    it('returns correct badge class for running', () => {
      expect(getStatusBadgeClass('running')).toBe('badge-info')
    })

    it('returns correct badge class for pending', () => {
      expect(getStatusBadgeClass('pending')).toBe('badge-warning')
    })

    it('returns neutral badge class for unknown status', () => {
      expect(getStatusBadgeClass('unknown')).toBe('badge-neutral')
    })
  })

  describe('Column Header Utilities', () => {
    const getColumnHeader = (column: string): string => {
      const headerMap: Record<string, string> = {
        id: 'ID',
        name: 'Name',
        project: 'Project',
        projectType: 'Project Type',
        status: 'Status',
        timestamp: 'Timestamp',
        lastUpdate: 'Last Update',
        createdAt: 'Created At',
        attributes: 'Attributes',
      }
      return headerMap[column] || column
    }

    it('returns correct header for id column', () => {
      expect(getColumnHeader('id')).toBe('ID')
    })

    it('returns correct header for projectType column', () => {
      expect(getColumnHeader('projectType')).toBe('Project Type')
    })

    it('returns column name if not found in map', () => {
      expect(getColumnHeader('unknownColumn')).toBe('unknownColumn')
    })
  })
})
