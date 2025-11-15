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
    <div className="flex items-center justify-between mt-4 text-sm">
      <div className="flex items-center gap-2">
        <span>عدد العناصر في الصفحة:</span>
        <select
          className="w-[100px] border rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={perPage}
          onChange={handlePerPageChange}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="flex items-center gap-4 text-gray-900">
        <span>{`الصفحة ${currentPage} من ${totalPages}`}</span>
        <div className="flex gap-2">
          <button
            className="border rounded-md px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
            disabled={currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            السابق
          </button>
          <button
            className="border rounded-md px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
            disabled={currentPage >= totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  );
}
