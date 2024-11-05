import { fetchUserComments, fetchRecipeByPostId } from "@/serverActions/fetchRecipeDataFromSupabase";
import Link from "next/link";
import Image from "next/image";
import FireFilledIcon from "@images/fireFilled.svg";
import FireEmptyIcon from "@images/fireEmpty.svg";
import React, { useEffect, useState } from "react";

interface UserComment {
  post_id: string;
  comment: string;
  created_at: string;
  recipe?: {
    recipe_title: string;
    recipe_img_done: string;
    recipe_level: string;
  } | null;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const UserComment = ({ userId }: { userId: string }) => {
  const [comments, setComments] = useState<UserComment[] | null>(null);

  useEffect(() => {
    const loadCommentsWithRecipes = async () => {
      const commentsData = await fetchUserComments(userId);
      if (commentsData?.comments?.length) {
        // 댓글의 post_id를 이용해 레시피 정보 추가
        const commentsWithRecipes = await Promise.all(
          commentsData.comments.map(async (comment) => {
            const recipeData = await fetchRecipeByPostId(comment.post_id);
            return { ...comment, recipe: recipeData };
          })
        );
        setComments(commentsWithRecipes);
      }
    };

    loadCommentsWithRecipes();
  }, [userId]);

  if (!comments) return <p>아직 작성한 댓글이 없어요!</p>;

  return (
    <div className="max-h-[530px] w-full overflow-y-auto">
      {comments?.map((comment) => (
        <Link key={comment.post_id} href={`/myrecipedetail/${comment.post_id}`}>
          <div className="flex w-full flex-col justify-between border-b border-gray-200 p-4">
            <div className="flex">
              {comment.recipe ? (
                <Image
                  src={comment.recipe.recipe_img_done}
                  alt={comment.recipe.recipe_title}
                  width={100}
                  height={100}
                  className="mr-4 h-24 w-24 rounded-md"
                />
              ) : (
                <p>댓글 정보를 찾을 수 없습니다</p>
              )}
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    <Image src={FireFilledIcon} alt="레시피 난이도" />
                    <Image
                      src={comment.recipe?.recipe_level !== "하" ? FireFilledIcon : FireEmptyIcon}
                      alt="레시피 난이도"
                    />
                    <Image
                      src={comment.recipe?.recipe_level === "상" ? FireFilledIcon : FireEmptyIcon}
                      alt="레시피 난이도"
                    />
                  </div>
                  <h3 className="text-lg font-bold">{comment.recipe?.recipe_title || "레시피 없음"}</h3>
                </div>
                <p className="mt-2 line-clamp-2 flex-1">
                  {comment.comment.length > 100 ? `${comment.comment.slice(0, 100)}...` : comment.comment}
                </p>
                {/* 시간을 제일 아래쪽에 붙임 */}
                <p className="mt-auto text-right text-sm text-gray-500">{formatDate(comment.created_at)}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default UserComment;
