"use client";

import { getUserNickname } from "@/serverActions/profileAction";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type RecipeCardProps = {
  post: {
    recipe_img_done: string;
    recipe_title: string;
    like_count: number;
    scrap_count: number;
    user_id: string;
  };
};

const RecipeCard = ({ post }: RecipeCardProps) => {
  const [nickname, setNickname] = useState("");
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userProfile = await getUserNickname(post.user_id);
      setNickname(userProfile);
    };
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="w-[7.5rem] h-[7.5rem] relative">
        <Image src={post.recipe_img_done} alt="레시피 사진" fill className="object-cover" />
      </div>
      <p className="text-center">{post.recipe_title}</p>
      <p className="text-center">{nickname}</p>
      <p className="text-center">{post.like_count}</p>
      <p className="text-center">{post.scrap_count}</p>
    </div>
  );
};

export default RecipeCard;
