interface ImageEditModalProps {
  handleModify: () => void;
  handleDelete: () => void;
  handleClose: () => void;
}
const ImageEditModal = ({ handleModify, handleDelete, handleClose }: ImageEditModalProps) => {
  return (
    <div className="bg-slate-600 text-white rounded-lg p-5 flex flex-col">
      <button onClick={handleModify}>사진 변경하기</button>
      <button onClick={handleDelete}>사진 삭제하기</button>
      <button onClick={handleClose}>닫기</button>
    </div>
  );
};
export default ImageEditModal;
