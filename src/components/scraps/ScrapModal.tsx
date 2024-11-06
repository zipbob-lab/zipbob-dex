"use client";

import Image from "next/image";
import { useState } from "react";
import CloseX from "@images/CloseX.svg";
import AddButton from "@images/addButton.svg";

interface ScrapModalProps {
  isSaving: boolean;
  folderName: string;
  existingFolders: string[];
  onFolderNameChange: (folder: string) => void;
  onSave: () => Promise<void>;
  onClose: () => void;
  onFolderClick: (folder: string) => void;
}

const ScrapModal: React.FC<ScrapModalProps> = ({
  isSaving,
  folderName,
  existingFolders,
  onFolderNameChange,
  onSave,
  onClose,
  onFolderClick
}) => {
  const [warningMessage, setWarningMessage] = useState(""); // 폴더 선택X, 폴더명 추가 안 했을 때 상태 체크

  const handleSaveClick = async () => {
    if (!folderName) {
      setWarningMessage("폴더 이름을 입력하거나 폴더를 선택해 주세요.");
      return;
    }
    setWarningMessage(""); // 경고 메시지 초기화
    await onSave(); // 저장 로직 실행
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-[#D9D9D9] bg-opacity-50">
      <div className="relative w-full max-w-96 rounded-2xl bg-white px-5 py-4">
        {/* 새 폴더 이름 입력 */}
        <div className="relative flex flex-col items-center justify-between">
          <h3 className="text-center text-title-18">스크랩</h3>
          <div className="absolute right-0 top-[-6px] cursor-pointer p-2" onClick={onClose}>
            <Image src={CloseX} alt="닫기 버튼" width={18} height={18} />
          </div>
          {/* 더하기 아이콘 */}
          <span className="absolute left-3 top-12 z-10">
            <Image src={AddButton} alt="더하기" width={20} height={20} />
          </span>

          {/* 폴더 이름 입력 필드 */}
          <input
            type="text"
            placeholder="폴더 이름을 적어주세요"
            value={folderName}
            onChange={(e) => onFolderNameChange(e.target.value)}
            className="mb-2 mt-3 w-full rounded-xl border-[1px] border-Gray-100 p-3 pl-10 text-body-18 outline-none focus:border-Primary-300"
          />

          {/* 만들기 버튼 */}
          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className={`absolute right-3 top-12 cursor-pointer text-body-16 ${
              folderName ? "text-Primary-300" : "text-Gray-300"
            }`}
          >
            만들기
          </button>

          {/* 경고 메시지 */}
          {warningMessage && <p className="mb-2 text-sm text-Primary-300">{warningMessage}</p>}
        </div>

        {/* 기존 폴더 목록 */}
        <div>
          {existingFolders?.map((folder) => (
            <div key={folder} className="border-b">
              <button
                onClick={() => {
                  onFolderClick(folder);
                  setWarningMessage("");
                }}
                className="w-full p-2 px-3 py-[10px] text-left transition-colors hover:rounded-xl hover:bg-Secondary-50"
              >
                {folder}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrapModal;
