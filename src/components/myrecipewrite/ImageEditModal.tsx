interface ImageEditModalProps {
  handleModify: () => void;
  handleDelete: () => void;
  handleClose: () => void;
}
const ImageEditModal = ({ handleModify, handleDelete, handleClose }: ImageEditModalProps) => {
  return (
    <div className="flex flex-col rounded-lg bg-slate-600 p-5 text-white">
      <button onClick={handleModify}>사진 변경하기</button>
      <button onClick={handleDelete}>사진 삭제하기</button>
      <button onClick={handleClose}>닫기</button>
    </div>
  );
};
export default ImageEditModal;
