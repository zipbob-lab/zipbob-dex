"use client";

import { getUserId, getUserNickname } from "@/serverActions/profileAction";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import FireFilledIcon from "@images/fireFilled.svg";
import FireEmptyIcon from "@images/fireEmpty.svg";
// import LikeFilledIcon from "@images/likeFilled.svg";
// import LikeEmptyIcon from "@images/likeEmpty.svg";
// import ScrapEmptyIcon from "@images/scrapEmpty.svg";
import browserClient from "@/supabase/client";
import { RecipeCardProps } from "@/types/main";
import { useRouter } from "next/navigation";
import LikeButton from "../common/button/LikeButton";
import ScrapButton from "../common/button/ScrapButton";

const RecipeCard = ({ post }: RecipeCardProps) => {
  const [nickname, setNickname] = useState("");
  // const [isUserLiked, setIsUserLiked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (post.user_id) {
        const userProfile = await getUserNickname(post.user_id);
        setNickname(userProfile);
      }
    };
    const fetchIsUserLiked = async () => {
      const userId = await getUserId();
      const { error } = await browserClient
        .from("LIKE_TABLE")
        .select("*")
        .eq("user_id", userId)
        .eq("post_id", post.post_id);
      if (error) {
        throw error;
      }
      // setIsUserLiked(data.length > 0 ? true : false);
    };
    fetchUserProfile();
    fetchIsUserLiked();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-[12rem] w-[12rem]">
        {post.recipe_img_done && (
          <Image
            src={post.recipe_img_done}
            alt="레시피 사진"
            fill
            className="cursor-pointer object-cover"
            onClick={() => router.push(`/myrecipedetail/${post.post_id}`)}
          />
        )}
      </div>
      <p>{post.recipe_title}</p>
      <p className="text-gray-500">{nickname}</p>
      <div className="flex justify-between">
        <div className="flex">
          <Image src={FireFilledIcon} alt="레시피 난이도" />
          <Image src={post.recipe_level !== "하" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
          <Image src={post.recipe_level === "상" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center">
            {/* <Image src={isUserLiked ? LikeFilledIcon : LikeEmptyIcon} alt="좋아요 상태" /> */}
            <LikeButton postId={post.post_id} />
            {/* <p className="text-center">{post.like_count}</p> */}
          </div>
          <div className="flex items-center">
            {/* <Image src={ScrapEmptyIcon} alt="스크랩 상태" />
            <p className="text-center">{post.scrap_count}</p> */}
            <ScrapButton postId={post.post_id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
