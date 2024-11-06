import React from "react";
import Link from "next/link";
import { Recipe } from "@/types/Recipe";

import Image from "next/image";
import LikeCount from "@images/likeCount.svg";
import ScrapCount from "@images/scrapCount.svg";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const levelImages: { [key: string]: string } = {
    상: "/images/high.png",
    중: "/images/medium.png",
    하: "/images/low.png"
  };

  return (
    <li key={recipe.post_id}>
      <Link href={`/myrecipedetail/${recipe.post_id}`}>
        <Image
          src={recipe.recipe_img_done}
          width={216}
          height={216}
          alt="이미지 없음"
          className="h-[216px] w-[216px] rounded-3xl object-cover"
        />
        <h2 className="text-[16px]">{recipe.recipe_title}</h2>
        <p>
          <Image src={levelImages[recipe.recipe_level]} alt={recipe.recipe_level} width={50} height={50} />
        </p>
        <p className="text-[13px]">
          <Image src={LikeCount} width={19} height={19} alt="좋아요" /> {recipe.like_count}
        </p>
        <p className="text-[13px]">
          <Image src={ScrapCount} width={19} height={19} alt="좋아요" /> {recipe.scrap_count}
        </p>
      </Link>
    </li>
  );
};

export default RecipeCard;

// todo
// 1. 사용지 닉네임 표시
// 2. 인증인가 좋아요 기능 업데이트
// 3. 인증인가 스크랩 기능 업데이트
