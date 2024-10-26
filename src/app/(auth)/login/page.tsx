"use client";

import GithubButton from "@/components/common/button/GithubButton";
import GoogleButton from "@/components/common/button/GoogleButton";
import KakaoButton from "@/components/common/button/KakaoButton";
import LogoutButton from "@/components/common/button/LogoutButton";
import browserClient from "@/supabase/client";
import Link from "next/link";
import { useEffect } from "react";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "로그인 페이지",
//   description: "로그인 페이지 입니다."
// };

const LoginPage = () => {
  useEffect(() => {
    browserClient.auth.getSession().then(console.log);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-[2rem]">일반 로그인</h1>
      <form className="flex flex-col gap-4 mb-2">
        <input type="email" placeholder="이메일 주소" className="border border-gray-500 rounded-md p-1" />
        <input type="password" placeholder="비밀번호" className="border border-gray-500 rounded-md p-1" />
        <button>로그인</button>
      </form>
      <Link href="/sign-up">회원가입</Link>
      <div className="flex flex-col mt-8">
        <KakaoButton />
        <GithubButton />
        <GoogleButton />
        <LogoutButton />
      </div>
    </div>
  );
};

export default LoginPage;
