"use client";

import browserClient from "@/supabase/client";
import { useQuery } from "@tanstack/react-query";
import RecipeCard from "./RecipeCard";
import { useState } from "react";
import Pagination from "../common/Pagination";

const RecentRecipe = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const fetchRecentPosts = async () => {
    const { data, error } = await browserClient
      .from("MY_RECIPE_TABLE")
      .select("*")
      .order("created_at", { ascending: false })
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
    queryKey: ["recentPosts", currentPage],
    queryFn: fetchRecentPosts
  });

  if (isPostPending) {
    return <div>좋아요 랭킹을 가져오는중입니다</div>;
  }

  if (isPostError) {
    return <div>좋아요 랭킹을 가져오는 도중 에러가 발생했습니다</div>;
  }

  return (
    <div className="rounded-[3.75rem] bg-Primary-50 py-[1.5rem] md:w-full md:py-[2rem] xl:py-[6.25rem]">
      <div className="mx-auto px-0 text-center sm:px-[1.25rem] md:w-[43rem] md:px-0 xl:w-[64rem]">
        <h2 className="font-wiggle text-main-20 text-[#834D27] xl:text-main-30">최근에 올라온 레시피</h2>
        <p className="mt-3 text-body-16 xl:mt-4 xl:text-body-18">집밥도감의 유저들이 올려준 레시피에 도전해 보세요!</p>
        <div className="mt-[1.75rem] grid grid-cols-2 place-items-center gap-y-4 sm:gap-x-[1rem] sm:gap-y-[1.75rem] md:mt-[2rem] md:flex md:justify-center xl:mt-[3.75rem] xl:gap-[1rem]">
          {posts?.map((post) => <RecipeCard key={post.id} post={post} />)}
        </div>
        <div className="mt-[1.75rem] md:mt-[2rem] xl:mt-[3rem]">
          <Pagination currentPage={currentPage} pageSize={4} totalItems={40} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  );
};

export default RecentRecipe;
