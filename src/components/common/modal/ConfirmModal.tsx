"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string; // 제목 텍스트 (예: 삭제 확인)
  confirmText?: string; // 확인 버튼 텍스트 (예: 삭제하기)
  cancelText?: string; // 취소 버튼 텍스트 (예: 취소하기)
  confirmButtonClass?: string; // 확인 버튼에 적용할 추가 클래스
  cancelButtonClass?: string; // 취소 버튼에 적용할 추가 클래스
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "레시피를 삭제하시겠어요?",
  confirmText = "삭제하기",
  cancelText = "취소하기",
  confirmButtonClass = "bg-Primary-300 text-white border-Primary-300",
  cancelButtonClass = "border-Primary-300 text-Primary-300 "
}) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const modalContent = (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-[#D9D9D9] bg-opacity-50">
      <div className="w-[300px] rounded-2xl bg-white px-10 py-8">
        <h2 className="text-center text-title-20 text-Gray-900">{title}</h2>
        <p className="mb-5 mt-2 text-center text-body-14 text-Gray-500">삭제하면 복구할 수 없어요!</p>
        <div className="mt-5 flex w-full items-center justify-center gap-4">
          <button
            onClick={onClose}
            className={`min-w-[121px] rounded-2xl border-[1px] px-4 py-3 text-title-16 ${cancelButtonClass}`}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`min-w-[121px] rounded-2xl border-[1px] px-4 py-3 text-title-16 ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  if (isBrowser && isOpen) {
    return createPortal(modalContent, document.getElementById("confirm-root")!);
  } else {
    return null;
  }
};

export default ConfirmModal;
