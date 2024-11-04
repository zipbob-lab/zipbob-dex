"use client";
import LoginForm from "@/components/authPage/form/LoginForm";
import GithubButton from "@/components/common/button/GithubButton";
import GoogleButton from "@/components/common/button/GoogleButton";
import KakaoButton from "@/components/common/button/KakaoButton";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center">
      <LoginForm />
      <Link href="/sign-up">회원가입</Link>
      <div className="mt-8 flex flex-col">
        <KakaoButton />
        <GithubButton />
        <GoogleButton />
      </div>
    </div>
  );
};

export default LoginPage;
