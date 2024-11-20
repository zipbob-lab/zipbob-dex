"use client";

import browserClient from "@/supabase/client";
import { useQuery } from "@tanstack/react-query";
import RecipeCard from "./RecipeCard";
import { useState } from "react";
import Pagination from "../common/Pagination";
import LoadingSpinner from "../common/LoadingSpinner";

const HealthyRecipe = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const fetchLowKcalPosts = async () => {
    const { data, error } = await browserClient
      .from("MY_RECIPE_TABLE")
      .select("*")
      .order("recipe_kcal")
      .range((currentPage - 1) * 3, currentPage * 3);

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
    queryKey: ["lowKcal", currentPage],
    queryFn: fetchLowKcalPosts,
    staleTime: 0
  });

  if (isPostError) {
    return <div>저칼로리 레시피를 가져오는 도중 에러가 발생했습니다</div>;
  }

  return (
    <div className="rounded-[3.75rem] bg-Secondary-25 py-[1.5rem] md:w-full md:py-[2rem] xl:py-[6.25rem]">
      <div className="mx-auto px-3 text-center md:w-[43rem] md:px-0 xl:w-[64rem]">
        <h2 className="font-wiggle text-main-20 text-[#834D27] xl:text-main-30">건강하고 맛있는 저칼로리 레시피</h2>
        <p className="mt-3 text-body-14 md:text-body-16 xl:mt-4 xl:text-body-18">
          집밥도감이 추천하는 건강한 레시피에 도전해 보세요!
        </p>
        <div className="mt-[1.75rem] grid grid-cols-2 place-items-center gap-x-3 gap-y-4 md:mt-[2rem] md:flex md:justify-between xl:mt-[3.75rem] xl:gap-[1rem]">
          {isPostPending ? <LoadingSpinner /> : posts?.map((post) => <RecipeCard key={post.id} post={post} />)}
        </div>
        <div className="mt-[1.75rem] flex items-center justify-center md:mt-[2rem] xl:mt-[3rem]">
          <Pagination
            currentPage={currentPage}
            pageSize={4}
            totalItems={40}
            className="rounded-full bg-white px-5 py-3 ssm:w-[296px] sm:text-body-14 lg:w-[464px]"
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default HealthyRecipe;
