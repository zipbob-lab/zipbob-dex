"use client";

import browserClient from "@/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import FireFilledIcon from "../../../../public/images/fireFilled.svg";
import FireEmptyIcon from "../../../../public/images/fireEmpty.svg";
import { useEffect, useState } from "react";
import { getUserNickname } from "@/serverActions/profileAction";
import { RecentCommentCardProps } from "@/types/main";

const RecentCommentCard = ({ comment }: RecentCommentCardProps) => {
  const [nickname, setNickname] = useState("");
  const fetchPosts = async () => {
    const { data, error } = await browserClient.from("TEST2_TABLE").select("*").eq("post_id", comment.post_id).limit(6);

    if (error) {
      console.error("최근 후기를 불러오는 과정에서 에러 발생" + error);
    }

    return data;
  };

  const {
    data: post,
    isPending: isPostPending,
    isError: isPostError
  } = useQuery({
    queryKey: ["commentPosts"],
    queryFn: fetchPosts,
    staleTime: 60
  });

  useEffect(() => {
    const fetchUserNickname = async () => {
      if (post) {
        const userNickname = await getUserNickname(post[0].user_id);
        setNickname(userNickname);
      }
    };
    fetchUserNickname();
  }, [post]);

  if (isPostPending) {
    return <div>최근 후기를 가져오는중입니다</div>;
  }

  if (isPostError) {
    return <div>최근 후기를 가져오는 도중 에러가 발생했습니다</div>;
  }

  if (post) {
    return (
      <div className="p-3 flex gap-3 w-[500px]">
        <div className="w-[8rem] h-[8rem] relative">
          <Image src={post[0].recipe_img_done} alt="레시피 사진" fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-between w-[calc(100%-12rem-3rem)]">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex">
                <Image src={FireFilledIcon} alt="레시피 난이도" />
                <Image src={post[0].recipe_level !== "하" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
                <Image src={post[0].recipe_level === "상" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
              </div>
              <p>{post[0].recipe_title}</p>
            </div>
            <p className="text-Gray-500">{comment.comment}</p>
          </div>
          <div className="flex justify-between">
            <p>{nickname}</p>
            <p>{comment.created_at.slice(0, 10)}</p>
          </div>
        </div>
      </div>
    );
  }
};

export default RecentCommentCard;
