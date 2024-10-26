"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useScrap } from "@/hooks/useScrap";
import { Recipe } from "@/types/Recipe";
import { Bookmark } from "lucide-react";
// import { toast } from "react-toastify";
// import CustomToast from "@/components/CustomToast";

const ScrapButton = ({ postId }: { postId: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipeData, setRecipeData] = useState<Recipe | null>(null);

  const { folderName, setFolderName, isSaving, saveScrap, existingFolders, scrapCounts, fetchRecipeScrapCount } =
    useScrap();

  // 스크랩 개수 가져오는 함수를 useCallback으로 메모이제이션
  const loadScrapCount = useCallback(() => {
    fetchRecipeScrapCount(postId);
  }, [fetchRecipeScrapCount, postId]);

  useEffect(() => {
    loadScrapCount(); // 해당 레시피의 스크랩 수
  }, [loadScrapCount]);

  // 북마크 버튼 클릭 시 입력 모달 창 띄우기
  const handleMarkClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  // 모달 창 닫기 버튼
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 기존 폴더 클릭하면 저장
  const handleFolderClick = async (folder: string) => {
    setFolderName(folder);
    await handleSaveComplete(folder);
    alert("저장되었습니다.");
  };

  // 완료 버튼 클릭하면 저장
  const handleSaveComplete = async (folder: string) => {
    if (!recipeData) return;

    await saveScrap(recipeData, folder);
    setIsModalOpen(false);
    alert("저장되었습니다.");
    // toast(<CustomToast closeToast={() => toast.dismiss()} />);
    loadScrapCount();
  };

  // recipeData가 로드된 후 스크랩 개수를 불러옴
  useEffect(() => {
    if (recipeData) {
      loadScrapCount();
    }
  }, [recipeData, loadScrapCount]);

  return (
    <div>
      <div className="flex" onClick={handleMarkClick}>
        <Bookmark />
        <span className="ml-2 text-sm font-medium text-gray-700">
          {scrapCounts[postId] || 0} {/* 해당 레시피의 스크랩 수 표시 */}
        </span>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={handleCloseModal}>
              ✕
            </button>

            {/* 새로운 폴더 입력 */}
            <input
              type="text"
              placeholder="새 폴더 이름 입력"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded-lg mb-2"
            />
            <button
              onClick={() => handleSaveComplete(folderName)}
              disabled={isSaving}
              className="bg-blue-500 text-white p-2 w-full rounded-lg"
            >
              {isSaving ? "저장 중..." : "스크랩 저장"}
            </button>

            {/* 기존 폴더 선택 */}
            <div className="mt-4">
              <h3 className="text-sm font-bold mb-2">기존 폴더:</h3>
              {existingFolders.map((folder) => (
                <button
                  key={folder}
                  onClick={() => handleFolderClick(folder)}
                  className="block text-left w-full p-2 rounded-lg mb-1 border-b-2"
                >
                  {folder}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrapButton;
