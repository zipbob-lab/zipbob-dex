import Image from "next/image";
import React from "react";
import noneAlert from "@images/noneAlert.svg";

interface EmptyContentProps {
  message: string;
  children?: React.ReactNode;
}

const EmptyContent: React.FC<EmptyContentProps> = ({ message, children }) => {
  return (
    <div className="mt-6 flex flex-col items-center justify-center gap-6">
      <Image src={noneAlert} alt="느낌표 표시" width={80} height={80} />
      <h1 className="text-heading-20 text-Gray-700">{message}</h1>
      <div className="mt-6 min-w-[420px] rounded-3xl bg-Gray-50 p-7">
        <h3 className="text-title-18 text-Primary-300">Tips!</h3>
        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  );
};

export default EmptyContent;
