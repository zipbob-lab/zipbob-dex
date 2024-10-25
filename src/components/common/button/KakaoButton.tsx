"use client";

import browserClient from "@/supabase/client";

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
  return <button onClick={signInWithKakao}>카카오로 로그인</button>;
};

export default KakaoButton;
