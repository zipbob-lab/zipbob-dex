"use client";

import MyRecipeWrite from "../../myrecipewrite/page";

const RecipeWriteModal = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={`&::-webkit-scrollbar]:hidden max-h-[80vh] overflow-scroll overflow-y-auto rounded-lg bg-Gray-50 lg:max-w-[67.5rem]`}
        onClick={(e) => e.stopPropagation()}
      >
        <MyRecipeWrite />
      </div>
    </div>
  );
};

export default RecipeWriteModal;
