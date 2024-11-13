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
    queryFn: fetchLowKcalPosts
  });

  if (isPostPending) {
    return <div>저칼로리 레시피를 가져오는중입니다</div>;
  }

  if (isPostError) {
    return <div>저칼로리 레시피를 가져오는 도중 에러가 발생했습니다</div>;
  }

  return (
    <div className="w-full rounded-[3.75rem] bg-Secondary-25 py-[6.25rem]">
      <div className="mx-auto max-w-[1024px] text-center">
        <h2 className="font-wiggle text-main-30 text-[#834D27]">건강하고 맛있는 저칼로리 레시피</h2>
        <p className="mt-4">집밥도감이 추천하는 건강한 레시피에 도전해 보세요!</p>
        <div className="mt-[3.75rem] flex gap-4 overflow-x-auto">
          {posts?.map((post) => <RecipeCard key={post.id} post={post} />)}
        </div>
      </div>
    </div>
  );
};

export default HealthyRecipe;
