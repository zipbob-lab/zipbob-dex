"use client";

import { fetchUserProfile } from "@/serverActions/profileAction";
import { fetchUserComments, fetchUserRecipesCount } from "@/serverActions/fetchRecipeDataFromSupabase";
import React, { useEffect, useState } from "react";
import UserPostLists from "./UserPostLists";
import UserComment from "./UserComment";
import LoadingSpinner from "../common/LoadingSpinner";

const MyPostsCommentView = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"recipe" | "review">("recipe");
  const [recipeCount, setRecipeCount] = useState<number>(0);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      setIsLoading(true);
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
      setIsLoading(false);
    };
    fetchUserId();
  }, []);

  const handleTabChange = (tab: "recipe" | "review") => {
    setIsLoading(true); // 탭 전환 시 로딩 상태 활성화
    setActiveTab(tab);
    setTimeout(() => setIsLoading(false), 300); // 임의로 로딩 지연 시간 추가 (비동기 로딩을 가정)
  };

  if (!userId)
    return (
      <div className="opacity-0">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="lg:min-h-[568px]">
      <div className="mb-6 flex w-full gap-6 border-b border-Gray-100">
        <button
          onClick={() => handleTabChange("recipe")}
          className={`${
            activeTab === "recipe" ? "border-b-2 border-Primary-300 text-Primary-300" : "text-Gray-500"
          } pb- flex items-center gap-1 pb-2`}
        >
          <span className="text-title-16">나만의 레시피</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-Primary-200 text-white">
            {recipeCount}
          </span>
        </button>
        <button
          onClick={() => handleTabChange("review")}
          className={`${
            activeTab === "review" ? "border-b-2 border-Primary-300 text-Primary-300" : "text-Gray-500"
          } flex items-center gap-1 pb-2`}
        >
          <span className="text-title-16">작성한 후기</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-Primary-200 text-white">
            {commentCount}
          </span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      ) : activeTab === "recipe" ? (
        <UserPostLists userId={userId} />
      ) : (
        <UserComment userId={userId} />
      )}
    </div>
  );
};

export default MyPostsCommentView;
