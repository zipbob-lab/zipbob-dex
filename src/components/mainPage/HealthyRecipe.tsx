"use client";

import browserClient from "@/supabase/client";
import { useQuery } from "@tanstack/react-query";
import RecipeCard from "./RecipeCard";

const HealthyRecipe = () => {
  const fetchLowKcalPosts = async () => {
    const { data, error } = await browserClient.from("MY_RECIPE_TABLE").select("*").order("recipe_kcal").limit(8);

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
    queryKey: ["lowKcal"],
    queryFn: fetchLowKcalPosts,
    staleTime: 60
  });

  if (isPostPending) {
    return <div>저칼로리 레시피를 가져오는중입니다</div>;
  }

  if (isPostError) {
    return <div>저칼로리 레시피를 가져오는 도중 에러가 발생했습니다</div>;
  }

  return (
    <div className="w-full rounded-[2.5rem] bg-[#FFF6DC] px-[5.5rem] py-12">
      <h1 className="mt-2 text-center font-yangjin text-[2.25rem] font-medium leading-[105%] tracking-[-0.18px] text-Secondary-400">
        건강하고 맛있는 저칼로리 레시피
      </h1>
      <div className="mt-[3.75rem] flex gap-[3rem] overflow-x-auto">
        {posts?.map((post) => <RecipeCard key={post.id} post={post} />)}
      </div>
    </div>
  );
};

export default HealthyRecipe;
