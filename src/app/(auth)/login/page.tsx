"use client";

import GithubButton from "@/components/common/button/GithubButton";
import GoogleButton from "@/components/common/button/GoogleButton";
import KakaoButton from "@/components/common/button/KakaoButton";
import LogoutButton from "@/components/common/button/LogoutButton";
import browserClient from "@/supabase/client";
import { useEffect } from "react";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "로그인 페이지",
//   description: "로그인 페이지 입니다."
// };

const LoginPage = () => {
  useEffect(() => {
    browserClient.auth.getSession().then(console.log);
  });

  return (
    <div className="flex flex-col">
      <KakaoButton />
      <GithubButton />
      <GoogleButton />
      <LogoutButton />
    </div>
  );
};

export default LoginPage;
