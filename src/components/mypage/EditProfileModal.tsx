import { useEffect, useState } from "react";
import ProfileImageUpload from "./ProfileImageUpload";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    user_id: string;
    user_nickname: string;
    user_img: string;
    user_introduce: string;
  };
  onImageUpload: (url: string) => void;
  onIntroduceSave: (introduce: string) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  userData,
  onImageUpload,
  onIntroduceSave
}) => {
  const [editedIntroduce, setEditedIntroduce] = useState(userData.user_introduce);

  useEffect(() => {
    if (userData) setEditedIntroduce(userData.user_introduce);
  }, [userData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg w-[400px]">
        <h2 className="text-lg font-semibold mb-4">프로필 수정</h2>
        <ProfileImageUpload userId={userData.user_id} onImageUpload={onImageUpload} />

        <textarea
          value={editedIntroduce}
          onChange={(e) => setEditedIntroduce(e.target.value)}
          className="w-full p-2 border rounded mt-3 resize-none focus:outline-none focus:border-orange-300"
          placeholder="자기소개를 입력하세요"
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              onIntroduceSave(editedIntroduce);
              onClose();
            }}
            className="p-2"
          >
            저장
          </button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
