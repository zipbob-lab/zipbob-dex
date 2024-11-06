"use client";

import React, { useEffect, useState } from "react";
import browserClient from "@/supabase/client";
import { Recipe } from "@/types/Recipe";
import { useParams } from "next/navigation";
import RecipeCard from "@/components/common/search/ListCard";
import SortOptions from "@/components/common/search/SortOptions";

import Image from "next/image";
import NoneAlert from "@images/noneAlert.svg";

const SearchResult = () => {
  const { query } = useParams();
  const searchText = decodeURI(query as string);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [sortOption, setSortOption] = useState<string>("default");

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        let request = browserClient.from("TEST2_TABLE").select("*").like("recipe_title", `%${searchText}%`);
        if (sortOption === "likes") {
          request = request.order("like_count", { ascending: false });
        } else if (sortOption === "commnet") {
          request = request.order("comment_count", { ascending: false });
        } else if (sortOption === "level") {
          request = request.order("recipe_level", { ascending: false });
        } else if (sortOption === "scraps") {
          request = request.order("scrap_count", { ascending: false });
        }

        const { data, error } = await request;

        if (error) {
          console.error("에러", error);
        } else {
          setRecipes(data as Recipe[]);
        }
      };
      fetchResults();
    }
  }, [query, sortOption]);

  return (
    <div>
      <div className="flex items-center justify-between px-[200px] py-[40px]">
        <p className="w-[162px] text-[20px] font-semibold">검색 결과 {recipes.length}개</p>
        <SortOptions sortOption={sortOption} setSortOption={setSortOption} /> {/* 적용된 부분 */}
      </div>
      <section>
        {recipes.length > 0 ? (
          <ul>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.post_id} recipe={recipe} />
            ))}
          </ul>
        ) : (
          <div>
            <div className="flex min-h-[50vh] flex-col items-center justify-center">
              <Image src={NoneAlert} width={80} height={80} alt="경고" className="mb-6" />
              <p className="mb-10 w-auto whitespace-nowrap text-center text-[20px] font-semibold">
                "{searchText}" 단어와 일치하는 레시피가 없습니다.
              </p>
              <ul className="flex h-[152px] w-[548px] list-disc flex-col items-center justify-center rounded-2xl bg-stone-100 p-4 pl-5">
                <h1 className="mb-4 text-[18px] font-semibold text-[#ff9143]">검색 Tip!</h1>
                <li className="text-center text-[16px] text-stone-500">레시피명을 다시 확인해주세요!</li>
                <li className="text-center text-[16px] text-stone-500">구체적인 키워드를 사용해보세요!</li>
                <li className="text-center text-[16px] text-stone-500">키워드를 조합해 레시피를 검색해보세요!</li>
              </ul>
            </div>
            <div className="min-h-[20vh]" />
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchResult;
