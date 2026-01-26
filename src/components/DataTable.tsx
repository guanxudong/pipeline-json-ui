import type { TableRow } from '../types'

interface DataTableProps {
  data: TableRow[]
  onViewJson?: (row: TableRow) => void
}

export default function DataTable({ data, onViewJson }: DataTableProps) {
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

  return (
    <div className="overflow-x-auto border border-base-300 rounded-lg">
      <table className="table">
        <thead>
          <tr>
            <th className="text-xs font-semibold uppercase">ID</th>
            <th className="text-xs font-semibold uppercase">Name</th>
            <th className="text-xs font-semibold uppercase">Status</th>
            <th className="text-xs font-semibold uppercase">Created At</th>
            <th className="text-xs font-semibold uppercase">Attributes</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="hover">
              <td className="text-sm font-mono">{row.id}</td>
              <td className="text-sm">{row.name}</td>
              <td>
                <span className={`badge ${getStatusBadge(row.status)} badge-sm`}>
                  {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </span>
              </td>
              <td className="text-sm text-base-content/70">{formatDate(row.createdAt)}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}