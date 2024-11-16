import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/components/common/Pagination";
import EmptyContent from "@/components/common/EmptyContent";
import FireFilledIcon from "@images/fireFilled.svg";
import FireEmptyIcon from "@images/fireEmpty.svg";
import type { UserComment } from "@/types/MyPage";
import DefaultImage from "@images/myrecipe/imageFile.svg";
import { fetchUserComments, fetchRecipeByPostId } from "@/serverActions/fetchRecipeDataFromSupabase";
import LoadingSpinner from "../common/LoadingSpinner";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const UserComment = ({ userId }: { userId: string }) => {
  const [comments, setComments] = useState<UserComment[] | null>(null);
  const [commentCount, setCommentCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 4; // 페이지당 댓글 수

  const loadCommentsWithRecipes = async (page: number) => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  useEffect(() => {
    loadCommentsWithRecipes(currentPage);
  }, [userId, currentPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="gap-2 pt-6">
        <EmptyContent message="아직 작성한 후기가 없어요!">
          <ul className="text-body-16 text-Gray-500">
            <li>· 레시피를 탐험하며 후기를 남겨보세요.</li>
            <li>· 후기를 남기면 경험치가 올라간답니다!</li>
          </ul>
        </EmptyContent>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full overflow-y-auto ssm:h-[488px] md:h-[480px]">
        {comments.map((comment) => (
          <Link key={comment.post_id} href={`/myrecipedetail/${comment.post_id}`}>
            <div className="flex w-full flex-col justify-between pb-5">
              <div className="flex">
                {comment.recipe ? (
                  <Image
                    src={comment.recipe.recipe_img_done || DefaultImage}
                    alt={comment.recipe.recipe_title}
                    width={100}
                    height={100}
                    className="mr-5 h-[100px] w-[100px] rounded-md"
                  />
                ) : (
                  <p>댓글 정보를 찾을 수 없습니다</p>
                )}
                <div className="flex flex-1 flex-col">
                  <div className="flex gap-2">
                    <div className="flex text-Gray-900">
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
                    <h3 className="text-title-16">{comment.recipe?.recipe_title || "레시피 없음"}</h3>
                  </div>
                  <p className="mt-2 text-body-15">
                    {comment.comment.length > 100 ? `${comment.comment.slice(0, 100)}...` : comment.comment}
                  </p>
                  <p className="mt-auto text-right text-body-13 text-Gray-500">{formatDate(comment.created_at)}</p>
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
        className="min-w-[372px] gap-6 pt-6"
        buttonClassName="px-10"
      />
    </div>
  );
};

export default UserComment;
