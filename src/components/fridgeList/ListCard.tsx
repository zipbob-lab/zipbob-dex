import React from "react";
import Link from "next/link";
import { Recipe } from "@/types/Recipe";
import Image from "next/image";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <li key={recipe.post_id}>
      <Link href={`/myrecipedetail/${recipe.post_id}`}>
        <h2>{recipe.recipe_title}</h2>
        <Image src={recipe.recipe_img_done} alt="이미지 없음" />
        <p>난이도: {recipe.recipe_level}</p>
        <p>좋아요: {recipe.like_count}</p>
        <p>스크랩: {recipe.scrap_count}</p>
      </Link>
    </li>
  );
};

export default RecipeCard;
