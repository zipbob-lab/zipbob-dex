"use client";

import browserClient from "@/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import FireFilledIcon from "@images/fireFilled.svg";
import FireEmptyIcon from "@images/fireEmpty.svg";
import { useEffect, useState } from "react";
import { getUserNickname } from "@/serverActions/profileAction";
import { RecentCommentCardProps } from "@/types/main";
import { useRouter } from "next/navigation";
import DefaultImage from "@images/myrecipe/imageFile.svg";

const RecentCommentCard = ({ comment }: RecentCommentCardProps) => {
  const [nickname, setNickname] = useState("");
  const router = useRouter();
  const fetchPosts = async () => {
    const { data, error } = await browserClient
      .from("MY_RECIPE_TABLE")
      .select("*")
      .eq("post_id", comment.post_id)
      .single();

    if (error) {
      console.error("게시글을 불러오는 과정에서 에러 발생" + error);
    }

    return data;
  };

  const { data: post, isError: isPostError } = useQuery({
    queryKey: ["commentPosts", comment.post_id],
    queryFn: fetchPosts
  });

  useEffect(() => {
    const fetchUserNickname = async () => {
      if (post) {
        const userNickname = await getUserNickname(post.user_id);
        setNickname(userNickname);
      }
    };
    fetchUserNickname();
  }, [post]);

  if (isPostError) {
    return <div>게시글을 가져오는 도중 에러가 발생했습니다</div>;
  }

  if (post) {
    return (
      <div className="flex rounded-2xl p-4 shadow-[0px_4px_20px_0px_rgba(154,130,102,0.1)]">
        <div className="relative h-[7.5rem] w-[7.5rem]">
          <Image
            src={post.recipe_img_done || DefaultImage}
            alt="레시피 사진"
            fill
            sizes="7.5rem"
            className="cursor-pointer rounded-2xl object-cover"
            loading="lazy"
            onClick={() => router.push(`myrecipedetail/${post.post_id}`)}
          />
        </div>
        <div className="ml-4 flex w-[calc(100%-8.5rem)] flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex">
                <Image src={FireFilledIcon} alt="레시피 난이도" />
                <Image src={post.recipe_level !== "하" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
                <Image src={post.recipe_level === "상" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
              </div>
              <p className="text-title-16 text-Gray-900">{post.recipe_title}</p>
            </div>
            <p className="text-r-body-15 line-clamp-2 overflow-hidden text-start text-Gray-900">{comment.comment}</p>
          </div>
          <div className="flex justify-between text-body-13 text-Gray-300">
            <p>{nickname}</p>
            <p>{comment.created_at.slice(0, 10)}</p>
          </div>
        </div>
      </div>
    );
  }
};

export default RecentCommentCard;
