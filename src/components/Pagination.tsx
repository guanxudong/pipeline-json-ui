

interface PaginationProps {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rows: number) => void
}

export default function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onRowsPerPageChange
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const rowsPerPageOptions = [10, 25, 50, 100]

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>Rows per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="ml-4">
          {startItem} - {endItem} of {totalItems}
        </span>
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Previous"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Next"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
