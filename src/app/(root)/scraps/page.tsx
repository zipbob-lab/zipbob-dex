"use client";

import { useEffect, useState } from "react";
import { useScrapStore } from "@/store/scrapStore";
import { useScrapData } from "@/hooks/useScrapData";
import RecipeCard from "@/components/mainPage/RecipeCard";
import EmptyContent from "@/components/common/EmptyContent";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/modal/ConfirmModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const ScrapPage = () => {
  const { selectedFolder, userId, setSelectedFolder } = useScrapStore();
  const {
    folderScrapCounts,
    existingFolders,
    scraps,
    deleteScrap,
    page,
    totalItems,
    handlePageChange,
    // selectedFolderTotal,
    handleFolderClick,
    refetchScraps
  } = useScrapData();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scrapToDelete, setScrapToDelete] = useState<string | null>(null);

  // 데이터 로딩 상태 관리
  useEffect(() => {
    if (scraps !== undefined) {
      // 데이터가 존재할 때 로딩 완료 상태로 전환
      setIsLoading(false);
    }
  }, [scraps]);

  useEffect(() => {
    if (userId) {
      if (!selectedFolder) {
        setSelectedFolder("전체");
      } else {
        refetchScraps();
      }
    }
  }, [userId, selectedFolder, page, setSelectedFolder, refetchScraps]);

  // 편집 버튼 토글
  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  // 삭제 기능 + 삭제 재확인 모달 활성화
  const handleDeleteClick = (scrapId: string) => {
    setScrapToDelete(scrapId);
    setIsDeleteModalOpen(true);
  };

  // 삭제 확인 모달 로직
  const confirmDeleteScrap = async () => {
    if (scrapToDelete) {
      await deleteScrap(scrapToDelete);

      setScrapToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  const filteredScraps = Array.isArray(scraps)
    ? selectedFolder === "전체"
      ? scraps
      : scraps.filter((scrap) => scrap.folder_name === selectedFolder)
    : [];

  if (scraps && existingFolders.length === 0) {
    <EmptyContent message="아직 스크랩한 레시피가 없어요!">
      <ul className="text-body-16 text-Gray-500">
        <li>· 집밥도감만의 레시피를 스크랩해 보세요.</li>
        <li>· 집밥도감 유저들이 올린 레시피를 스크랩해 보세요.</li>
      </ul>
    </EmptyContent>;
  }

  return (
    <div className="mx-auto flex max-w-[1024px] flex-col justify-center px-[4.5rem] pb-16 pt-8 sm:max-w-[336px] sm:pb-[32px] sm:pt-8">
      <h1 className="pb-[0.75rem] text-heading-28 text-Gray-900 sm:text-heading-20">스크랩한 레시피</h1>

      {/* 로딩 중일 때 화면 표시 */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* 폴더명 리스트 */}
          <div className="">
            <div className="flex gap-x-6 border-b-[1px] pt-2">
              <button
                onClick={() => handleFolderClick("전체")}
                className={`relative flex items-center justify-center px-2 pb-1 text-center text-body-16 ${
                  selectedFolder === "전체" ? "border-b-2 border-Primary-300 text-Primary-300" : "text-Gray-500"
                }`}
              >
                전체
                <span
                  className={`ml-2 flex h-6 w-6 items-center justify-center rounded-full text-body-16 ${
                    selectedFolder === "전체" ? "bg-Primary-200 text-white" : "bg-Gray-500 text-white"
                  }`}
                >
                  {folderScrapCounts["전체"] || 0}
                </span>
              </button>
              {existingFolders?.map((folder) => (
                <button
                  key={folder}
                  onClick={() => handleFolderClick(folder)}
                  className={`relative flex items-center justify-center px-2 pb-1 text-center text-body-16 ${
                    selectedFolder === folder
                      ? "border-b-2 border-Primary-200 text-body-16 text-Primary-200"
                      : "text-Gray-500"
                  }`}
                >
                  {folder}
                  <span
                    className={`ml-2 flex h-6 w-6 items-center justify-center rounded-full text-body-16 ${
                      selectedFolder === folder ? "bg-Primary-300 text-white" : "bg-Gray-500 text-white"
                    }`}
                  >
                    {folderScrapCounts[folder] || 0}
                  </span>
                </button>
              ))}
              <button
                onClick={toggleEditMode}
                className={`ml-auto text-body-16 ${isEditMode ? "text-body-16 text-Primary-300" : "text-Gray-500"}`}
              >
                편집
              </button>
            </div>

            {/* 해당 폴더의 레시피 리스트 */}
            <div className="pt-6">
              {filteredScraps.length === 0 ? (
                <EmptyContent message="아직 스크랩한 레시피가 없어요!">
                  <ul className="text-body-16 text-Gray-500">
                    <li>· 집밥도감만의 레시피를 스크랩해 보세요.</li>
                    <li>· 집밥도감 유저들이 올린 레시피를 스크랩해 보세요.</li>
                  </ul>
                </EmptyContent>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 pb-7 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
                  {filteredScraps.map((scrap) => {
                    let recipeDetail;
                    try {
                      recipeDetail = JSON.parse(scrap.scraped_recipe);
                    } catch (e) {
                      console.error("스크랩 데이터 파싱 중 오류 발생", e);
                      return null;
                    }

                    return (
                      <RecipeCard
                        key={scrap.scrap_id}
                        post={recipeDetail}
                        isEditMode={isEditMode}
                        onDelete={() => handleDeleteClick(scrap.scrap_id)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="text-Primary-300">
            <Pagination currentPage={page} pageSize={8} totalItems={totalItems} onPageChange={handlePageChange} />
          </div>

          {/* 삭제 확인 모달 */}
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDeleteScrap}
            title="스크랩한 레시피를 삭제하시겠어요?"
            confirmText="삭제하기"
            cancelText="취소하기"
          />
        </>
      )}
    </div>
  );
};

export default ScrapPage;
