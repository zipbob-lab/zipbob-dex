import ImgEditModalLine from "@images/myrecipe/imgEditModalLine.svg";
import ImageIcon from "@images/myrecipe/imageIcon.svg";
import TrashCanIcon from "@images/myrecipe/trashCan2.svg";
import Image from "next/image";

interface ImageEditModalProps {
  handleModify: () => void;
  handleDelete: () => void;
  handleClose: () => void;
}
const ImageEditModal = ({ handleModify, handleDelete, handleClose }: ImageEditModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="w-[279px] rounded-[20px] bg-white py-2"
        style={{ boxShadow: "0px 4px 20px 0px rgba(154, 130, 102, 0.20)" }}
      >
        <div className="justify-cente flex flex-col items-center gap-y-1">
          <button onClick={handleModify} className="flex gap-x-1 px-4 py-3">
            <Image src={ImageIcon} alt="사진 변경하기" width={24} height={24} />
            <span className="text-title-18 text-Gray-900">사진 변경하기</span>
          </button>

          <button onClick={handleDelete} className="flex gap-x-1 px-3 py-4">
            <Image src={TrashCanIcon} alt="사진 삭제하기" width={24} height={24} />
            <span className="text-title-18 text-SystemColor-Red">사진 삭제하기</span>
          </button>

          <Image src={ImgEditModalLine} alt="선" width={250} height={24} />

          <button onClick={handleClose} className="flex items-center justify-center p-3 text-body-16 text-Gray-900">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
export default ImageEditModal;
