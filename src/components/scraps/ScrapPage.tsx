"use client";

import { useEffect, useState } from "react";
import { useScrapStore } from "@/store/scrapStore";
import { useScrapData } from "@/hooks/useScrapData";
import RecipeCard from "@/components/mainPage/RecipeCard";
import ScrapPageNav from "./scrapPageNav";
import EmptyContent from "@/components/common/EmptyContent";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/modal/ConfirmModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const ScrapPage = () => {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const { selectedFolder, userId, setSelectedFolder } = useScrapStore();
  const {
    folderScrapCounts,
    existingFolders,
    scraps,
    deleteScrap,
    page,
    totalItems,
    handlePageChange,
    handleFolderClick,
    refetchScraps
  } = useScrapData();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scrapToDelete, setScrapToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 페이지입니다. 로그인 페이지로 이동합니다.");
      router.replace("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="mx-auto flex flex-col justify-center ssm:max-w-[336px] ssm:py-8 sm:max-w-[336px] sm:py-8 md:max-w-[668px] md:py-8 lg:max-w-[1024px] lg:pb-16 lg:pt-8">
      <h1 className="pb-3 text-Gray-900 ssm:text-title-20 sm:text-heading-20 md:text-heading-24">스크랩한 레시피</h1>

      {/* 로딩 중일 때 화면 표시 */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* 폴더명 리스트 */}
          <>
            <ScrapPageNav
              selectedFolder={selectedFolder || "전체"}
              folderScrapCounts={folderScrapCounts}
              existingFolders={existingFolders}
              handleFolderClick={handleFolderClick}
              toggleEditMode={() => setIsEditMode((prev) => !prev)}
              isEditMode={isEditMode}
            />

            {/* 해당 폴더의 레시피 리스트 */}
            <div className="pt-6">
              {filteredScraps.length === 0 ? (
                <EmptyContent message="아직 스크랩한 레시피가 없어요!">
                  <ul className="text-body-16 text-Gray-500">
                    <li>· 집밥도감의 레시피를 스크랩해 보세요.</li>
                    <li>· 내 마음대로 폴더명을 지어보세요.</li>
                  </ul>
                </EmptyContent>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
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
          </>
          <div className="flex items-center justify-center pt-7">
            <Pagination
              currentPage={page}
              pageSize={8}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              className="ssm:w-[336px] sm:w-[336px] sm:text-body-14 md:w-[438px] lg:w-[438px]"
            />
          </div>

          {/* 삭제 확인 모달 */}
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDeleteScrap}
            title="레시피를 삭제하시겠어요?"
            confirmText="삭제하기"
            cancelText="취소하기"
          />
        </>
      )}
    </div>
  );
};

export default ScrapPage;
