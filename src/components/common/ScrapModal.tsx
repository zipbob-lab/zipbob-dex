// ScrapModal.tsx
"use client";

import Image from "next/image";
import closeX from "../../../public/images/closeX.svg";

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
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>
          <Image src={closeX} alt="닫기 버튼" width={16} height={16} />
        </button>

        {/* 새 폴더 이름 입력 */}
        <div className="flex justify-between align-middle">
          <input
            type="text"
            placeholder="폴더 이름을 적어주세요"
            value={folderName}
            onChange={(e) => onFolderNameChange(e.target.value)}
            className="relative border-[1px] border-gray-300 p-2 w-full mb-2 rounded-sm"
          />
          <button onClick={onSave} disabled={isSaving} className="absolute text-orange-500 p-2 right-8 cursor-pointer">
            {isSaving ? "저장 중..." : "만들기"}
          </button>
        </div>

        {/* 기존 폴더 목록 */}
        <div className="mt-4">
          {existingFolders?.map((folder) => (
            <button
              key={folder}
              onClick={() => onFolderClick(folder)}
              className="block text-left w-full p-2 mb-1 border-b"
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
