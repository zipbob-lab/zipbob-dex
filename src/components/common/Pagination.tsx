import Image from "next/image";
import React from "react";
import rightArrow from "@images/rightArrow.svg";
import leftArrow from "@images/leftArrow.svg";

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, pageSize, totalItems, onPageChange }) => {
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
    <div className="flex items-center justify-center gap-6 text-body-14 text-Gray-900">
      {/* 이전 버튼 */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-[14px] py-[5px] text-gray-900"
      >
        <Image src={leftArrow} alt="왼쪽 화살표" width={20} height={20} />
      </button>

      {/* 페이지 번호 */}
      {Array.from({ length: maxVisiblePages }, (_, index) => {
        const page = startPage + index;
        return (
          <button
            key={index}
            onClick={() => handlePageClick(page)}
            disabled={page > totalPages} // 존재하지 않는 페이지는 비활성화
            className={`min-h-[30px] min-w-[30px] rounded ${
              currentPage === page ? "rounded-full border border-Secondary-200 text-gray-900" : "text-gray-900"
            } ${page > totalPages ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {page}
          </button>
        );
      })}

      {/* 다음 버튼 */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-[14px] py-[5px] text-gray-900"
      >
        <Image src={rightArrow} alt="오른쪽 화살표" width={20} height={20} />
      </button>
    </div>
  );
};

export default Pagination;
