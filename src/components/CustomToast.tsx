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
    <div className="fixed z-50 bottom-5 right-5 bg-gray-800 text-white p-4 rounded shadow-md flex justify-between items-center space-x-4 w-1/2">
      <p>{message}</p>
      <button onClick={handleRedirect} className="text-orange-500 font-semibold hover:underline">
        스크랩 이동
      </button>
    </div>
  );
};

export default CustomToast;
