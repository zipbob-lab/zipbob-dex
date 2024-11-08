"use client";

import MyRecipeWrite from "../../myrecipe-write/page";

const RecipeWriteModal = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="max-h-[80vh] w-full max-w-[1080px] overflow-y-auto rounded-lg bg-Gray-50 px-8 py-12"
        onClick={(e) => e.stopPropagation()}
      >
        <MyRecipeWrite />
      </div>
    </div>
  );
};

export default RecipeWriteModal;
