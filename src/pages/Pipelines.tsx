import { useState } from 'react'
import DataTable, { type TableRow } from '../components/DataTable'
import Pagination from '../components/Pagination'
import FilterDrawer, { type FilterCondition, type SavedView } from '../components/FilterDrawer'
import JsonModal from '../components/JsonModal'

const mockPipelines: TableRow[] = [
  {
    id: 'pipe-001',
    name: 'Data Ingestion Pipeline',
    status: 'success',
    createdAt: '2024-01-24T10:30:00Z',
    data: {
      pipelineId: 'pipe-001',
      projectType: 'data-ingestion',
      status: 'success',
      executor: 'k8s-pod',
      duration: 245.67,
      recordsProcessed: 1250000,
      errorLogs: []
    }
  },
  {
    id: 'pipe-002',
    name: 'ML Model Training',
    status: 'running',
    createdAt: '2024-01-24T11:15:00Z',
    data: {
      pipelineId: 'pipe-002',
      projectType: 'ml-training',
      status: 'running',
      executor: 'gpu-pod',
      duration: 1234.5,
      epoch: 15,
      accuracy: 0.9234
    }
  },
  {
    id: 'pipe-003',
    name: 'ETL Daily Job',
    status: 'failed',
    createdAt: '2024-01-24T12:00:00Z',
    data: {
      pipelineId: 'pipe-003',
      projectType: 'etl',
      status: 'failed',
      executor: 'aws-lambda',
      duration: 45.23,
      errorLogs: ['Connection timeout to database', 'Retry exhausted']
    }
  },
  {
    id: 'pipe-004',
    name: 'Report Generation',
    status: 'success',
    createdAt: '2024-01-24T12:30:00Z',
    data: {
      pipelineId: 'pipe-004',
      projectType: 'reporting',
      status: 'success',
      executor: 'serverless',
      duration: 12.45,
      reportsGenerated: 42
    }
  },
  {
    id: 'pipe-005',
    name: 'Data Validation',
    status: 'pending',
    createdAt: '2024-01-24T13:00:00Z',
    data: {
      pipelineId: 'pipe-005',
      projectType: 'validation',
      status: 'pending',
      executor: 'k8s-job',
      duration: 0,
      scheduledFor: '2024-01-24T14:00:00Z'
    }
  },
  {
    id: 'pipe-006',
    name: 'Archive Cleanup',
    status: 'success',
    createdAt: '2024-01-24T13:30:00Z',
    data: {
      pipelineId: 'pipe-006',
      projectType: 'maintenance',
      status: 'success',
      executor: 'cron-job',
      duration: 8.9,
      filesArchived: 15600
    }
  },
  {
    id: 'pipe-007',
    name: 'API Sync',
    status: 'failed',
    createdAt: '2024-01-24T14:00:00Z',
    data: {
      pipelineId: 'pipe-007',
      projectType: 'sync',
      status: 'failed',
      executor: 'aws-lambda',
      duration: 23.1,
      errorLogs: ['503 Service Unavailable from upstream API']
    }
  },
  {
    id: 'pipe-008',
    name: 'Image Processing',
    status: 'running',
    createdAt: '2024-01-24T14:30:00Z',
    data: {
      pipelineId: 'pipe-008',
      projectType: 'processing',
      status: 'running',
      executor: 'batch-job',
      duration: 567.8,
      imagesProcessed: 4500,
      totalImages: 10000
    }
  },
  {
    id: 'pipe-009',
    name: 'Database Backup',
    status: 'success',
    createdAt: '2024-01-24T15:00:00Z',
    data: {
      pipelineId: 'pipe-009',
      projectType: 'backup',
      status: 'success',
      executor: 'cron-job',
      duration: 45.2,
      backupSize: '2.3 GB',
      backupLocation: 's3://backups/2024/01/24/'
    }
  },
  {
    id: 'pipe-010',
    name: 'Notification Service',
    status: 'pending',
    createdAt: '2024-01-24T15:30:00Z',
    data: {
      pipelineId: 'pipe-010',
      projectType: 'notifications',
      status: 'pending',
      executor: 'k8s-deployment',
      duration: 0,
      queueSize: 1250
    }
  },
  {
    id: 'pipe-011',
    name: 'Analytics Pipeline',
    status: 'success',
    createdAt: '2024-01-24T16:00:00Z',
    data: {
      pipelineId: 'pipe-011',
      projectType: 'analytics',
      status: 'success',
      executor: 'spark-job',
      duration: 890.5,
      eventsProcessed: 5000000
    }
  },
  {
    id: 'pipe-012',
    name: 'Security Scan',
    status: 'running',
    createdAt: '2024-01-24T16:30:00Z',
    data: {
      pipelineId: 'pipe-012',
      projectType: 'security',
      status: 'running',
      executor: 'container-scan',
      duration: 234.6,
      vulnerabilitiesFound: 3
    }
  }
]

const mockSavedViews: SavedView[] = [
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
  }
]

interface PipelinesProps {
  filterOpen?: boolean
  setFilterOpen?: (open: boolean) => void
}

export default function Pipelines({ filterOpen: externalFilterOpen, setFilterOpen: externalSetFilterOpen }: PipelinesProps) {
  const [filteredData, setFilteredData] = useState(mockPipelines)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [internalFilterOpen, setInternalFilterOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null)
  const [jsonModalOpen, setJsonModalOpen] = useState(false)

  const filterOpen = externalFilterOpen ?? internalFilterOpen
  const setFilterOpen = externalSetFilterOpen ?? setInternalFilterOpen

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

  const handleViewJson = (row: TableRow) => {
    setSelectedRow(row)
    setJsonModalOpen(true)
  }

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Pipelines</h1>
        <p className="text-sm text-gray-600 mt-1">
          Monitor and manage your pipeline executions
        </p>
      </div>

      <div className="space-y-4">
        <DataTable data={paginatedData} onViewJson={handleViewJson} />
        <Pagination
          totalItems={filteredData.length}
          itemsPerPage={rowsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={(rows) => {
            setRowsPerPage(rows)
            setCurrentPage(1)
          }}
        />
      </div>

      <FilterDrawer
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={handleFilterApply}
        savedViews={mockSavedViews}
      />

      <JsonModal
        isOpen={jsonModalOpen}
        onClose={() => setJsonModalOpen(false)}
        data={selectedRow?.data ?? {}}
      />
    </div>
  )
}
