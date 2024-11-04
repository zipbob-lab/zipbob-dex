import { useState } from "react";
import ProfileImageUpload from "./ProfileImageUpload";
import { Image as ImageIcon, X } from "lucide-react";
import Pencil from "@images/pen.svg";
import Image from "next/image";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    user_id: string;
    user_nickname: string;
    user_img: string;
    user_introduce: string;
  };
  onSave: (nickname: string, introduce: string, file: File | null) => void;
  onDelete: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, userData, onSave, onDelete }) => {
  const [editedIntroduce, setEditedIntroduce] = useState("");
  const [editedNickname, setEditedNickname] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="relative flex w-[400px] flex-col items-center rounded-lg bg-white p-5">
        {/* 모달 닫기 버튼 */}
        <button onClick={onClose} className="absolute right-2 top-2 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>

        {/* 프로필 이미지 업로드 */}
        <div className="group relative h-40 w-40 cursor-pointer overflow-hidden rounded-full">
          <ProfileImageUpload
            userId={userData.user_id}
            initialImageUrl={userData.user_img}
            onImageUpload={setSelectedFile}
          />

          {/* 프로필 사진 위에 아이콘 표시 */}
        </div>
        <div className="absolute left-60 top-36 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white bg-yellow-400">
          <ImageIcon className="z-40 h-5 w-5 text-white" />
        </div>
        {/* 닉네임 및 자기소개 입력 */}
        <input
          type="text"
          value={editedNickname}
          onChange={(e) => setEditedNickname(e.target.value)}
          className="mt-3 w-full rounded border p-2"
          placeholder="닉네임을 입력하세요"
        />
        <textarea
          value={editedIntroduce}
          onChange={(e) => setEditedIntroduce(e.target.value)}
          className="mt-3 min-h-[100px] w-full resize-none rounded border p-2"
          placeholder="자기소개를 입력하세요"
        />

        {/* 저장 및 취소 버튼 */}
        <div className="mt-4 flex gap-4">
          <button
            onClick={() => {
              onSave(editedNickname, editedIntroduce, selectedFile);
              onClose();
            }}
            className="flex rounded bg-orange-500 px-4 py-2 text-white"
          >
            변경
            <Image src={Pencil} width={24} height={24} alt="연필 아이콘" />
          </button>
          <button onClick={onDelete} className="rounded border-[1px] border-orange-500 px-4 py-3 text-orange-500">
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
