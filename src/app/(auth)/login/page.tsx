import KakaoButton from "@/components/common/button/KakaoButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 페이지",
  description: "로그인 페이지 입니다."
};

const LoginPage = () => {
  return (
    <>
      <KakaoButton />
    </>
  );
};

export default LoginPage;
