import { useState } from "react";
import ProfileImageUpload from "./ProfileImageUpload";
import { Image as ImageIcon, X } from "lucide-react";

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
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="relative bg-white p-5 rounded-lg w-[400px] flex flex-col items-center">
        {/* 모달 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>

        {/* 프로필 이미지 업로드 */}
        <div className="relative w-40 h-40 rounded-full overflow-hidden cursor-pointer group">
          <ProfileImageUpload
            userId={userData.user_id}
            initialImageUrl={userData.user_img}
            onImageUpload={setSelectedFile}
          />

          {/* 호버 시 표시되는 편집 텍스트 */}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <ImageIcon className="text-white " />
          </div>
        </div>

        {/* 닉네임 및 자기소개 입력 */}
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
          className="w-full p-2 border rounded mt-3 resize-none min-h-[100px]"
          placeholder="자기소개를 입력하세요"
        />

        {/* 저장 및 취소 버튼 */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => {
              onSave(editedNickname, editedIntroduce, selectedFile);
              onClose();
            }}
            className="px-4 py-2 bg-orange-500 text-white rounded"
          >
            변경
          </button>
          <button onClick={onDelete} className="px-4 py-3 border-orange-500 text-orange-500 border-[1px] rounded">
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
