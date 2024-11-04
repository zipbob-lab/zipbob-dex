// ScrapModal.tsx
"use client";

import Image from "next/image";
import closeX from "@images/closeX.svg";

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
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <button className="absolute right-2 top-2 text-gray-400 hover:text-gray-600" onClick={onClose}>
          <Image src={closeX} alt="닫기 버튼" width={16} height={16} />
        </button>

        {/* 새 폴더 이름 입력 */}
        <div className="flex justify-between align-middle">
          <input
            type="text"
            placeholder="폴더 이름을 적어주세요"
            value={folderName}
            onChange={(e) => onFolderNameChange(e.target.value)}
            className="relative mb-2 w-full rounded-sm border-[1px] border-gray-300 p-2"
          />
          <button onClick={onSave} disabled={isSaving} className="absolute right-8 cursor-pointer p-2 text-orange-500">
            {isSaving ? "저장 중..." : "만들기"}
          </button>
        </div>

        {/* 기존 폴더 목록 */}
        <div className="mt-4">
          {existingFolders?.map((folder) => (
            <button
              key={folder}
              onClick={() => onFolderClick(folder)}
              className="mb-1 block w-full border-b p-2 text-left"
            >
              {folder}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrapModal;
