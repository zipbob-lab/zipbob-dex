import React from "react";
import { fetchRecipeDbData } from "@/serverActions/fetchRecipeDataFromSupabase";
import RecipeCard from "@/components/RecipeCard";
import { Recipe } from "@/types/Recipe";
import Link from "next/link";
import RecipeWriteButton from "@/components/common/button/RecipeWriteButton";
import ScrapButton from "../../../components/common/button/ScrapButton";
import LikeButton from "@/components/common/button/LikeButton";
const RecipeAll = async () => {
  const data = await fetchRecipeDbData();
  const recipes = data?.slice(0, 30);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">전체 요리 레시피</h1>
      <RecipeWriteButton />
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8 ">
        {recipes?.map((recipe: Recipe) => (
          <div key={recipe.post_id} className="relative">
            <Link href={`/myrecipedetail/${recipe.post_id}`} passHref>
              <RecipeCard recipe={recipe} />
            </Link>
            {/* ScrapButton,LikeButton Link 밖으로 빼기 */}
            <div className="flex justify-end">
              <LikeButton postId={recipe.post_id} />
              <ScrapButton postId={recipe.post_id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeAll;
