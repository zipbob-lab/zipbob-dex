import React from "react";
import Image from "next/image";
import Loading from "@images/loading.svg";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image src={Loading} alt="메인로고" width={150} height={150} />
      <h1 className="font-pretendard text-title-24 text-Primary-300">잠시만 기다려 주세요</h1>
    </div>
  );
};

export default LoadingSpinner;
