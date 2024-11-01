"use client";

import MyRecipeWrite from "../../myrecipewrite/page";

const RecipeWriteModal = () => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <MyRecipeWrite />
      </div>
    </div>
  );
};

export default RecipeWriteModal;
