interface DeleteConfirmModalProps {
  isOpen: boolean;
  handleClose: () => void;
  handleDelete: () => void;
}

const DeleteConfirmModal = ({ isOpen, handleClose, handleDelete }: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="w-[18rem] rounded-2xl bg-white px-10 py-8 md:w-[23.875rem]"
        style={{ boxShadow: "0px 4px 20px 0px rgba(154, 130, 102, 0.20)" }}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col gap-y-[0.25rem] md:gap-y-[0.56rem]">
            <h1 className="text-title-18 sm:block md:hidden md:text-title-20">정말로 삭제하시겠어요?</h1>
            <h1 className="hidden text-title-18 md:block md:text-title-20">댓글을 정말로 삭제하시겠어요?</h1>
          </div>
          <div className="mt-5 flex gap-3">
            <button
              className="flex w-[7.375rem] min-w-[120px] items-center justify-center gap-1 rounded-[0.75rem] border border-Primary-300 bg-white px-4 py-2 text-title-16 text-Primary-300 md:h-[3rem] md:w-[9.0625rem] md:rounded-[1rem]"
              onClick={(e) => {
                e.preventDefault();
                handleClose();
              }}
            >
              취소하기
            </button>
            <button
              className="flex w-[7.375rem] min-w-[120px] items-center justify-center gap-1 rounded-[0.75rem] border border-Primary-300 bg-Primary-300 px-4 py-2 text-title-16 text-white md:h-[3rem] md:w-[9.0625rem] md:rounded-[1rem]"
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
            >
              삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
