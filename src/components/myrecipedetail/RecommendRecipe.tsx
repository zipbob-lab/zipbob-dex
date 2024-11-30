"use client";

import browserClient from "@/supabase/client";
import { useQuery } from "@tanstack/react-query";
import RecipeCard2 from "./RecipeCard2";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Recipe } from "@/types/Search";

const RecommendRecipe = () => {
  const fetchRandomRecipe = async (): Promise<Recipe[]> => {
    const { data, error } = await browserClient.rpc("random_recipes", { limit_row: 10 });
    if (error) {
      console.error("추천 레시피를 불러오는 과정에서 에러 발생" + error);
    }

    return data;
  };

  const {
    data: posts,
    isPending: isPostPending,
    isError: isPostError
  } = useQuery({
    queryKey: ["randomRecipe"],
    queryFn: fetchRandomRecipe,
    staleTime: 60
  });

  if (isPostPending) {
    return <div>추천 레시피를 불러오는 중입니다.</div>;
  }

  if (isPostError) {
    return <div>추천 레시피를 가져오는 도중 에러가 발생했습니다.</div>;
  }

  return (
    <div className="overflow-hidden bg-[#fbfbfb]">
      <h1 className="py-[0.75rem] text-heading-20 text-Gray-900 md:text-heading-24">이 레시피는 어때요?</h1>
      <div className="mt-[0.5rem] flex w-[1024px] gap-x-[1rem] md:mt-[1rem]">
        <Swiper spaceBetween={1} slidesPerView={4}>
          {posts?.map((post) => (
            <SwiperSlide key={post.id}>
              <RecipeCard2 post={post} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default RecommendRecipe;
