import { useEffect, useState } from "react";
import ProfileImageUpload from "./ProfileImageUpload";
import Pencil from "@images/penWhite.svg";
import Image from "next/image";
import CloseX from "@images/closeX.svg";
import ImageButton from "@images/imageButton.svg";
import DeleteButton from "@images/trashcan.svg";
import { createPortal } from "react-dom";
import ConfirmModal from "../common/modal/ConfirmModal";

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
  const [errors, setErrors] = useState({ nickname: "", introduce: "" });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const validateFeilds = () => {
    const newErrors = { nickname: "", introduce: "" };
    if (!editedNickname.trim()) newErrors.nickname = "닉네임을 입력해주세요.";
    if (editedIntroduce.length > 100) newErrors.introduce = "자기소개는 100자 이내로 작성해주세요";

    setErrors(newErrors);
    return !newErrors.nickname && !newErrors.introduce;
  };

  const handleSaveClick = () => {
    if (validateFeilds()) {
      onSave(editedNickname, editedIntroduce, selectedFile);
      onClose();
    }
  };

  const handleDeleteClick = () => setIsConfirmOpen(true);

  const handleConfirmDelete = () => {
    onDelete();
    setIsConfirmOpen(false);
    onClose();
  };
  useEffect(() => {
    if (isOpen) {
      setEditedNickname(userData.user_nickname);
      setEditedIntroduce(userData.user_introduce);
      setErrors({ nickname: "", introduce: "" });
    }
  }, [isOpen, userData]);

  if (!isOpen || !document.getElementById("modal-root")) return null;

  const modalContent = (
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
            {errors.nickname && <p className="mx-1 mb-1 text-body-14 text-red-500">{errors.nickname}</p>}
          </div>
          <div>
            <p className="p-1 text-body-14 text-gray-500">자기소개</p>
            <textarea
              value={editedIntroduce}
              onChange={(e) => setEditedIntroduce(e.target.value)}
              className="min-h-[100px] w-[240px] resize-none rounded-2xl border p-3 text-body-14"
              placeholder="자기소개를 입력하세요(100자 이내)"
              maxLength={100}
            />
            {errors.introduce && <p className="m-1 text-body-14 text-red-500">{errors.introduce}</p>}
          </div>
        </div>

        {/* 저장 및 취소 버튼 */}
        <div className="flex gap-4 text-body-16">
          <button
            onClick={handleSaveClick}
            className="flex items-center gap-2 rounded-2xl bg-Primary-300 px-6 py-2 text-white"
          >
            <Image src={Pencil} width={20} height={20} alt="연필 아이콘" />
            <span>변경</span>
          </button>
          <button
            onClick={handleDeleteClick}
            className="flex items-center gap-2 rounded-2xl border-[1px] border-Primary-300 px-6 py-2 text-Primary-300"
          >
            <Image src={DeleteButton} width={20} height={20} alt="쓰레기 아이콘" />
            <span>삭제</span>
          </button>
        </div>

        {isConfirmOpen && (
          <ConfirmModal
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={handleConfirmDelete}
            title="정말로 삭제하시겠습니까?"
            confirmText="삭제하기"
            cancelText="취소하기"
          />
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById("modal-root")!);
};

export default EditProfileModal;
