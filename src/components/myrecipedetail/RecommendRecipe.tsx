"use client";

import browserClient from "@/supabase/client";
import { useQuery } from "@tanstack/react-query";
import RecipeCard2 from "./RecipeCard2";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const RecommendRecipe = () => {

  const fetchRamdomRecipe = async () => {
    const { data, error } = await browserClient.from("MY_RECIPE_TABLE").select("*").not('recipe_seq', 'is', null).order("recipe_seq", { ascending: false }).limit(10);

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
    queryFn: fetchRamdomRecipe,
    staleTime: 60
  });

  if (isPostPending) {
    return <div>추천 레시피를 불러오는 중입니다.</div>;
  }

  if (isPostError) {
    return <div>추천 레시피를 가져오는 도중 에러가 발생했습니다.</div>;
  }

  return (
    <div className="w-full rounded-[2.5rem] bg-transparent">
      <h1 className="py-[0.75rem] text-heading-24 text-Gray-900">
        이 레시피는 어때요?
      </h1>
      <div className="mt-[1rem] flex gap-[1rem]">
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
