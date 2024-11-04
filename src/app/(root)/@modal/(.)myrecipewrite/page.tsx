"use client";

import MyRecipeWrite from "../../myrecipewrite/page";

const RecipeWriteModal = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="max-h-[80vh] w-full max-w-5xl overflow-y-auto rounded-lg bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <MyRecipeWrite />
      </div>
    </div>
  );
};

export default RecipeWriteModal;
