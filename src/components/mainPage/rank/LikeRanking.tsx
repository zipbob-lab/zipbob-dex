import { UserRankingProps } from "@/types/Main";
import { useQuery } from "@tanstack/react-query";
import browserClient from "@/supabase/client";
import RankingHat from "@images/rankingHat";
import Image from "next/image";
import FireFilledIcon from "@images/fireFilled.svg";
import FireEmptyIcon from "@images/fireEmpty.svg";
import { useEffect, useState } from "react";
import { getUserNickname } from "@/serverActions/profileAction";
import LikeButton from "@/components/common/button/LikeButton";
import ScrapButton from "@/components/common/button/ScrapButton";
import { useRouter } from "next/navigation";

type UserNicknames = {
  [key: number]: string;
};

const LikeRanking = ({ showUserRanking }: UserRankingProps) => {
  const router = useRouter();
  const [userNickname, setUserNickname] = useState<UserNicknames>({
    1: "",
    2: "",
    3: ""
  });

  const fetchPosts = async () => {
    const { data, error } = await browserClient
      .from("MY_RECIPE_TABLE")
      .select("*")
      .order("like_count", { ascending: false })
      .limit(3);

    if (error) {
      console.error("게시글을 불러오는 과정에서 에러 발생" + error);
    }

    return data;
  };

  const {
    data: posts,
    isPending: isPostPending,
    isError: isPostError
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    enabled: !showUserRanking,
    staleTime: 60
  });

  useEffect(() => {
    const fetchUserNickname = async () => {
      const userNicknames = { ...userNickname };
      for (let i = 0; i < 3; i++) {
        const userProfile = await getUserNickname(posts?.[i].user_id);
        userNicknames[i + 1] = userProfile;
      }
      setUserNickname(userNicknames);
    };
    fetchUserNickname();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  if (isPostPending) {
    return <div>좋아요 랭킹을 가져오는중입니다</div>;
  }

  if (isPostError) {
    return <div>좋아요 랭킹을 가져오는 도중 에러가 발생했습니다</div>;
  }

  return (
    <div className="flex items-end gap-[1.75rem]">
      <div>
        <div className="ml-[1.375rem] inline-flex items-center rounded-t-[1.75rem] bg-Primary-300 px-12 py-3">
          <RankingHat fillColor="white" size={36} />
          <p className="mt-1 font-yangjin text-[1.875rem] font-medium leading-[120%] text-white">1위</p>
        </div>
        <div className="flex flex-col gap-4 rounded-3xl p-4 shadow-[0px_4px_20px_0px_rgba(154,130,102,0.1)]">
          <div className="relative h-[20.5rem] w-[20.5rem]">
            <Image
              src={posts?.[0].recipe_img_done}
              fill
              alt="레시피 이미지"
              className="cursor-pointer rounded-3xl object-cover"
              onClick={() => router.push(`/myrecipedetail/${posts?.[0].post_id}`)}
            />
          </div>
          <div>
            <p className="text-title-20 text-Gray-900">{posts?.[0].recipe_title}</p>
            <p className="mt-1 h-[1.349375rem] text-body-16 text-Gray-500">{userNickname[1]}</p>
            <div className="mt-3 flex justify-between">
              <div className="flex">
                <Image src={FireFilledIcon} alt="레시피 난이도" />
                <Image src={posts?.[0].recipe_level !== "하" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
                <Image src={posts?.[0].recipe_level === "상" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
              </div>
              <div className="flex items-center gap-2">
                <LikeButton postId={posts?.[0].post_id} />
                <ScrapButton postId={posts?.[0].post_id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="ml-[1.3125rem] inline-flex items-center rounded-t-3xl bg-Gray-300 px-[1.375rem] py-2">
          <RankingHat fillColor="white" size={32} />
          <p className="mt-1 font-yangjin text-[1.25rem] font-medium leading-[120%] text-white">2위</p>
        </div>
        <div className="flex flex-col gap-3 rounded-3xl px-3 py-4 shadow-[0px_4px_20px_0px_rgba(154,130,102,0.1)]">
          <div className="relative h-[17.5rem] w-[17.5rem]">
            <Image
              src={posts?.[1].recipe_img_done}
              fill
              alt="레시피 이미지"
              className="cursor-pointer rounded-3xl"
              onClick={() => router.push(`/myrecipedetail/${posts?.[1].post_id}`)}
            />
          </div>
          <div>
            <p className="text-title-18 text-Gray-900">{posts?.[1].recipe_title}</p>
            <p className="mt-1 h-[1.1375rem] text-[0.875rem] font-medium leading-[130%] text-Gray-500">
              {userNickname[1]}
            </p>
            <div className="mt-3 flex justify-between">
              <div className="flex">
                <Image src={FireFilledIcon} alt="레시피 난이도" />
                <Image src={posts?.[1].recipe_level !== "하" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
                <Image src={posts?.[1].recipe_level === "상" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
              </div>
              <div className="flex items-center gap-2">
                <LikeButton postId={posts?.[1].post_id} />
                <ScrapButton postId={posts?.[1].post_id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="ml-[1.3125rem] inline-flex items-center rounded-t-3xl bg-[#B6A57D] px-[1.375rem] py-2">
          <RankingHat fillColor="white" size={32} />
          <p className="mt-1 font-yangjin text-[1.25rem] font-medium leading-[120%] text-white">3위</p>
        </div>
        <div className="flex flex-col gap-3 rounded-3xl px-3 py-4 shadow-[0px_4px_20px_0px_rgba(154,130,102,0.1)]">
          <div className="relative h-[17.5rem] w-[17.5rem]">
            <Image
              src={posts?.[2].recipe_img_done}
              fill
              alt="레시피 이미지"
              className="cursor-pointer rounded-3xl"
              onClick={() => router.push(`/myrecipedetail/${posts?.[2].post_id}`)}
            />
          </div>
          <div>
            <p className="text-title-18 text-Gray-900">{posts?.[2].recipe_title}</p>
            <p className="mt-1 h-[1.1375rem] text-[0.875rem] font-medium leading-[130%] text-Gray-500">
              {userNickname[2]}
            </p>
            <div className="mt-3 flex justify-between">
              <div className="flex">
                <Image src={FireFilledIcon} alt="레시피 난이도" />
                <Image src={posts?.[2].recipe_level !== "하" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
                <Image src={posts?.[2].recipe_level === "상" ? FireFilledIcon : FireEmptyIcon} alt="레시피 난이도" />
              </div>
              <div className="flex items-center gap-2">
                <LikeButton postId={posts?.[2].post_id} />
                <ScrapButton postId={posts?.[2].post_id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikeRanking;
