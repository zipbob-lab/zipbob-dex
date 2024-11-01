import { fetchUserPosts } from "@/serverActions/fetchRecipeDataFromSupabase";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface UserPost {
  post_id: string;
  recipe_title: string;
  recipe_img_done: string;
  user: {
    user_id: string;
    user_nickname: string;
    user_img: string;
    user_introduce: string;
    user_rank: number;
  };
}

const UserPostLists = ({ userId }: { userId: string }) => {
  const [posts, setPosts] = useState<UserPost[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchUserPosts(userId);
        if (data) setPosts(data);
      } catch (error) {
        console.error("레시피 데이터를 가져오는 중 에러 발생:", error);
      }
    };

    loadPosts();
  }, [userId]);

  if (posts.length === 0) return <p>데이터를 불러오고 있어요!</p>;

  return (
    <div className="overflow-y-auto max-h-[560px]">
      {posts.map((post) => (
        <div key={post.post_id} className="flex p-4 border-b border-gray-200">
          <Image
            src={post.recipe_img_done}
            alt={post.recipe_title}
            width={100}
            height={100}
            className="w-24 h-24 rounded-md mr-4"
          />
          <div>
            <h3 className="text-lg font-bold">{post.recipe_title}</h3>
            <p className="text-sm text-gray-500">작성자: {post.user.user_nickname}</p>
            <p className="text-sm text-gray-500">소개: {post.user.user_introduce}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserPostLists;
