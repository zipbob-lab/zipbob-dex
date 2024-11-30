"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useStore } from "zustand";

const RecipeWriteButton = () => {
  const router = useRouter();
  const { isLoggedIn } = useStore(useAuthStore);

  return (
    <button
      className="rounded-2xl bg-Primary-300 py-4 transition hover:bg-Primary-500 lg:w-[13.75rem] xl:w-[18.125rem]"
      onClick={() => {
        if (isLoggedIn) {
          router.push("/myrecipewrite");
        } else {
          alert("나만의 레시피를 작성하려면 로그인 먼저 해주세요.");
        }
      }}
    >
      <span className="text-title-18 text-white">나만의 레시피 올리기</span>
    </button>
  );
};

export default RecipeWriteButton;
