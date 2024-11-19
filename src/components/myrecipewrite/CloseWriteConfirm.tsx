"use client";
import { useRouter } from "next/navigation";
import React from "react";

interface CloseWriteConfirmProps {
  closeWriteModal: boolean;
  setCloseWriteModal: (isOpen: boolean) => void;
}

const CloseWriteConfirm = ({ closeWriteModal, setCloseWriteModal }: CloseWriteConfirmProps) => {
  const router = useRouter();
  if (!closeWriteModal) return null;

  return (
    <div>
      <>
        {closeWriteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="w-[18rem] rounded-[1rem] bg-white px-[1.25rem] pb-[1.25rem] pt-[1.75rem] md:w-[23.857rem] md:rounded-2xl md:px-[2.5rem] md:pb-[1.5rem] md:pt-[2rem]"
              style={{ boxShadow: "0px 4px 20px 0px rgba(154, 130, 102, 0.20)" }}
            >
              <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col gap-y-[0.25rem] md:gap-y-[0.5rem]">
                  <h1 className="hidden text-title-18 md:block md:text-title-20">레시피 작성을 그만두시겠어요?</h1>
                  <h1 className="block text-title-18 md:hidden md:text-title-20">이 페이지에서 나가시겠어요?</h1>
                  <span className="text-center text-r-body-14 text-Gray-500 md:text-body-14">
                    내용이 저장되지 않고 사라져요!
                  </span>
                </div>

                {/*버튼영역 */}
                <div className="mt-[1rem] flex w-full gap-x-[0.75rem] md:mt-[1.25rem]">
                  <button
                    className="flex w-[50%] items-center justify-center rounded-[0.75rem] border border-Primary-300 bg-white py-[0.5rem] text-title-16 text-Primary-300 md:rounded-2xl md:px-[0.75rem] md:py-[1rem]"
                    onClick={() => setCloseWriteModal(false)}
                  >
                    돌아가기
                  </button>
                  <button
                    className="flex w-[50%] items-center justify-center rounded-[0.75rem] bg-orange-400 py-[0.5rem] text-title-16 text-white md:rounded-2xl md:px-[0.75rem] md:py-[1rem]"
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

export default CloseWriteConfirm;
