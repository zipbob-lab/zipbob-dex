import React from "react";
import BookmarkButton from "./common/BookmarkButton";

// 사용예시

type Recipe = {
  id: string;
  title: string;
  description: string;
};

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-sm mx-auto mb-4 relative">
      <h3 className="text-xl font-bold mb-2">{recipe.title}</h3>
      <p className="text-gray-600 mb-4">{recipe.description}</p>

      <BookmarkButton recipeId={recipe.id} />
    </div>
  );
};

export default RecipeCard;
