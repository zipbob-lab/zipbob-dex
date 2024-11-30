import LeftArrow from "@images/LeftArrow";
import RightArrow from "@images/RightArrow";

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  className?: string;
  buttonClassName?: string;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  className,
  buttonClassName,
  onPageChange
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const maxVisiblePages = 5;

  // 표시할 페이지 범위를 계산
  const halfVisiblePages = Math.floor(maxVisiblePages / 2);
  let startPage = Math.max(1, currentPage - halfVisiblePages);
  let endPage = Math.min(totalPages, currentPage + halfVisiblePages);

  // 페이지 범위가 5개 미만일 때 양쪽으로 채워서 항상 5개가 되도록 조정
  if (endPage - startPage + 1 < maxVisiblePages) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
  }

  const handlePageClick = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className={`text-body-14 ${className}`}>
      {/* 이전 버튼 */}
      <div className="flex items-center justify-between">
        <button
          aria-label="이전 페이지"
          onClick={() => handlePageClick(currentPage - 1)}
          className={`${buttonClassName}`}
        >
          <LeftArrow className="cursor-pointer stroke-[#C4C3BE] hover:stroke-Primary-300" />
        </button>

        {/* 페이지 번호 */}
        {Array.from({ length: maxVisiblePages }, (_, index) => {
          const page = startPage + index;
          return (
            <button
              key={index}
              onClick={() => handlePageClick(page)}
              disabled={page > totalPages}
              className={`min-h-[1.875rem;] min-w-[1.875rem;] gap-6 rounded sm:gap-3 ${
                currentPage === page ? "rounded-full bg-Primary-300 text-white" : "text-Primary-300"
              } ${page > totalPages ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {page}
            </button>
          );
        })}

        {/* 다음 버튼 */}
        <button
          aria-label="다음 페이지"
          onClick={() => handlePageClick(currentPage + 1)}
          className={`${buttonClassName}`}
        >
          <RightArrow className="cursor-pointer stroke-[#C4C3BE] hover:stroke-Primary-300" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
