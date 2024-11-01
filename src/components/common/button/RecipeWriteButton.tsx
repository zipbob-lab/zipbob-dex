"use client";

import { useRouter } from "next/navigation";
import React from "react";

const RecipeWriteButton = () => {
  const router = useRouter();

  const handleWriteButton = () => {
    router.push("/myrecipewrite");
  };

  return (
    <button className="bg-orange-400 p-2 text-white" onClick={handleWriteButton}>
      글 작성
    </button>
  );
};

export default RecipeWriteButton;
