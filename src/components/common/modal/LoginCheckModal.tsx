"use client";

import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

interface LoginModalProps {
  onClose: () => void;
}

const LoginCheckModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const router = useRouter();

  const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#D9D9D9] bg-opacity-50"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="w-[18rem] rounded-[1rem] bg-white px-[1.5rem] pb-[1.25rem] pt-[1.75rem] md:w-[23.857rem] md:px-[2.5rem] md:pb-[1.5rem] md:pt-[2rem]"
        onClick={handleModalClick}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col gap-y-[0.25rem] md:gap-y-[0.56rem]">
            <h1 className="text-title-18 md:text-title-20">로그인이 필요한 서비스예요!</h1>
            <span className="text-center text-r-body-14 text-Gray-500 md:text-body-14">
              간편하게 로그인하고 <br /> 좀 더 다양한 기능을 즐겨요
            </span>
          </div>
          {/* 버튼영역 */}
        </div>
        <div className="mt-[1rem] flex w-full gap-x-[0.75rem] md:mt-[1.25rem]">
          <button
            className="flex w-[50%] items-center justify-center rounded-[0.75rem] border border-Primary-300 bg-white py-[0.5rem] text-title-16 text-Primary-300 md:rounded-2xl md:px-[0.75rem] md:py-[1rem]"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            {/* <Image src={PencilOrange} width={20} height={20} alt="연필 아이콘" /> */}
            닫기
          </button>
          <button
            className="flex w-[50%] items-center justify-center rounded-[0.75rem] bg-orange-400 py-[0.5rem] text-title-16 text-white md:rounded-2xl md:px-[0.75rem] md:py-[1rem]"
            onClick={() => router.push("/login")}
          >
            {/* <Image src={Pencil} width={20} height={20} alt="연필 아이콘" /> */}
            로그인 하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginCheckModal;
