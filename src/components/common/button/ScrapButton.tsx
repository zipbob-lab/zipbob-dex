"use client";

import React, { useState } from "react";
import { Bookmark } from "lucide-react";
import { useScrapStore } from "@/store/scrapStore";
import { useScrapData } from "@/hooks/useScrapData";

const ScrapButton = ({ postId }: { postId: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { folderName, setFolderName, isSaving, setIsSaving } = useScrapStore();
  const { existingFolders, saveScrap, useFetchScrapCount } = useScrapData();

  // Fetch current scrap count for the post
  const { data: scrapCount } = useFetchScrapCount(postId);

  // Show modal on bookmark click
  const handleMarkClick = () => {
    setIsModalOpen((prev) => !prev);
  };

  // Save to an existing folder
  const handleFolderClick = async (folder: string) => {
    setFolderName(folder);
    await handleSaveComplete();
  };

  // Complete save process
  const handleSaveComplete = async () => {
    setIsSaving(true);

    try {
      const savedSuccessfully = await saveScrap({ recipeId: postId, folderName });
      if (savedSuccessfully) {
        alert("저장 완료");
      }
    } catch (error) {
      console.error("스크랩 저장 오류:", error);
    } finally {
      setIsSaving(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <div className="flex" onClick={handleMarkClick}>
        <Bookmark />
        <span className="ml-2 text-sm font-medium text-gray-700">{scrapCount || 0}</span>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>

            {/* 새 폴더 이름 입력 */}
            <input
              type="text"
              placeholder="새 폴더 이름 입력"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded-lg mb-2"
            />
            <button
              onClick={handleSaveComplete}
              disabled={isSaving}
              className="bg-blue-500 text-white p-2 w-full rounded-lg"
            >
              {isSaving ? "저장 중..." : "스크랩 저장"}
            </button>

            {/* 기존 폴더 목록 */}
            <div className="mt-4">
              <h3 className="text-sm font-bold mb-2">기존 폴더:</h3>

              {existingFolders?.map((folder) => (
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
