import React from "react";
import Link from "next/link";
import { Recipe } from "@/types/Recipe";

import Image from "next/image";
import LikeCount from "@images/likeEmpty.svg";
import ScrapCount from "@images/scrapEmpty.svg";
import FireFilledIcon from "@images/fireFilled.svg";
import FireEmptyIcon from "@images/fireFilled.svg";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <li key={recipe.post_id} className="h-auto w-[216px]">
      <Link href={`/myrecipedetail/${recipe.post_id}`}>
        <Image
          src={recipe.recipe_img_done}
          width={216}
          height={216}
          alt="이미지 없음"
          className="mb-3 h-[216px] w-[216px] rounded-3xl object-cover"
        />
        <h2 className="mb-3 text-[16px] font-medium">{recipe.recipe_title}</h2>
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            <Image src={FireFilledIcon} alt="레시피 난이도" />
            <Image src={recipe.recipe_level !== "하" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
            <Image src={recipe.recipe_level === "상" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
          </div>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1 text-[13px]">
              <Image src={LikeCount} width={19} height={19} alt="좋아요" />
              <span>{recipe.like_count}</span>
            </div>
            <div className="flex items-center space-x-1 text-[13px]">
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

// todo
// 1. 사용지 닉네임 표시
// 2. 인증인가 좋아요 기능 업데이트
// 3. 인증인가 스크랩 기능 업데이트
