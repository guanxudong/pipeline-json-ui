import type { TableRow } from '../types'

type ColumnType = 'id' | 'name' | 'project' | 'projectType' | 'status' | 'timestamp' | 'lastUpdate' | 'createdAt' | 'attributes'

interface DataTableProps {
  data: TableRow[]
  onViewJson?: (row: TableRow) => void
  columns?: ColumnType[]
}

const DEFAULT_COLUMNS: ColumnType[] = ['id', 'name', 'status', 'createdAt', 'attributes']

export default function DataTable({ data, onViewJson, columns = DEFAULT_COLUMNS }: DataTableProps) {
  const getStatusBadge = (status: TableRow['status']) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getColumnHeader = (column: ColumnType): string => {
    switch (column) {
      case 'id': return 'ID'
      case 'name': return 'Name'
      case 'project': return 'Project'
      case 'projectType': return 'Project Type'
      case 'status': return 'Status'
      case 'timestamp': return 'Timestamp'
      case 'lastUpdate': return 'Last Update'
      case 'createdAt': return 'Created At'
      case 'attributes': return 'Attributes'
      default: return column
    }
  }

  const renderCell = (row: TableRow, column: ColumnType) => {
    switch (column) {
      case 'id':
        return <td className="text-sm font-mono">{row.id}</td>
      case 'name':
      case 'project':
        return <td className="text-sm">{row.name}</td>
      case 'projectType':
        return <td className="text-sm">{(row.data.projectType as string) || '-'}</td>
      case 'status':
        return (
          <td>
            <span className={`badge ${getStatusBadge(row.status)} badge-sm`}>
              {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
            </span>
          </td>
        )
      case 'timestamp':
      case 'createdAt':
        return <td className="text-sm text-base-content/70">{formatDate(row.createdAt)}</td>
      case 'lastUpdate':
        return <td className="text-sm text-base-content/70">{formatDate((row.data.lastUpdate as string) || row.createdAt)}</td>
      case 'attributes':
        return (
          <td>
            <button
              onClick={() => onViewJson?.(row)}
              className="btn btn-ghost btn-sm btn-square"
              title="View JSON"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </button>
          </td>
        )
      default:
        return <td>-</td>
    }
  }

  return (
    <div className="overflow-x-auto border border-base-300 rounded-lg">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} className="text-xs font-semibold uppercase">
                {getColumnHeader(column)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="hover">
              {columns.map((column) => renderCell(row, column))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}