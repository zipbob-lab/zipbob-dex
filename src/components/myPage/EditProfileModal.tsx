import { useState } from "react";
import ProfileImageUpload from "./ProfileImageUpload";
import Pencil from "@images/pen.svg";
import Image from "next/image";
import CloseX from "@images/closeX.svg";
import ImageButton from "@images/imageButton.svg";
import DeleteButton from "@images/trashcan.svg";

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
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-[#D9D9D9] bg-opacity-50">
      <div className="relative flex min-w-[320px] flex-col items-center rounded-2xl bg-white p-8">
        {/* 모달 닫기 버튼 */}
        <button onClick={onClose} className="absolute right-5 top-5">
          <Image src={CloseX} width={20} height={20} alt="닫기" />
        </button>

        {/* 프로필 이미지 업로드 */}
        <div className="relative mb-6 flex h-40 w-40 cursor-pointer items-center justify-center overflow-hidden rounded-full">
          <ProfileImageUpload
            userId={userData.user_id}
            initialImageUrl={userData.user_img}
            onImageUpload={setSelectedFile}
          />
        </div>

        {/* 프로필 사진 위에 아이콘 표시 */}
        <Image
          src={ImageButton}
          width={28}
          height={28}
          alt="이미지 아이콘"
          className="absolute right-1/3 top-36 z-40"
        />

        {/* 닉네임 및 자기소개 입력 */}
        <div className="flex flex-col pb-8">
          <div>
            <p className="p-1 text-body-14 text-gray-500">닉네임</p>
            <input
              type="text"
              value={editedNickname}
              onChange={(e) => setEditedNickname(e.target.value)}
              className="mb-3 w-[240px] rounded-2xl border p-3 text-body-14"
              placeholder="닉네임을 입력하세요"
            />
          </div>
          <div>
            <p className="p-1 text-body-14 text-gray-500">자기소개</p>
            <textarea
              value={editedIntroduce}
              onChange={(e) => setEditedIntroduce(e.target.value)}
              className="min-h-[100px] w-[240px] resize-none rounded-2xl border p-3 text-body-14"
              placeholder="자기소개를 입력하세요"
            />
          </div>
        </div>

        {/* 저장 및 취소 버튼 */}
        <div className="flex gap-4 text-body-16">
          <button
            onClick={() => {
              onSave(editedNickname, editedIntroduce, selectedFile);
              onClose();
            }}
            className="flex items-center gap-2 rounded-2xl bg-Primary-300 px-6 py-2 text-white"
          >
            <Image src={Pencil} width={20} height={20} alt="연필 아이콘" />
            <span>변경</span>
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-2 rounded-2xl border-[1px] border-Primary-300 px-6 py-2 text-Primary-300"
          >
            <Image src={DeleteButton} width={20} height={20} alt="쓰레기 아이콘" />
            <span>삭제</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
