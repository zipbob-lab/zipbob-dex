import { fetchUserPosts } from "@/serverActions/fetchRecipeDataFromSupabase";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import LikeButton from "../common/button/LikeButton";
import ScrapButton from "../common/button/ScrapButton";
import FireFilledIcon from "@images/fireFilled.svg";
import FireEmptyIcon from "@images/fireEmpty.svg";

interface UserPost {
  post_id: string;
  recipe_title: string;
  recipe_img_done: string;
  recipe_level: string;
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
    <div className="max-h-[560px] overflow-y-auto">
      {posts.map((post) => (
        <div key={post.post_id} className="flex border-b border-gray-200 p-4">
          <Link href={`/myrecipedetail/${post.post_id}`} className="flex">
            <Image
              src={post.recipe_img_done}
              alt={post.recipe_title}
              width={100}
              height={100}
              className="mr-4 h-24 w-24 rounded-md"
            />

            <div className="flex flex-col">
              <div className="flex">
                <Image src={FireFilledIcon} alt="레시피 난이도" />
                <Image src={post.recipe_level !== "하" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
                <Image src={post.recipe_level === "상" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
              </div>
              <h3 className="text-lg font-bold">{post.recipe_title}</h3>
              <div className="mt-2 flex gap-2">
                <Image src={post.user.user_img} alt={post.user.user_nickname} width={36} height={36} />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">작성자: {post.user.user_nickname}</span>
                  <span className="text-sm text-gray-500">소개: {post.user.user_introduce}</span>
                </div>
              </div>
            </div>
          </Link>
          <div className="flex items-center justify-end gap-2">
            <LikeButton postId={post.post_id} />
            <ScrapButton postId={post.post_id} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserPostLists;
