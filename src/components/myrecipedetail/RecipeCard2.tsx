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
import TrashCanIcon from "@images/myrecipe/trashCan.svg";
import DefaultImage from "@images/myrecipe/imageFile.svg";
import { useStore } from "zustand";
import { useAuthStore } from "@/store/authStore";

interface ExtendedRecipeCardProps extends RecipeCardProps {
  isEditMode?: boolean;
  onDelete?: (postId: string) => void;
}

const RecipeCard2 = ({ post, isEditMode = false, onDelete }: ExtendedRecipeCardProps) => {
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
      className="flex cursor-pointer flex-col gap-y-[0.5rem] w-[15.25rem] h-[20.125rem]"
      onClick={() => router.push(`/myrecipedetail/${post.post_id}`)}
    >
      <div className="relative h-[15.25rem] w-[15.25rem] overflow-hidden">
        <Image
          src={post.recipe_img_done || DefaultImage}
          alt="레시피 사진"
          fill
          sizes="15.25rem"
          className="rounded-[0.75rem] object-cover"
          loading="lazy"
        />
      </div>
      {/* 제목 */}
      <p className="text-body-15">{post.recipe_title}</p>
      <div>
        {/* 닉네임 */}
      <p className="text-Gray-500 text-body-13 mt-[0.25rem]">{nickname}</p>
      </div>
      
      <div className="flex justify-between">
        <div className="flex">
          <Image src={FireFilledIcon} alt="레시피 난이도" className="h-4 w-4" />
          <Image
            src={post.recipe_level !== "하" ? FireFilledIcon : FireEmptyIcon}
            alt="레시피 난이도"
            className="h-4 w-4"
          />
          <Image
            src={post.recipe_level === "상" ? FireFilledIcon : FireEmptyIcon}
            alt="레시피 난이도"
            className="h-4 w-4"
          />
        </div>

        {/* 편집 모드 아닐 때 -> LikeButton / ScrapButton 활성화 */}
        {!isEditMode ? (
          <div className="flex items-center gap-x-[0.38rem]" onClick={(e) => e.stopPropagation()}>
            <LikeButton postId={post.post_id } size={16}/>
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

export default RecipeCard2;
