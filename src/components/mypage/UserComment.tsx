import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/components/common/Pagination";
import AlertIcon from "@images/noneAlert.svg";
import FireFilledIcon from "@images/fireFilled.svg";
import FireEmptyIcon from "@images/fireEmpty.svg";
import type { UserComment } from "@/types/MyPage";
import { fetchUserComments, fetchRecipeByPostId } from "@/serverActions/fetchRecipeDataFromSupabase";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const UserComment = ({ userId }: { userId: string }) => {
  const [comments, setComments] = useState<UserComment[] | null>(null);
  const [commentCount, setCommentCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4; // 페이지당 댓글 수

  const loadCommentsWithRecipes = async (page: number) => {
    const { comments: commentsData, commentCount } = await fetchUserComments(userId, page, pageSize);
    setCommentCount(commentCount);

    if (commentsData?.length) {
      const commentsWithRecipes = await Promise.all(
        commentsData.map(async (comment) => {
          const recipeData = await fetchRecipeByPostId(comment.post_id);
          return { ...comment, recipe: recipeData };
        })
      );
      setComments(commentsWithRecipes);
    } else {
      setComments(null);
    }
  };

  useEffect(() => {
    loadCommentsWithRecipes(currentPage);
  }, [userId, currentPage]);

  if (!comments || comments.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 pt-6">
        <Image src={AlertIcon} alt="느낌표 아이콘" width={30} height={30} />
        아직 작성한 댓글이 없어요!
      </div>
    );
  }

  return (
    <div>
      <div className="max-h-[530px] w-full overflow-y-auto">
        {comments.map((comment) => (
          <Link key={comment.post_id} href={`/myrecipedetail/${comment.post_id}`}>
            <div className="flex w-full flex-col justify-between p-4">
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
                  <p className="mt-2">
                    {comment.comment.length > 100 ? `${comment.comment.slice(0, 100)}...` : comment.comment}
                  </p>
                  <p className="mt-auto text-right text-sm text-gray-500">{formatDate(comment.created_at)}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={commentCount}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default UserComment;
