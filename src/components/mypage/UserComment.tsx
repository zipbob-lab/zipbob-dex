import { fetchUserComments, fetchRecipeByPostId } from "@/serverActions/fetchRecipeDataFromSupabase";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface UserComment {
  post_id: string;
  comment: string;
  created_at: string;
  recipe?: {
    recipe_title: string;
    recipe_img_done: string;
  } | null;
}

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
    <div className="max-h-[560px] overflow-y-auto">
      {comments?.map((comment) => (
        <Link key={comment.post_id} href={`/myrecipedetail/${comment.post_id}`}>
          <div key={comment.post_id} className="flex border-b border-gray-200 p-4">
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
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{comment.recipe?.recipe_title || "레시피 없음"}</h3>
                <span className="inline-block text-sm text-gray-500">{comment.created_at}</span>
              </div>

              <p className="mt-2">{comment.comment}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default UserComment;
