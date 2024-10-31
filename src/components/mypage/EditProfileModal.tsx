import { useState } from "react";
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
  onSave: (nickname: string, introduce: string, file: File | null) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, userData, onSave }) => {
  const [editedIntroduce, setEditedIntroduce] = useState("");
  const [editedNickname, setEditedNickname] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg w-[400px]">
        <h2 className="text-lg font-semibold mb-4">프로필 수정</h2>
        <ProfileImageUpload userId={userData.user_id} onImageUpload={setSelectedFile} />

        <input
          type="text"
          value={editedNickname}
          onChange={(e) => setEditedNickname(e.target.value)}
          className="w-full p-2 border rounded mt-3"
          placeholder="닉네임을 입력하세요"
        />

        <textarea
          value={editedIntroduce}
          onChange={(e) => setEditedIntroduce(e.target.value)}
          className="w-full p-2 border rounded mt-3"
          placeholder="자기소개를 입력하세요"
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              onSave(editedNickname, editedIntroduce, selectedFile);
              onClose();
            }}
            className="p-2 bg-blue-500 text-white rounded"
          >
            저장
          </button>
          <button onClick={onClose} className="p-2 bg-gray-500 text-white rounded">
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
