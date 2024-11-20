import LoginContent from "@/components/authPage/LoginContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 페이지",
  description: "이메일로 로그인하거나 소셜로그인을 할 수 있습니다."
};

const LoginPage = () => {
  return (
    <div className="-mt-3 flex h-screen flex-col items-center justify-center">
      <LoginContent />
    </div>
  );
};

export default LoginPage;
