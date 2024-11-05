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
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-[#D9D9D9] bg-opacity-50">
      <div className="relative w-full max-w-80 rounded-2xl bg-white px-5 py-4">
        <button className="absolute right-4 top-4" onClick={onClose}>
          <Image src={closeX} alt="닫기 버튼" width={16} height={16} />
        </button>

        {/* 새 폴더 이름 입력 */}
        <div className="flex flex-col items-center justify-between">
          <h3 className="text-center text-title-18">스크랩</h3>
          <input
            type="text"
            placeholder="폴더 이름을 적어주세요"
            value={folderName}
            onChange={(e) => onFolderNameChange(e.target.value)}
            className="relative mt-3 w-full rounded-xl border-[1px] border-Gray-100 p-3 text-body-18 outline-none focus:border-Primary-300"
          />
          <button
            onClick={onSave}
            disabled={isSaving}
            className={`absolute right-8 top-16 cursor-pointer text-body-16 ${
              folderName ? "text-Primary-300" : "text-Gray-300"
            }`}
          >
            만들기
          </button>
        </div>

        {/* 기존 폴더 목록 */}
        <div>
          {existingFolders?.map((folder) => (
            <div key={folder} className="border-b">
              <button
                onClick={() => onFolderClick(folder)}
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
