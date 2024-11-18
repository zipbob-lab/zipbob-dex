"use client";

import MyRecipeWrite from "../../myrecipewrite/page";

const RecipeWriteModal = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={`h-full w-full overflow-y-auto rounded-lg bg-[#fbfbfb] lg:max-h-[80vh] lg:max-w-[67.5rem] [&::-webkit-scrollbar]:hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full w-full justify-center">
          <MyRecipeWrite />
        </div>
      </div>
    </div>
  );
};

export default RecipeWriteModal;
