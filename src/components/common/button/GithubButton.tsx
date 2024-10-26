"use client";

import browserClient from "@/supabase/client";

const signInWithGithub = async () => {
  await browserClient.auth.signInWithOAuth({
    provider: "github",
    options: {
      queryParams: {
        prompt: "select_account"
      },
      redirectTo: window.origin + "/auth/callback"
    }
  });
};

const GithubButton = () => {
  return <button onClick={signInWithGithub}>깃허브로 로그인</button>;
};

export default GithubButton;
