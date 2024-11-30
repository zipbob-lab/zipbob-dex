"use client";

import React, { useEffect, useState } from "react";
import { Recipe } from "@/types/Search";
import { useParams } from "next/navigation";
import browserClient from "@/supabase/client";
import RecipeCard from "@/components/common/search/ListCard";
import SortOptions from "@/components/common/search/SortOptions";
import Pagination from "@/components/common/Pagination";
import LoadingSpinner from "@/components/common/LoadingSpinner";

import Image from "next/image";
import NoneAlert from "@images/noneAlert.svg";

const SearchResult = () => {
  const { query } = useParams();
  const searchText = decodeURI(query as string);

  // 메인 상태 관리
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [sortOption, setSortOption] = useState<string>("likes");
  const [loading, setLoading] = useState<boolean>(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(16);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 1024 경계 반응형
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth <= 1024) {
        setItemsPerPage(8);
      } else {
        setItemsPerPage(16);
      }
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => {
      window.removeEventListener("resize", updateItemsPerPage);
    };
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    // supabase fatching
    let request = browserClient.from("MY_RECIPE_TABLE").select("*");
    if (sortOption === "likes") {
      request = request.order("like_count", { ascending: false });
    } else if (sortOption === "comment") {
      request = request.order("comment_count", { ascending: false });
    } else if (sortOption === "scraps") {
      request = request.order("scrap_count", { ascending: false });
    }

    const { data, error } = await request;

    if (error) {
      console.error("에러", error);
    } else {
      if (sortOption === "level") {
        // '하', '중', '상'을 직접 비교하여 정렬
        const sortedData = data?.sort((a, b) => {
          if (a.recipe_level === b.recipe_level) {
            return 0;
          }
          if (a.recipe_level === "상") {
            return -1;
          }
          if (b.recipe_level === "상") {
            return 1;
          }
          if (a.recipe_level === "중") {
            return -1;
          }
          return 1;
        });
        setRecipes(sortedData as Recipe[]);
        setFilteredRecipes(sortedData as Recipe[]);
      } else {
        setRecipes(data as Recipe[]);
        setFilteredRecipes(data as Recipe[]);
      }
      setCurrentPage(1);
    }
    setLoading(false);
  };

  // 검색 키워드 필터
  const applyFilter = () => {
    let filteredData = recipes;

    // 필터 옵션 없이 title + ingredients에서만 검색
    filteredData = recipes.filter((recipe) => {
      const titleMatch = recipe.recipe_title.toLowerCase().includes(searchText.toLowerCase());
      const ingredientsMatch = recipe.recipe_ingredients.some((ingredient) =>
        ingredient.ingredient.toLowerCase().includes(searchText.toLowerCase())
      );
      return titleMatch || ingredientsMatch;
    });

    setFilteredRecipes(filteredData);
  };

  // useEffect 분산 처리
  useEffect(() => {
    if (query) {
      fetchRecipes();
    }
  }, [query, sortOption]);

  useEffect(() => {
    applyFilter();
  }, [recipes]);

  // 페이지 네이션
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData: Recipe[] = filteredRecipes.slice(startIndex, endIndex);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="py-[2rem]">
      {filteredRecipes.length > 0 && (
        <div className="mx-auto flex items-center justify-between ssm:mb-[1.5rem] ssm:max-w-[21rem] sm:mb-[1.5rem] sm:max-w-[21rem] md:mb-[1.5rem] md:max-w-[43rem] lg:mb-[1.5rem] lg:max-w-[64rem]">
          <p className="font-semibold ssm:text-body-18 sm:text-body-18 md:text-body-20 lg:text-body-20">
            검색 결과 {filteredRecipes.length}개
          </p>
          <SortOptions sortOption={sortOption} setSortOption={setSortOption} />
        </div>
      )}
      <section>
        {loading ? (
          <LoadingSpinner />
        ) : filteredRecipes.length > 0 ? (
          <div>
            <ul className="gap-w-[1rem] mx-auto grid max-w-[64rem] justify-items-center gap-y-[1.75rem] ssm:max-w-[21rem] ssm:grid-cols-2 sm:max-w-[21rem] sm:grid-cols-2 md:max-w-[43rem] md:grid-cols-4 lg:max-w-[64rem] lg:grid-cols-4">
              {currentData.map((recipe) => (
                <RecipeCard key={recipe.post_id} post={recipe} />
              ))}
            </ul>
            <div className="flex items-center justify-center ssm:mt-[1.25rem] sm:mt-[1.25rem] md:mt-[1.5rem] lg:mt-[1.75rem]">
              <div className="w-full ssm:max-w-[21rem] sm:max-w-[21rem] md:max-w-[22.6rem] lg:max-w-[27.3rem]">
                <Pagination
                  currentPage={currentPage}
                  pageSize={itemsPerPage}
                  totalItems={filteredRecipes.length}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        ) : (
          !loading && (
            <div>
              <div className="flex flex-col items-center justify-center">
                <div className="mx-auto my-8 border-t border-Gray-200"></div>
                <Image src={NoneAlert} width={80} height={80} alt="경고" className="mb-6" />
                <p className="mb-10 w-auto whitespace-nowrap text-center text-body-20 font-semibold">
                  &quot;{searchText}&quot;와 일치하는 레시피가 없습니다.
                </p>
                <ul className="h-38 mx-auto flex list-disc flex-col items-center justify-center rounded-2xl bg-Gray-50 px-8 py-5 ssm:w-[21rem] sm:w-[21rem] md:w-[34.3rem] lg:w-[34.3rem]">
                  <h1 className="mb-4 self-start font-semibold text-Primary-300 ssm:text-body-16 sm:text-body-16 md:text-body-18 lg:text-body-18">
                    검색 Tip!
                  </h1>
                  <li className="ml-4 mt-1 self-start text-body-16 text-Gray-500">레시피명을 다시 확인해 주세요.</li>
                  <li className="ml-4 mt-1 self-start text-body-16 text-Gray-500">구체적인 키워드를 사용해보세요.</li>
                  <li className="ml-4 mt-1 self-start text-body-16 text-Gray-500">
                    키워드를 조합해 레시피를 검색해보세요.
                  </li>
                </ul>
              </div>
              <div className="min-h-[20vh]" />
            </div>
          )
        )}
      </section>
    </div>
  );
};

export default SearchResult;
