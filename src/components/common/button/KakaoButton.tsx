"use client";

import browserClient from "@/supabase/client";
import KakaoIcon from "@images/kakao.svg";
import Image from "next/image";

const signInWithKakao = async () => {
  await browserClient.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      queryParams: {
        prompt: "select_account"
      },
      redirectTo: window.origin + "/auth/callback"
    }
  });
};

const KakaoButton = () => {
  return (
    <button onClick={signInWithKakao}>
      <Image src={KakaoIcon} alt="카카오 아이콘" />
    </button>
  );
};

export default KakaoButton;
