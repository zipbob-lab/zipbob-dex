import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pagesToShow = 5;
  const currentRange = Math.floor((currentPage - 1) / pagesToShow);
  const startPage = currentRange * pagesToShow + 1;
  const endPage = Math.min(startPage + pagesToShow - 1, totalPages);

  return (
    <div className="mt-4 flex justify-center">
      {startPage > 1 && (
        <button onClick={() => onPageChange(startPage - pagesToShow)} className="mx-1 rounded bg-gray-200 px-3 py-1">
          &lt;
        </button>
      )}

      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`mx-1 rounded px-3 py-1 ${page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <button onClick={() => onPageChange(endPage + 1)} className="mx-1 rounded bg-gray-200 px-3 py-1">
          &gt;
        </button>
      )}
    </div>
  );
};

export default Pagination;
