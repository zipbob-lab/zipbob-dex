"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface DeleteCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteCheckModal: React.FC<DeleteCheckModalProps> = ({ isOpen, onClose, onDelete }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const modalContent = (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-[#D9D9D9] bg-opacity-50">
      <div className="relative max-w-sm rounded-2xl bg-white px-10 py-8">
        <h2 className="text-center text-lg text-title-20 text-Gray-900">스크랩한 레시피를 삭제하시겠어요?</h2>
        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="min-w-36 rounded-2xl border-[1px] border-Primary-300 px-4 py-3 text-title-16 text-Primary-300"
          >
            취소하기
          </button>
          <button onClick={onDelete} className="min-w-36 rounded-2xl bg-Primary-300 px-4 py-3 text-title-16 text-white">
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );

  if (isBrowser && isOpen) {
    return createPortal(modalContent, document.getElementById("modal-root")!);
  } else {
    return null;
  }
};

export default DeleteCheckModal;
