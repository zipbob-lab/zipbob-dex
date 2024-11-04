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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-45"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
    >
      <div className="rounded-lg bg-white p-5" onClick={handleModalClick}>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-lg font-bold">로그인이 필요한 서비스예요!</h1>
          <span>간편하게 로그인하고 좀 더 다양한 기능을 즐겨요</span>
          <div className="mt-4 flex flex-row gap-3">
            <button
              className="rounded-lg bg-orange-400 p-2 text-white"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
            >
              닫기
            </button>
            <button className="rounded-lg bg-orange-400 p-2 text-white" onClick={() => router.push("/login")}>
              로그인 하러 가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCheckModal;
