"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import Pencil from "@images/pen.svg";
import PencilOrange from "@images/pen.svg";
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
      <div className="rounded-2xl bg-white px-10 py-8" onClick={handleModalClick}>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-title-20">로그인이 필요한 서비스예요!</h1>
          <span className="pt-2 text-center text-body-14 text-Gray-500">
            간편하게 로그인하고 <br /> 좀 더 다양한 기능을 즐겨요
          </span>
          <div className="mt-5 flex gap-3">
            <button
              className="flex min-w-[120px] items-center justify-center gap-1 rounded-2xl border border-Primary-300 bg-white px-4 py-2 text-title-16 text-Primary-300"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
            >
              <Image src={PencilOrange} width={20} height={20} alt="연필 아이콘" />
              닫기
            </button>
            <button
              className="flex min-w-[120px] items-center justify-center gap-1 rounded-2xl bg-orange-400 px-4 py-2 text-title-16 text-white"
              onClick={() => router.push("/login")}
            >
              <Image src={Pencil} width={20} height={20} alt="연필 아이콘" />
              로그인 하러 가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCheckModal;
