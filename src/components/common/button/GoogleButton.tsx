"use client";

import browserClient from "@/supabase/client";
import GoogleIcon from "@images/google.svg";
import Image from "next/image";

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
  return (
    <button onClick={signInWithGoogle}>
      <Image src={GoogleIcon} alt="구글 아이콘" />
    </button>
  );
};

export default GoogleButton;
