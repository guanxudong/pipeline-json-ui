import { useState, useEffect, useCallback } from 'react'
import DataTable from '../components/DataTable'
import Pagination from '../components/Pagination'
import JsonModal from '../components/JsonModal'
import Layout, { ActiveFilterBar } from '../components/Layout'
import { getProjects } from '../api/projects'
import { getSavedViews, createSavedView, deleteSavedView, type SavedViewResponse } from '../api/savedViews'
import type { TableRow, FilterCondition, Project, ProjectQuery } from '../types'
import type { ColumnType } from '../components/DataTable'

const PROJECT_COLUMNS: ColumnType[] = ['id', 'project', 'projectType', 'timestamp', 'lastUpdate', 'attributes']

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
  const [activeConditions, setActiveConditions] = useState<FilterCondition[]>([])
  const [savedViews, setSavedViews] = useState<SavedViewResponse[]>([])
  const [isLoadingViews, setIsLoadingViews] = useState(false)

  const fetchSavedViews = useCallback(async () => {
    setIsLoadingViews(true)
    try {
      const views = await getSavedViews()
      setSavedViews(views)
    } catch (err) {
      console.error('Failed to fetch saved views:', err)
    } finally {
      setIsLoadingViews(false)
    }
  }, [])

  void error

  const fetchData = useCallback(async (query: ProjectQuery = {}) => {
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
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchSavedViews()
  }, [fetchSavedViews])

  const handleSaveView = useCallback(async (name: string, conditions: FilterCondition[]) => {
    try {
      const newView = await createSavedView(name, conditions)
      setSavedViews(prev => [...prev, newView])
    } catch (err) {
      console.error('Failed to save view:', err)
    }
  }, [])

  const handleDeleteView = useCallback(async (viewId: string) => {
    try {
      await deleteSavedView(viewId)
      setSavedViews(prev => prev.filter(v => v.id !== viewId))
    } catch (err) {
      console.error('Failed to delete view:', err)
    }
  }, [])

  const handleFilterApply = useCallback((conditions: FilterCondition[]) => {
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

    setActiveConditions(conditions)
    fetchData(query)
    setCurrentPage(1)
  }, [fetchData, rowsPerPage])

  const handleClearFilters = useCallback(() => {
    setActiveConditions([])
    fetchData()
  }, [fetchData])

  const handleViewJson = useCallback((row: TableRow) => {
    setSelectedRow(row)
    setJsonModalOpen(true)
  }, [])

  const handleRowsPerPageChange = useCallback((rows: number) => {
    setRowsPerPage(rows)
    setCurrentPage(1)
  }, [])

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  return (
    <Layout 
      onFilterApply={handleFilterApply} 
      activeConditions={activeConditions}
      onClearFilters={handleClearFilters}
      savedViews={savedViews}
      onSaveView={handleSaveView}
      onDeleteView={handleDeleteView}
      isLoadingViews={isLoadingViews}
      onLibraryTabOpen={fetchSavedViews}
    >
      <ActiveFilterBar 
        conditions={activeConditions} 
        onClear={handleClearFilters}
      />
      <div className="p-6">
        <div className="space-y-4">
          <DataTable 
            data={paginatedData} 
            onViewJson={handleViewJson}
            columns={PROJECT_COLUMNS}
            loading={loading}
          />
          <Pagination
            totalItems={data.length}
            itemsPerPage={rowsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={handleRowsPerPageChange}
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
