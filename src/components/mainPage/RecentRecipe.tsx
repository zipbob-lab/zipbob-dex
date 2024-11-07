"use client";

import browserClient from "@/supabase/client";
import { useQuery } from "@tanstack/react-query";
import RecipeCard from "./RecipeCard";

const RecentRecipe = () => {
  const fetchRecentPosts = async () => {
    const { data, error } = await browserClient
      .from("MY_RECIPE_TABLE")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) {
      console.error("최근 게시글을 불러오는 과정에서 에러 발생" + error);
    }

    return data;
  };

  const {
    data: posts,
    isPending: isPostPending,
    isError: isPostError
  } = useQuery({
    queryKey: ["recentPosts"],
    queryFn: fetchRecentPosts,
    staleTime: 60
  });

  if (isPostPending) {
    return <div>좋아요 랭킹을 가져오는중입니다</div>;
  }

  if (isPostError) {
    return <div>좋아요 랭킹을 가져오는 도중 에러가 발생했습니다</div>;
  }

  return (
    <div className="mt-10 max-w-[1000px] rounded-[64px] bg-[#FFE8D8]">
      <div className="px-[5rem] py-[2.5rem]">
        <h1 className="text-[1.6rem] text-Primary-300">최근에 올라온 레시피</h1>
        <div className="mt-8 flex gap-[3rem] overflow-x-auto">
          {posts?.map((post) => <RecipeCard key={post.id} post={post} />)}
        </div>
      </div>
    </div>
  );
};

export default RecentRecipe;
