"use client";

import { useState } from "react";
import { useScrapStore } from "@/store/scrapStore";
import { useScrapData } from "@/hooks/useScrapData";
import RecipeCard from "@/components/mainPage/RecipeCard";
import DeleteCheckModal from "@/components/common/modal/DeleteCheckModal";

const ScrapPage = () => {
  const { selectedFolder, setSelectedFolder } = useScrapStore();
  const { existingFolders, scraps, deleteScrap, refetchFolders } = useScrapData();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scrapToDelete, setScrapToDelete] = useState<string | null>(null);

  const handleFolderClick = (folder: string | null) => {
    setSelectedFolder(folder);
  };

  // 편집 모드 토글 함수
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
      refetchFolders();
      setScrapToDelete(null);
    }
    setIsDeleteModalOpen(false);
  };

  // 폴더별 스크랩 개수를 즉시 계산
  const folderScrapCounts = scraps?.reduce((counts: { [key: string]: number }, scrap) => {
    const folder = scrap.folder_name || "전체";
    counts[folder] = (counts[folder] || 0) + 1;
    counts["전체"] = (counts["전체"] || 0) + 1;
    return counts;
  }, {});

  return (
    <div className="min-h-screen px-52">
      <h1 className="mb-3 ml-48 pt-8 text-heading-28">스크랩한 레시피</h1>

      {/* 폴더명 리스트 */}
      <div className="mx-48 mb-6">
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
              {folderScrapCounts ? folderScrapCounts["전체"] || 0 : 0}
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
                {folderScrapCounts ? folderScrapCounts[folder] || 0 : 0}
              </span>
            </button>
          ))}
          {/* 편집 버튼 */}
          <button
            onClick={toggleEditMode}
            className={`ml-auto text-body-16 ${isEditMode ? "font-bold text-Primary-300" : "text-Gray-500"}`}
          >
            편집
          </button>
        </div>

        {/* 해당 폴더의 레시피 리스트 */}
        <div className="mx-4 mt-8 grid grid-cols-2 gap-x-24 gap-y-16 md:grid-cols-4 lg:grid-cols-4">
          {Array.isArray(scraps) &&
            scraps
              .filter((scrap) => selectedFolder === null || scrap.folder_name === selectedFolder)
              .map((scrap) => {
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
      </div>

      {/* 삭제 확인 모달 */}
      <DeleteCheckModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={confirmDeleteScrap}
      />
    </div>
  );
};

export default ScrapPage;
