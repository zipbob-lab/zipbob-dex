"use client";

import { useEffect, useState } from "react";
import { useScrapStore } from "@/store/scrapStore";
import { useScrapData } from "@/hooks/useScrapData";
import RecipeCard from "@/components/mainPage/RecipeCard";
import EmptyContent from "@/components/common/EmptyContent";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/modal/ConfirmModal";

const ScrapPage = () => {
  const { selectedFolder, userId, setSelectedFolder } = useScrapStore();
  const {
    folderScrapCounts,
    existingFolders,
    scraps,
    deleteScrap,
    page,
    handlePageChange,
    refetchScraps,
    selectedFolderTotal,
    handleFolderClick
  } = useScrapData();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scrapToDelete, setScrapToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (userId && !selectedFolder) {
      setSelectedFolder("전체");
      handleFolderClick("전체");
      console.log(userId);
      console.log("scraps", scraps);
    }
  }, [userId, selectedFolder, setSelectedFolder, handleFolderClick]);

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleDeleteClick = (scrapId: string) => {
    setScrapToDelete(scrapId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteScrap = async () => {
    if (scrapToDelete) {
      await deleteScrap(scrapToDelete);

      setScrapToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  const filteredScraps = Array.isArray(scraps)
    ? scraps.filter((scrap) => selectedFolder === null || scrap.folder_name === selectedFolder)
    : [];

  return (
    <div className="mx-auto max-w-[1024px] gap-2 gap-y-5">
      <h1 className="py-8 text-heading-28">스크랩한 레시피</h1>

      {/* 폴더명 리스트 */}
      <div className="">
        <div className="flex gap-6 border-b-[1px] pt-2">
          <button
            onClick={() => handleFolderClick(null)}
            className={`relative flex w-24 items-center justify-center px-2 pb-1 text-body-16 ${
              selectedFolder === null ? "border-b-2 border-Primary-300 text-Primary-300" : "text-Gray-500"
            }`}
          >
            전체
            <span
              className={`ml-2 flex h-6 w-6 items-center justify-center rounded-full text-body-16 ${
                selectedFolder === null ? "bg-Primary-300 text-white" : "bg-Gray-500 text-white"
              }`}
            >
              {folderScrapCounts["전체"] || 0}
            </span>
          </button>
          {existingFolders?.map((folder) => (
            <button
              key={folder}
              onClick={() => handleFolderClick(folder)}
              className={`relative flex items-center px-2 pb-1 text-body-16 ${
                selectedFolder === folder ? "border-b-2 border-Primary-300 font-bold text-Primary-300" : "text-Gray-500"
              }`}
            >
              {folder}
              <span
                className={`ml-2 flex h-6 w-6 items-center justify-center rounded-full text-body-16 ${
                  selectedFolder === folder ? "bg-Primary-300 text-white" : "bg-Gray-200 text-white"
                }`}
              >
                {folderScrapCounts[folder] || 0}
              </span>
            </button>
          ))}
          <button
            onClick={toggleEditMode}
            className={`ml-auto text-body-16 ${isEditMode ? "font-bold text-Primary-300" : "text-Gray-500"}`}
          >
            편집
          </button>
        </div>

        {/* 해당 폴더의 레시피 리스트 */}
        {filteredScraps.length === 0 ? (
          <EmptyContent message="아직 스크랩한 레시피가 없어요!">
            <ul className="text-body-16 text-Gray-500">
              <li>· 집밥도감만의 레시피를 스크랩해 보세요.</li>
              <li>· 집밥도감 유저들이 올린 레시피를 스크랩해 보세요.</li>
            </ul>
          </EmptyContent>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-5 py-6 md:grid-cols-4 lg:grid-cols-4">
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
      <div className="pb-14">
        <Pagination
          currentPage={page}
          pageSize={8}
          totalItems={selectedFolderTotal}
          onPageChange={handlePageChange}
        ></Pagination>
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
    </div>
  );
};

export default ScrapPage;
