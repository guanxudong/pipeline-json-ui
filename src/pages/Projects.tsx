import { useState, useEffect } from 'react'
import DataTable from '../components/DataTable'
import Pagination from '../components/Pagination'
import JsonModal from '../components/JsonModal'
import Layout from '../components/Layout'
import { getProjects } from '../api/projects'
import type { TableRow, FilterCondition, Project, ProjectQuery } from '../types'

function projectToTableRow(project: Project): TableRow {
  return {
    id: project.id,
    name: project.name,
    status: project.status === 'active' || project.status === 'deploying' || project.status === 'processing' || project.status === 'configuring' ? 'running' : project.status === 'error' ? 'failed' : project.status as TableRow['status'],
    createdAt: project.createdAt,
    data: project as unknown as Record<string, unknown>
  }
}

export default function Projects() {
  const [data, setData] = useState<TableRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null)
  const [jsonModalOpen, setJsonModalOpen] = useState(false)

  void loading
  void error

  const fetchData = async (query: ProjectQuery = {}) => {
    setLoading(true)
    setError(null)
    try {
      const projects = await getProjects(query)
      const tableRows = projects.map(projectToTableRow)
      setData(tableRows)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFilterApply = (conditions: FilterCondition[]) => {
    const query: ProjectQuery = {
      offset: 0,
      limit: rowsPerPage * 5
    }

    conditions.forEach((condition) => {
      const value = condition.value.toLowerCase()
      
      switch (condition.field) {
        case 'STATUS':
          query.status = value
          break
        case 'PROJECT_TYPE':
          query.projectType = value
          break
        case 'LANGUAGE':
          query.language = value
          break
      }
    })

    fetchData(query)
    setCurrentPage(1)
  }

  const handleViewJson = (row: TableRow) => {
    setSelectedRow(row)
    setJsonModalOpen(true)
  }

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  return (
    <Layout onFilterApply={handleFilterApply}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-base-content/70 mt-1">
            Manage and monitor your projects
          </p>
        </div>

        <div className="space-y-4">
          <DataTable data={paginatedData} onViewJson={handleViewJson} />
          <Pagination
            totalItems={data.length}
            itemsPerPage={rowsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={(rows) => {
              setRowsPerPage(rows)
              setCurrentPage(1)
            }}
          />
        </div>
      </div>

      <JsonModal
        isOpen={jsonModalOpen}
        onClose={() => setJsonModalOpen(false)}
        data={selectedRow?.data ?? {}}
      />
    </Layout>
  )
}