"use client";

import { fetchUserProfile } from "@/serverActions/profileAction";
import React, { useEffect, useState } from "react";
import UserPostLists from "./UserPostLists";
import UserComment from "./UserComment";

const MyPostsCommentView = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"recipe" | "review">("recipe");

  useEffect(() => {
    const fetchUserId = async () => {
      const user = await fetchUserProfile();
      if (user) setUserId(user.user_id);
      console.log(user);
    };
    fetchUserId();
  }, []);

  if (!userId) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex gap-3 mb-4 border-b-2  border-gray-200 min-w-[600px]">
        <button
          onClick={() => setActiveTab("recipe")}
          className={activeTab === "recipe" ? "font-bold border-b-2 border-orange-500" : ""}
        >
          나만의 레시피
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={activeTab === "review" ? "font-bold border-b-2 border-orange-500" : ""}
        >
          작성한 후기
        </button>
      </div>

      {activeTab === "recipe" ? <UserPostLists userId={userId} /> : <UserComment userId={userId} />}
    </div>
  );
};

export default MyPostsCommentView;
