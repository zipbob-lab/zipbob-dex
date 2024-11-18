"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ScrapModalProps } from "@/types/Scraps";
import CloseX from "@images/closeX.svg";
import AddButton from "@images/addButton.svg";

const ScrapModal: React.FC<ScrapModalProps> = ({
  isSaving,
  folderName,
  existingFolders,
  onFolderNameChange,
  onSave,
  onClose,
  onFolderClick
}) => {
  const [warningMessage, setWarningMessage] = useState("");
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSaveClick = async () => {
    if (!folderName) {
      setWarningMessage("폴더 이름을 입력하거나 폴더를 선택해 주세요.");
      return;
    }
    setWarningMessage("");
    await onSave();
  };

  const handleKeyDownSave = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!folderName) {
        setWarningMessage("폴더 이름을 입력하거나 폴더를 선택해 주세요.");
        return;
      }
      setWarningMessage("");
      if (!isSaving) {
        await onSave();
      }
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-[#D9D9D9] bg-opacity-50">
      <div className="relative rounded-2xl bg-white px-5 py-4 shadow-[0px_4px_20px_0px_rgba(154,130,102,0.1)] ssm:h-[312px] ssm:w-[255px] ssm:px-3 md:h-[408px] md:w-[354px]">
        {/* 새 폴더 이름 입력 */}
        <div className="relative flex flex-col items-center justify-between">
          <h3 className="text-center text-title-18">스크랩</h3>
          <div className="absolute right-0 top-[-0.375rem] cursor-pointer p-2" onClick={onClose}>
            <Image src={CloseX} alt="닫기 버튼" width={18} height={18} />
          </div>
          {/* 더하기 아이콘 */}
          <span className="absolute z-20 ssm:left-2 ssm:top-11 md:left-3 md:top-12">
            <Image src={AddButton} alt="더하기" width={20} height={20} />
          </span>

          {/* 폴더 이름 입력 필드 */}
          <input
            type="text"
            placeholder="폴더 이름을 적어주세요"
            value={folderName}
            onChange={(e) => onFolderNameChange(e.target.value)}
            onKeyDown={handleKeyDownSave}
            className="mb-2 mt-3 w-full rounded-xl border-[1px] border-Gray-100 outline-none focus:border-Primary-300 ssm:p-2 ssm:pl-8 ssm:text-body-14 md:p-3 md:pl-10 md:text-body-16"
          />

          {/* 추가 버튼 */}
          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className={`absolute right-3 cursor-pointer ssm:top-11 ssm:text-body-14 md:top-12 md:text-body-16 ${
              folderName ? "text-Primary-300" : "text-Gray-300"
            }`}
          >
            추가
          </button>

          {/* 경고 메시지 */}
          {warningMessage && <p className="mb-2 text-Primary-300 ssm:text-sm">{warningMessage}</p>}
        </div>

        <div className="scroll-container overflow-y-auto ssm:max-h-[12rem] md:max-h-[18rem] [&::-webkit-scrollbar]:hidden">
          {existingFolders?.map((folder) => (
            <div key={folder} className="border-b">
              <button
                onClick={() => {
                  onFolderClick(folder);
                  setWarningMessage("");
                }}
                className="w-full gap-2 px-[0.63rem] text-left transition-colors hover:bg-Secondary-50 ssm:py-2 ssm:text-body-14 md:py-3 md:text-body-16"
              >
                {folder}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  //브라우저 환경에서만 포탈 렌더링
  if (isBrowser) {
    return createPortal(modalContent, document.getElementById("modal-root")!);
  } else {
    return null;
  }
};

export default ScrapModal;
