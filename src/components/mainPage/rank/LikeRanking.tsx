import { UserRankingProps } from "@/types/main";
import { useQuery } from "@tanstack/react-query";
import browserClient from "@/supabase/client";
import { useEffect, useState } from "react";
import { getUserNickname } from "@/serverActions/profileAction";
import LikeCard from "./LikeCard";

type UserNicknames = {
  [key: number]: string;
};

const LikeRanking = ({ showUserRanking }: UserRankingProps) => {
  const [userNickname, setUserNickname] = useState<UserNicknames>({
    0: "",
    1: "",
    2: ""
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
    queryKey: ["likeRankingPosts"],
    queryFn: fetchPosts,
    enabled: !showUserRanking
  });

  useEffect(() => {
    const fetchUserNicknames = async () => {
      if (!posts) return;
      const userNicknames = await Promise.all(posts.slice(0, 3).map((post) => getUserNickname(post.user_id)));
      setUserNickname(
        userNicknames.reduce((acc, nickname, index) => {
          acc[index] = nickname;
          return acc;
        }, {})
      );
    };
    fetchUserNicknames();
  }, [posts]);

  if (isPostPending) {
    return <div>좋아요 랭킹을 가져오는중입니다</div>;
  }

  if (isPostError) {
    return <div>좋아요 랭킹을 가져오는 도중 에러가 발생했습니다</div>;
  }

  return (
    <div className="flex justify-between">
      {posts?.map((post, index) => (
        <LikeCard key={post.id} post={post} userNickname={userNickname[index]} rank={index + 1} />
      ))}
    </div>
  );
};

export default LikeRanking;
