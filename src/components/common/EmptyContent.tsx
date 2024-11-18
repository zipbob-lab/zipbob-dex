import Image from "next/image";
import React from "react";
import noneAlert from "@images/noneAlert.svg";

interface EmptyContentProps {
  message: string;
  children?: React.ReactNode;
}

const EmptyContent: React.FC<EmptyContentProps> = ({ message, children }) => {
  return (
    <div className="m-auto flex max-w-[336px] flex-col items-center justify-center gap-6 pt-6">
      <Image src={noneAlert} alt="느낌표 표시" width={80} height={80} />
      <h1 className="text-title-18 text-Gray-700">{message}</h1>
      <div className="mt-6 min-w-[336px] rounded-3xl bg-Gray-50 p-7">
        <h3 className="text-Primary-300 ssm:text-title-16 md:text-title-18">Tips!</h3>
        {children && <div className="mt-3 ssm:text-body-14">{children}</div>}
      </div>
    </div>
  );
};

export default EmptyContent;
