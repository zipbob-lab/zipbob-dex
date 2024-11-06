"use client";

import { fetchUserProfile } from "@/serverActions/profileAction";
import { fetchUserComments, fetchUserRecipesCount } from "@/serverActions/fetchRecipeDataFromSupabase";
import React, { useEffect, useState } from "react";
import UserPostLists from "./UserPostLists";
import UserComment from "./UserComment";

const MyPostsCommentView = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"recipe" | "review">("recipe");
  const [recipeCount, setRecipeCount] = useState<number>(0);
  const [commentCount, setCommentCount] = useState<number>(0);

  useEffect(() => {
    const fetchUserId = async () => {
      const user = await fetchUserProfile();
      if (user) {
        setUserId(user.user_id);

        // 사용자 레시피와 댓글 개수 불러오기
        const [recipesCount, commentsData] = await Promise.all([
          fetchUserRecipesCount(user.user_id),
          fetchUserComments(user.user_id)
        ]);

        setRecipeCount(recipesCount);
        setCommentCount(commentsData?.commentCount || 0);
      }
    };
    fetchUserId();
  }, []);

  if (!userId)
    return <div className="flex w-full flex-col items-center justify-center gap-2 pt-6">잠시만 기다려 주세요</div>;

  return (
    <div>
      <div className="flex w-full gap-6 border-b border-gray-100">
        <button
          onClick={() => setActiveTab("recipe")}
          className={`${
            activeTab === "recipe" ? "border-b-2 border-Primary-300 font-bold text-Primary-300" : "text-gray-500"
          } flex items-center gap-1 pb-2`}
        >
          <span className="title-16">나만의 레시피</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-Primary-200 text-white">
            {recipeCount}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={`${
            activeTab === "review" ? "border-b-2 border-Primary-300 font-bold text-Primary-300" : "text-gray-500"
          } flex items-center gap-1 pb-2`}
        >
          <span className="title-16">작성한 후기</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-Primary-200 text-white">
            {commentCount}
          </span>
        </button>
      </div>

      {activeTab === "recipe" ? <UserPostLists userId={userId} /> : <UserComment userId={userId} />}
    </div>
  );
};

export default MyPostsCommentView;
