"use client";

import browserClient from "@/supabase/client";

const signInWithGoogle = async () => {
  await browserClient.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        prompt: "select_account"
      },
      redirectTo: window.origin + "/auth/callback"
    }
  });
};

const GoogleButton = () => {
  return <button onClick={signInWithGoogle}>구글로 로그인</button>;
};

export default GoogleButton;
