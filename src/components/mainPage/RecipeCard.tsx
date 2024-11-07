"use client";

import { getUserId, getUserNickname } from "@/serverActions/profileAction";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import FireFilledIcon from "@images/fireFilled.svg";
import FireEmptyIcon from "@images/fireEmpty.svg";
import browserClient from "@/supabase/client";
import { RecipeCardProps } from "@/types/main";
import { useRouter } from "next/navigation";
import LikeButton from "../common/button/LikeButton";
import ScrapButton from "../common/button/ScrapButton";
import TrashCanIcon from "@images/trashcan.svg";
import DefaultImage from "@images/myrecipe/imageFile.svg";

interface ExtendedRecipeCardProps extends RecipeCardProps {
  isEditMode?: boolean;
  onDelete?: (postId: string) => void;
}

const RecipeCard = ({ post, isEditMode = false, onDelete }: ExtendedRecipeCardProps) => {
  const [nickname, setNickname] = useState("");
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
    };
    fetchUserProfile();
    fetchIsUserLiked();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-w-1 aspect-h-1 relative min-h-[12rem] min-w-[12rem] overflow-hidden">
        <Image
          src={post.recipe_img_done || DefaultImage}
          alt="레시피 사진"
          layout="fill"
          objectFit="cover"
          className="cursor-pointer rounded-[20px] object-cover"
          onClick={() => router.push(`/myrecipedetail/${post.post_id}`)}
        />
      </div>
      <p>{post.recipe_title}</p>
      <p className="text-gray-500">{nickname}</p>
      <div className="flex justify-between">
        <div className="flex">
          <Image src={FireFilledIcon} alt="레시피 난이도" />
          <Image src={post.recipe_level !== "하" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
          <Image src={post.recipe_level === "상" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
        </div>

        {/* 편집 모드 아닐 때 -> LikeButton / ScrapButton 활성화 */}
        {!isEditMode ? (
          <div className="flex items-center gap-2">
            <LikeButton postId={post.post_id} />
            <ScrapButton postId={post.post_id} />
          </div>
        ) : (
          // 편집모드일 떄 -> 휴지통모양 생성
          onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(post.post_id);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <Image src={TrashCanIcon} alt="삭제 아이콘" width={22} height={22} />
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
