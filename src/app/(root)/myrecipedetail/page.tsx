import React from "react";
import { fetchRecipeDbData } from "@/serverActions/fetchRecipeDataFromSupabase";
import RecipeCard from "@/components/RecipeCard";
import { Recipe } from "@/types/Recipe";
import Link from "next/link";
import RecipeWriteButton from "@/components/common/button/RecipeWriteButton";

const RecipeAll = async () => {
  const data = await fetchRecipeDbData();
  const recipes = data?.slice(0, 30);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">전체 요리 레시피</h1>
      <RecipeWriteButton />
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8 ">
        {recipes?.map((recipe: Recipe) => (
          <Link key={recipe.post_id} href={`/myrecipedetail/${recipe.post_id}`}>
            <RecipeCard recipe={recipe} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecipeAll;
