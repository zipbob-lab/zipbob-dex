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

  if (!userId) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex gap-3 mb-4 border-b-2 border-gray-200 min-w-[600px]">
        <button
          onClick={() => setActiveTab("recipe")}
          className={activeTab === "recipe" ? "font-bold border-b-2 border-orange-500" : ""}
        >
          나만의 레시피 <span className="py-1 px-2 bg-orange-400 text-white rounded-full">{recipeCount}</span>
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={activeTab === "review" ? "font-bold border-b-2 border-orange-500" : ""}
        >
          작성한 후기 <span className="py-1 px-2 bg-orange-400 text-white rounded-full">{commentCount}</span>
        </button>
      </div>

      {activeTab === "recipe" ? <UserPostLists userId={userId} /> : <UserComment userId={userId} />}
    </div>
  );
};

export default MyPostsCommentView;
