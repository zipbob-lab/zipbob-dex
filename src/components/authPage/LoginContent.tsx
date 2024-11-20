"use client";

import LoginForm from "@/components/authPage/Form/LoginForm";
import GithubButton from "@/components/common/button/GithubButton";
import GoogleButton from "@/components/common/button/GoogleButton";
import KakaoButton from "@/components/common/button/KakaoButton";
import Image from "next/image";
import LoginLogo from "@images/loginLogo.svg";

const LoginContent = () => {
  return (
    <div className="flex w-[20.9rem] flex-col items-center gap-[3.5rem] md:w-[27.5rem] lg:w-[32.5rem] lg:rounded-3xl lg:px-[2.5rem] lg:py-[3.88rem] lg:shadow-[0px_4px_20px_0px_rgba(154,130,102,0.1)]">
      <div className="relative m-[0.51rem] h-[2.75rem] w-[10.7rem] md:m-[0.62rem] md:h-[3.365rem] md:w-[13.125rem]">
        <Image src={LoginLogo} alt="집밥도감 로고" priority fill />
      </div>
      <LoginForm />
      <div className="flex flex-col items-center">
        <p className="text-body-14 text-[#777]">SNS로 로그인/회원가입</p>
        <div className="mt-6 flex gap-[1.125rem]">
          <GoogleButton />
          <KakaoButton />
          <GithubButton />
        </div>
      </div>
    </div>
  );
};

export default LoginContent;
