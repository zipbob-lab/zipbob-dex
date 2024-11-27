"use client";

import browserClient from "@/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import FireFilledIcon from "@images/fireFilled.svg";
import FireEmptyIcon from "@images/fireEmpty.svg";
import { useUserNickname } from "@/serverActions/profileAction";
import { RecentCommentCardProps } from "@/types/main";
import { useRouter } from "next/navigation";
import DefaultImage from "@images/myrecipe/imageFile.svg";

const RecentCommentCard = ({ comment }: RecentCommentCardProps) => {
  const router = useRouter();
  const { data: nickname } = useUserNickname(comment.user_id);

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

  if (isPostError) {
    return <div>게시글을 가져오는 도중 에러가 발생했습니다</div>;
  }

  return (
    <div
      className="flex cursor-pointer rounded-2xl p-4 shadow-[0px_4px_20px_0px_rgba(154,130,102,0.1)]"
      onClick={() => router.push(`myrecipedetail/${post?.post_id}`)}
    >
      <div className="relative h-[6.25rem] w-[6.25rem] md:h-[7.5rem] md:w-[7.5rem]">
        <Image
          src={post?.recipe_img_done || DefaultImage}
          alt="레시피 사진"
          fill
          sizes="(min-width: 768px) 7.5rem, 6.25rem"
          className="rounded-2xl object-cover"
          loading="lazy"
        />
      </div>
      <div className="ml-4 flex w-[calc(100%-7.25rem)] flex-col justify-between md:w-[calc(100%-8.5rem)]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex flex-shrink-0">
              <Image src={FireFilledIcon} alt="레시피 난이도" className="h-4 w-4 xl:h-5 xl:w-5" />
              <Image
                src={post?.recipe_level !== "하" ? FireFilledIcon : FireEmptyIcon}
                alt="레시피 난이도"
                className="h-4 w-4 xl:h-5 xl:w-5"
              />
              <Image
                src={post?.recipe_level === "상" ? FireFilledIcon : FireEmptyIcon}
                alt="레시피 난이도"
                className="h-4 w-4 xl:h-5 xl:w-5"
              />
            </div>
            <p className="line-clamp-1 overflow-hidden text-title-16 text-Gray-900 xl:text-title-16">
              {post?.recipe_title}
            </p>
          </div>
          <p className="text-r-body-15 line-clamp-2 overflow-hidden text-start text-Gray-900">{comment.comment}</p>
        </div>
        <div className="flex justify-between text-Gray-300">
          <p className="text-body-13">{nickname}</p>
          <p className="text-body-12">{comment.created_at.slice(0, 10)}</p>
        </div>
      </div>
    </div>
  );
};

export default RecentCommentCard;
