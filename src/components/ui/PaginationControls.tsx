type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  perPage: number;
  onPageChange: (page: number, perPage: number) => void;
};

export function PaginationControls({
  currentPage,
  totalPages,
  perPage,
  onPageChange,
}: PaginationControlsProps) {
  const goToPage = (page: number, perPageValue = perPage) => {
    onPageChange(page, perPageValue);
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const perPageValue = parseInt(e.target.value, 10);
    goToPage(1, perPageValue);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4 text-sm">
      {/* Per Page Selector */}
      <div className="flex items-center gap-3">
        <span className="font-medium text-gray-700">Items per page:</span>
        <select
          value={perPage}
          onChange={handlePerPageChange}
          className="w-[110px] border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Page Info + Navigation */}
      <div className="flex items-center gap-4 text-gray-900">
        <span className="font-medium">{`Page ${currentPage} of ${totalPages}`}</span>

        <div className="flex gap-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
            className="border border-gray-300 rounded-lg px-4 py-1.5 text-sm font-medium bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
          >
            Previous
          </button>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => goToPage(currentPage + 1)}
            className="border border-gray-300 rounded-lg px-4 py-1.5 text-sm font-medium bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
