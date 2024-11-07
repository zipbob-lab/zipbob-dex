import { fetchUserPosts } from "@/serverActions/fetchRecipeDataFromSupabase";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import LikeButton from "../common/button/LikeButton";
import ScrapButton from "../common/button/ScrapButton";
import FireFilledIcon from "@images/fireFilled.svg";
import FireEmptyIcon from "@images/fireEmpty.svg";
import AlertIcon from "@images/noneAlert.svg";
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

  if (posts.length === 0)
    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 pt-6">
        <Image src={AlertIcon} alt="느낌표 아이콘" width={30} height={30} />
        아직 작성한 글이 없어요!
      </div>
    );

  return (
    <div className="max-h-[560px] w-full overflow-y-auto">
      {posts.map((post) => (
        <div key={post.post_id} className="flex w-full items-end justify-between p-4">
          <Link href={`/myrecipedetail/${post.post_id}`} className="flex flex-1">
            <Image
              src={post.recipe_img_done}
              alt={post.recipe_title}
              width={100}
              height={100}
              className="mr-4 h-24 w-24 rounded-md"
            />
            <div className="flex flex-col justify-start">
              <div className="mb-1 flex items-center">
                <Image src={FireFilledIcon} alt="레시피 난이도" />
                <Image src={post.recipe_level !== "하" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
                <Image src={post.recipe_level === "상" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
              </div>
              <h3 className="text-title-16">{post.recipe_title}</h3>
              <div className="mt-2 flex flex-1 items-center gap-5">
                <Image
                  src={post.user.user_img}
                  alt={post.user.user_nickname}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-title-14 text-Gray-900">{post.user.user_nickname}</span>
                  <span className="Gray-900 text-xs">{post.user.user_introduce}</span>
                </div>
              </div>
            </div>
          </Link>
          <div className="flex items-end gap-2">
            <LikeButton postId={post.post_id} />
            <ScrapButton postId={post.post_id} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserPostLists;
