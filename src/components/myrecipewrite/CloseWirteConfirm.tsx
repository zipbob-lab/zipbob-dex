"use client";
import { useRouter } from "next/navigation";
import React from "react";

interface CloseWriteConfirmProps {
  closeWriteModal: boolean;
  setCloseWriteModal: (isOpen: boolean) => void;
}

const CloseWirteConfirm = ({ closeWriteModal, setCloseWriteModal }: CloseWriteConfirmProps) => {
  const router = useRouter();
  if (!closeWriteModal) return null;

  return (
    <div>
      <>
        {closeWriteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="rounded-2xl bg-white px-10 py-8"
              style={{ boxShadow: "0px 4px 20px 0px rgba(154, 130, 102, 0.20)" }}
            >
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-title-20">레시피 작성을 그만두시겠어요?</h1>
                <span className="pt-2 text-center text-body-14 text-Gray-500">내용이 저장되지 않고 사라져요!</span>
                <div className="mt-5 flex gap-3">
                  <button
                    className="flex w-[9.0625rem] h-[3rem] items-center justify-center gap-1 rounded-2xl border border-Primary-300 bg-white px-[0.75rem] py-[1rem] text-title-16 text-Primary-300"
                    onClick={() => setCloseWriteModal(false)}
                  >
                    돌아가기
                  </button>
                  <button
                    className="flex w-[9.0625rem] h-[3rem] items-center justify-center gap-1 rounded-2xl bg-orange-400 px-[0.75rem] py-[1rem] text-title-16 text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.back();
                      setCloseWriteModal(false);
                    }}
                  >
                    확인
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default CloseWirteConfirm;
