"use client";

import React, { useState } from "react";
import { useScrap } from "@/hooks/useScrap";
import { Bookmark } from "lucide-react";
import { redirect } from "next/navigation";

const BookmarkButton = ({ recipeId }: { recipeId: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { folderName, setFolderName, isSaving, saveScrap, existingFolders } = useScrap();

  const handleMarkClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFolderClick = (folder: string) => {
    setFolderName(folder);
    saveScrap(recipeId);
    setIsModalOpen(false); //저장되면 사라짐
    redirect("/scraps");
  };

  return (
    <div>
      <div className="relative" onClick={handleMarkClick}>
        <Bookmark />
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
              onClick={() => {
                saveScrap(recipeId);
                setIsModalOpen(false);
              }}
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
                  className="block text-left w-full bg-gray-200 p-2 rounded-lg mb-1 hover:bg-gray-300"
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

export default BookmarkButton;
