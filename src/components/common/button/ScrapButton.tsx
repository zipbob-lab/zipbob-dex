"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useScrapStore } from "@/store/scrapStore";
import { useScrapData } from "@/hooks/useScrapData";
import { toast } from "react-toastify";
import CustomToast from "@/components/CustomToast";
import ScrapModal from "../ScrapModal";
import scrapEmpty from "../../../../public/images/scrapEmpty.svg";
import scrapFill from "../../../../public/images/scrapFill.svg";

const ScrapButton = ({ postId }: { postId: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrapped, setIsScrapped] = useState(false);
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

  // 북마크 클릭 시 페이지 이동 방지 및 모달 열기
  const handleMarkClick = () => {
    setIsModalOpen(true);
  };

  const handleFolderClick = (folder: string) => {
    setFolderName(folder);
  };

  // 저장 과정
  const handleSaveComplete = async () => {
    setIsSaving(true);
    try {
      const savedSuccessfully = await saveScrap({ recipeId: postId, folderName });
      if (savedSuccessfully) {
        toast(<CustomToast closeToast={() => toast.dismiss()} />, {
          theme: "dark",
          closeButton: false
        });
        setIsScrapped(true);
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
    </div>
  );
};

export default ScrapButton;
