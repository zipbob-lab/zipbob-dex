"use client";

import { useState, MouseEvent } from "react";
import { Bookmark, X } from "lucide-react";
import { useScrapStore } from "@/store/scrapStore";
import { useScrapData } from "@/hooks/useScrapData";
import { toast } from "react-toastify";
import CustomToast from "@/components/CustomToast";

const ScrapButton = ({ postId }: { postId: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { folderName, setFolderName, isSaving, setIsSaving } = useScrapStore();
  const { existingFolders, saveScrap, useFetchScrapCount } = useScrapData();

  // 포스트 스크랩 개수
  const { data: scrapCount } = useFetchScrapCount(postId);

  // 북마크 클릭 시 페이지 이동 방지 및 모달 열기
  const handleMarkClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsModalOpen((prev) => !prev);
  };

  const handleFolderClick = async (e: MouseEvent<HTMLButtonElement>, folder: string) => {
    e.preventDefault();
    setFolderName(folder);
    await handleSaveComplete(e);
  };

  // 저장 과정
  const handleSaveComplete = async (e: MouseEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const savedSuccessfully = await saveScrap({ recipeId: postId, folderName });
      if (savedSuccessfully) {
        toast(<CustomToast closeToast={() => toast.dismiss()} />, {
          theme: "dark",
          closeButton: false
        });
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
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setIsModalOpen(false)}
            >
              <X />
            </button>

            {/* 새 폴더 이름 입력 */}
            <div className="flex justify-between align-middle">
              <input
                type="text"
                placeholder="폴더 이름을 적어주세요"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="relative border-[1px] border-gray-300 p-2 w-full mb-2 rounded-sm"
              />
              <button onClick={handleSaveComplete} disabled={isSaving} className="absolute text-orange-500 p-2 right-8">
                {isSaving ? "저장 중..." : "만들기"}
              </button>
            </div>

            {/* 기존 폴더 목록 */}
            <div className="mt-4">
              {existingFolders?.map((folder) => (
                <button
                  key={folder}
                  onClick={(e) => handleFolderClick(e, folder)}
                  className="block text-left w-full p-2  mb-1 border-b"
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
