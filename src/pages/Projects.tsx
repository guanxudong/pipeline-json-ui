import { useState } from 'react'
import DataTable, { type TableRow } from '../components/DataTable'
import Pagination from '../components/Pagination'
import FilterDrawer, { type FilterCondition, type SavedView } from '../components/FilterDrawer'
import JsonModal from '../components/JsonModal'

const mockProjects: TableRow[] = [
  {
    id: 'proj-001',
    name: 'E-Commerce Platform',
    status: 'success',
    createdAt: '2024-01-20T08:00:00Z',
    data: {
      projectId: 'proj-001',
      projectType: 'web-app',
      status: 'active',
      repository: 'github.com/company/ecommerce',
      language: 'TypeScript',
      lastDeployed: '2024-01-24T10:00:00Z',
      team: 'frontend'
    }
  },
  {
    id: 'proj-002',
    name: 'Payment Service',
    status: 'running',
    createdAt: '2024-01-18T14:30:00Z',
    data: {
      projectId: 'proj-002',
      projectType: 'microservice',
      status: 'deploying',
      repository: 'github.com/company/payment',
      language: 'Go',
      replicas: 3,
      cpuUsage: '45%'
    }
  },
  {
    id: 'proj-003',
    name: 'Analytics Dashboard',
    status: 'success',
    createdAt: '2024-01-22T11:00:00Z',
    data: {
      projectId: 'proj-003',
      projectType: 'dashboard',
      status: 'active',
      repository: 'github.com/company/analytics',
      language: 'Python',
      charts: 24,
      dataSources: 8
    }
  },
  {
    id: 'proj-004',
    name: 'User Management API',
    status: 'failed',
    createdAt: '2024-01-19T09:15:00Z',
    data: {
      projectId: 'proj-004',
      projectType: 'api',
      status: 'error',
      repository: 'github.com/company/user-api',
      language: 'Node.js',
      errorRate: '2.3%',
      lastError: 'Database connection timeout'
    }
  },
  {
    id: 'proj-005',
    name: 'Mobile App Backend',
    status: 'pending',
    createdAt: '2024-01-23T16:45:00Z',
    data: {
      projectId: 'proj-005',
      projectType: 'mobile-backend',
      status: 'configuring',
      repository: 'github.com/company/mobile-api',
      language: 'Java',
      endpoints: 42,
      scheduledFor: '2024-01-25T09:00:00Z'
    }
  },
  {
    id: 'proj-006',
    name: 'Notification Service',
    status: 'success',
    createdAt: '2024-01-21T13:20:00Z',
    data: {
      projectId: 'proj-006',
      projectType: 'microservice',
      status: 'active',
      repository: 'github.com/company/notifications',
      language: 'Rust',
      throughput: '50K msg/min'
    }
  },
  {
    id: 'proj-007',
    name: 'Data Pipeline',
    status: 'running',
    createdAt: '2024-01-17T10:00:00Z',
    data: {
      projectId: 'proj-007',
      projectType: 'etl',
      status: 'processing',
      repository: 'github.com/company/data-pipeline',
      language: 'Scala',
      clusterSize: '10 nodes'
    }
  },
  {
    id: 'proj-008',
    name: 'Admin Portal',
    status: 'success',
    createdAt: '2024-01-22T15:30:00Z',
    data: {
      projectId: 'proj-008',
      projectType: 'web-app',
      status: 'active',
      repository: 'github.com/company/admin',
      language: 'React',
      pages: 18,
      users: 1250
    }
  }
]

const mockSavedViews: SavedView[] = [
  {
    id: 'view-1',
    name: 'Active Projects',
    conditions: [
      { id: '1', field: 'STATUS', operator: '=', value: 'success', logic: 'AND' }
    ]
  }
]

interface ProjectsProps {
  filterOpen?: boolean
  setFilterOpen?: (open: boolean) => void
}

export default function Projects({ filterOpen: externalFilterOpen, setFilterOpen: externalSetFilterOpen }: ProjectsProps) {
  const [filteredData, setFilteredData] = useState(mockProjects)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [internalFilterOpen, setInternalFilterOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null)
  const [jsonModalOpen, setJsonModalOpen] = useState(false)

  const filterOpen = externalFilterOpen ?? internalFilterOpen
  const setFilterOpen = externalSetFilterOpen ?? setInternalFilterOpen

  const handleFilterApply = (conditions: FilterCondition[]) => {
    let filtered = [...mockProjects]

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
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage and monitor your projects
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
