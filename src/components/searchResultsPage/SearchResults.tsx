"use client";

import React, { useEffect, useState } from "react";
import browserClient from "@/supabase/client";
import { Recipe } from "@/types/Recipe";
import { useParams } from "next/navigation";
import RecipeCard from "@/components/common/search/ListCard";
import SortOptions from "@/components/common/search/SortOptions";
import Pagination from "@/components/common/Pagination";

import Image from "next/image";
import NoneAlert from "@images/noneAlert.svg";

const SearchResult = () => {
  const { query } = useParams();
  const searchText = decodeURI(query as string);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [sortOption, setSortOption] = useState<string>("likes");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 16;

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        let request = browserClient
          .from("MY_RECIPE_TABLE")
          .select("*")
          .filter("recipe_title", "ilike", `%${searchText}%`);

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(recipes.length / itemsPerPage);

  return (
    <div>
      <div className="mx-auto flex max-w-[1024px] items-center justify-between py-[40px]">
        <p className="text-[20px] font-semibold">
          &quot;{searchText}&quot; 검색어 결과 {recipes.length}개
        </p>
        <SortOptions sortOption={sortOption} setSortOption={setSortOption} />
      </div>
      <section>
        {recipes.length > 0 ? (
          <div>
            <ul className="mx-auto grid max-w-[1024px] grid-cols-4 gap-[52px]">
              {recipes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((recipe) => (
                <RecipeCard key={recipe.post_id} recipe={recipe} />
              ))}
            </ul>
            <div className="mb-8 mt-8">
              <Pagination
                currentPage={currentPage}
                pageSize={itemsPerPage}
                totalItems={recipes.length}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex min-h-[50vh] flex-col items-center justify-center">
              <Image src={NoneAlert} width={80} height={80} alt="경고" className="mb-6" />
              <p className="mb-10 w-auto whitespace-nowrap text-center text-[20px] font-semibold">
                &quot;{searchText}&quot; 키워드와 일치하는 레시피가 없습니다.
              </p>
              <ul className="flex h-[152px] w-[548px] list-disc flex-col items-center justify-center rounded-2xl bg-stone-100 p-4 pl-5">
                <h1 className="mb-4 text-[18px] font-semibold text-[#ff9143]">검색 Tip!</h1>
                <li className="text-center text-[16px] text-stone-500">레시피명을 다시 확인해주세요!</li>
                <li className="text-center text-[16px] text-stone-500">구체적인 키워드를 사용해보세요!</li>
                <li className="mt-1 text-center text-[16px] text-stone-500">키워드를 조합해 레시피를 검색해보세요!</li>
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
