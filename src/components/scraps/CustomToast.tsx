"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface CustomToastProps {
  message: string;
  onMove: () => void;
}

const CustomToast: React.FC<CustomToastProps> = ({ message, onMove }) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(onMove, 3000);
    return () => clearTimeout(timer);
  }, [onMove]);

  const handleRedirect = () => {
    onMove();
    router.push("/scraps");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex w-1/2 items-center justify-between space-x-4 rounded bg-gray-800 p-4 text-white shadow-md">
      <p>{message}</p>
      <button onClick={handleRedirect} className="font-semibold text-orange-500 hover:underline">
        스크랩 이동
      </button>
    </div>
  );
};

export default CustomToast;
