"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useScrapStore } from "@/store/scrapStore";
import { useScrapData } from "@/hooks/useScrapData";
import ScrapModal from "../ScrapModal";
import CustomToast from "@/components/CustomToast";
import scrapEmpty from "@images/scrapEmpty.svg";
import scrapFill from "@images/scrapFill.svg";

const ScrapButton = ({ postId }: { postId: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrapped, setIsScrapped] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { folderName, setFolderName, isSaving, setIsSaving } = useScrapStore();
  const { existingFolders, saveScrap, useFetchScrapCount, isAlreadyScrapped } = useScrapData();

  // 포스트 스크랩 개수
  const { data: scrapCount } = useFetchScrapCount(postId);

  // 스크랩 여부 확인 후 아이콘 칠하기
  useEffect(() => {
    const checkScrapStatus = async () => {
      const scrapped = await isAlreadyScrapped(postId);
      setIsScrapped(scrapped);
    };
    checkScrapStatus();
  }, [postId, isAlreadyScrapped]);

  // 북마크 클릭 시 모달 열기
  const handleMarkClick = () => {
    setIsModalOpen(true);
  };

  const handleFolderClick = (folder: string) => {
    setFolderName(folder);
  };

  // 저장 성공 시 토스트 표시
  const handleSaveComplete = async () => {
    setIsSaving(true);
    try {
      const savedSuccessfully = await saveScrap({ recipeId: postId, folderName });
      if (savedSuccessfully) {
        setIsScrapped(true);
        setShowToast(true);
      }
    } catch (error) {
      console.error("스크랩 저장 오류:", error);
    } finally {
      setIsSaving(false);
      setIsModalOpen(false);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div>
      <div className="flex cursor-pointer" onClick={handleMarkClick}>
        <Image src={isScrapped ? scrapFill : scrapEmpty} alt="스크랩 버튼" width={18} height={18} />
        <span className="ml-2 text-sm font-medium text-gray-700">{scrapCount || 0}</span>
      </div>

      {/* 모달 컴포넌트 */}
      {isModalOpen && (
        <ScrapModal
          isSaving={isSaving}
          folderName={folderName}
          existingFolders={existingFolders || []}
          onFolderNameChange={setFolderName}
          onSave={handleSaveComplete}
          onClose={() => setIsModalOpen(false)}
          onFolderClick={handleFolderClick}
        />
      )}

      {/* 스크랩 성공 시에만 커스텀 토스트 표시 */}
      {showToast && <CustomToast message="스크랩 되었습니다." onMove={() => setShowToast(false)} />}
    </div>
  );
};

export default ScrapButton;
