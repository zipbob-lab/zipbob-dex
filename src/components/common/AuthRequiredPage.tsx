"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthRequiredPage = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn !== undefined) {
      if (!isLoggedIn) {
        alert("로그인이 필요한 페이지입니다. 로그인 페이지로 이동합니다.");
        router.push("/login");
      }
    }
  }, [router, isLoggedIn]);

  return children;
};

export default AuthRequiredPage;
