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
    <div className="flex items-center justify-center gap-6 px-4 py-3 bg-base-100 border-t border-base-300">
      <div className="flex items-center gap-3 text-sm text-base-content/70">
        <span>Rows per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="select select-bordered select-xs w-20"
        >
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="ml-6">
          {startItem} - {endItem} of {totalItems}
        </span>
      </div>

      <div className="join">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="join-item btn btn-sm"
        >
          «
        </button>

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
              className={`join-item btn btn-sm ${
                currentPage === pageNum ? 'btn-active' : ''
              }`}
            >
              {pageNum}
            </button>
          )
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="join-item btn btn-sm"
        >
          »
        </button>
      </div>
    </div>
  )
}