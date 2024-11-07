"use client";

import browserClient from "@/supabase/client";
import Image from "next/image";
import GithubIcon from "@images/github.svg";

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
  return (
    <button onClick={signInWithGithub}>
      <Image src={GithubIcon} width={48} alt="깃허브 아이콘" />
    </button>
  );
};

export default GithubButton;
