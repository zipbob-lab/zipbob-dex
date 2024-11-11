"use client";

import { getUserNickname } from "@/serverActions/profileAction";
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
import { useStore } from "zustand";
import { useAuthStore } from "@/store/authStore";

interface ExtendedRecipeCardProps extends RecipeCardProps {
  isEditMode?: boolean;
  onDelete?: (postId: string) => void;
}

const RecipeCard = ({ post, isEditMode = false, onDelete }: ExtendedRecipeCardProps) => {
  const { userId } = useStore(useAuthStore);
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
    <div
      className="flex cursor-pointer flex-col gap-3 rounded-[1.25rem] bg-white p-3"
      onClick={() => router.push(`/myrecipedetail/${post.post_id}`)}
    >
      <div className="relative h-[13.5rem] w-[13.5rem] overflow-hidden">
        <Image
          src={post.recipe_img_done || DefaultImage}
          alt="레시피 사진"
          fill
          sizes="13.5rem"
          className="rounded-[1.25rem] object-cover"
          loading="lazy"
        />
      </div>
      <p>{post.recipe_title}</p>
      <p className="text-gray-500">{nickname}</p>
      <div className="flex justify-between">
        <div className="flex">
          <Image src={FireFilledIcon} alt="레시피 난이도" className="h-auto w-auto" />
          <Image
            src={post.recipe_level !== "하" ? FireFilledIcon : FireEmptyIcon}
            alt="레시피 난이도"
            className="h-auto w-auto"
          />
          <Image
            src={post.recipe_level === "상" ? FireFilledIcon : FireEmptyIcon}
            alt="레시피 난이도"
            className="h-auto w-auto"
          />
        </div>

        {/* 편집 모드 아닐 때 -> LikeButton / ScrapButton 활성화 */}
        {!isEditMode ? (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
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
