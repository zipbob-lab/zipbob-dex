"use client";

import { useUserNickname } from "@/serverActions/profileAction";
import Image from "next/image";
import FireFilledIcon from "@images/fireFilled.svg";
import FireEmptyIcon from "@images/fireEmpty.svg";
import { RecipeCardProps } from "@/types/main";
import { useRouter } from "next/navigation";
import LikeButton from "../common/button/LikeButton";
import ScrapButton from "../common/button/ScrapButton";
import TrashCanIcon from "@images/myrecipe/trashCan.svg";
import DefaultImage from "@images/myrecipe/imageFile.svg";

interface ExtendedRecipeCardProps extends RecipeCardProps {
  isEditMode?: boolean;
  onDelete?: (postId: string) => void;
}

const RecipeCard = ({ post, isEditMode = false, onDelete }: ExtendedRecipeCardProps) => {
  const { data: nickname } = useUserNickname(post.user_id);
  const router = useRouter();

  return (
    <div
      className="flex w-[9rem] cursor-pointer flex-col rounded-[1.25rem] bg-white p-[0.75rem] shadow-[0px_4px_20px_0px_rgba(154,130,102,0.1)] sm:w-[10rem] xl:w-[15.25rem] xl:p-[1rem]"
      onClick={() => router.push(`/myrecipedetail/${post.post_id}`)}
    >
      <div className="relative h-[7.5rem] w-[7.5rem] overflow-hidden sm:h-[8.5rem] sm:w-[8.5rem] xl:h-[13.25rem] xl:w-[13.25rem]">
        <Image
          src={post.recipe_img_done || DefaultImage}
          alt="레시피 사진"
          fill
          sizes="(min-width: 1440px) 13.25rem, (min-width: 480px) 8.5rem, 7.5rem"
          className="rounded-[1.25rem] object-cover"
          loading="lazy"
        />
      </div>
      <div className="overflow-hidden text-start">
        <p className="mt-3 line-clamp-1 text-body-12 text-Gray-900 xl:text-title-16">{post.recipe_title}</p>
        <p className="mb-2 mt-1 h-[1.0125rem] text-r-body-12 text-gray-500 xl:mb-3 xl:h-[1.011875rem] xl:text-body-13">
          {nickname}
        </p>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <Image src={FireFilledIcon} alt="레시피 난이도" className="h-[1rem] w-[1rem] xl:h-[1.25rem] xl:w-[1.25rem]" />
          <Image
            src={post.recipe_level !== "하" ? FireFilledIcon : FireEmptyIcon}
            alt="레시피 난이도"
            className="h-[1rem] w-[1rem] xl:h-[1.25rem] xl:w-[1.25rem]"
          />
          <Image
            src={post.recipe_level === "상" ? FireFilledIcon : FireEmptyIcon}
            alt="레시피 난이도"
            className="h-[1rem] w-[1rem] xl:h-[1.25rem] xl:w-[1.25rem]"
          />
        </div>

        {/* 편집 모드 아닐 때 -> LikeButton / ScrapButton 활성화 */}
        {!isEditMode ? (
          <div className="flex" onClick={(e) => e.stopPropagation()}>
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
              <Image src={TrashCanIcon} alt="삭제 아이콘" width={20} height={20} />
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
