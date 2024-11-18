import React from "react";
import Link from "next/link";
import { Recipe } from "@/types/Search";

import Image from "next/image";
import DefaultImage from "@images/myrecipe/imageFile.svg";
import LikeCount from "@images/likeCount.svg";
import ScrapCount from "@images/scrapCount.svg";
import FireFilledIcon from "@images/fireFilled.svg";
import FireEmptyIcon from "@images/fireEmpty.svg";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <li key={recipe.post_id} className="h-[344px] w-[244px] p-4">
      <Link href={`/myrecipedetail/${recipe.post_id}`}>
        <Image
          src={recipe.recipe_img_done || DefaultImage}
          width={216}
          height={216}
          alt="이미지 없음"
          className="mb-3 h-[212px] w-[212px] rounded-3xl object-cover"
        />
        <h2 className="mb-3 text-body-16 font-medium">{recipe.recipe_title}</h2>
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            <Image src={FireFilledIcon} alt="레시피 난이도" />
            <Image src={recipe.recipe_level !== "하" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
            <Image src={recipe.recipe_level === "상" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
          </div>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1 text-body-13">
              <Image src={LikeCount} width={19} height={19} alt="좋아요" />
              <span>{recipe.like_count}</span>
            </div>
            <div className="flex items-center space-x-1 text-body-13">
              <Image src={ScrapCount} width={19} height={19} alt="스크랩" />
              <span>{recipe.scrap_count}</span>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default RecipeCard;

// 2024.11.15 이후 사용 중단
