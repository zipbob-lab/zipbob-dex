"use client";

import { useState } from "react";
import { useScrapStore } from "@/store/scrapStore";
import { useScrapData } from "@/hooks/useScrapData";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ScrapPage = () => {
  const { selectedFolder, setSelectedFolder } = useScrapStore();
  const { existingFolders, scraps, deleteScrap, refetchFolders } = useScrapData();
  const [isEditMode, setIsEditMode] = useState(false);

  const handleFolderClick = (folder: string | null) => {
    setSelectedFolder(folder);
  };

  // 편집 모드 토글 함수
  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  // 게시글이 전부 삭제되면 폴더도 바로 안 보여지기
  const handleDeleteScrap = async (scrapId: string) => {
    await deleteScrap(scrapId);
    refetchFolders();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mt-8 mb-4">스크랩한 레시피</h2>

      {/* 폴더명 리스트 */}
      <div className="mb-6">
        <div className="flex gap-2 border-b-2 py-2">
          <button onClick={() => handleFolderClick(null)}>
            전체
            <span className="ml-1 text-sm text-gray-500">({scraps?.length})</span>
          </button>
          {existingFolders?.map((folder) => (
            <button key={folder} onClick={() => handleFolderClick(folder)}>
              {folder}
              <span className="m-1 ">{folder.length}</span>
            </button>
          ))}
          {/* 편집 버튼 */}
          <button onClick={toggleEditMode} className="ml-auto">
            편집
          </button>
        </div>

        {/* 해당 폴더의 레시피 리스트 */}
        <div className="grid grid-cols-1 mt-8 md:grid-cols-4 gap-4">
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
                  <Link href={`/myrecipedetail/${recipeDetail.post_id}`} key={scrap.scrap_id}>
                    <div key={scrap.scrap_id} className="relative p-4 bg-white rounded-lg shadow">
                      {recipeDetail.recipe_img_done && (
                        <Image
                          src={recipeDetail.recipe_img_done}
                          alt={recipeDetail.recipe_title}
                          width={244}
                          height={244}
                          className="w-full h-48 object-cover rounded-md mb-4"
                        />
                      )}
                      <h4 className="text-lg font-bold">{recipeDetail.recipe_title}</h4>
                      <p className="text-sm text-gray-600">{recipeDetail.creator_nickname || "집밥도감 마스터"}</p>

                      {/* 편집 모드일 때만 삭제 아이콘 표시 */}
                      {isEditMode && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteScrap(scrap.scrap_id);
                          }}
                          className="absolute bottom-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default ScrapPage;
