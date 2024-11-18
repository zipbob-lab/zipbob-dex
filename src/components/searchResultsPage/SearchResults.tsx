"use client";

import React, { useEffect, useState } from "react";
import { Recipe } from "@/types/Search";
import { useParams } from "next/navigation";
import browserClient from "@/supabase/client";
import RecipeCard from "@/components/mainPage/RecipeCard";
import FilterOptions from "@/components/searchResultsPage/SearchOptions";
import SortOptions from "@/components/common/search/SortOptions";
import Pagination from "@/components/common/Pagination";
import LoadingSpinner from "@/components/common/LoadingSpinner";

import Image from "next/image";
import NoneAlert from "@images/noneAlert.svg";

const SearchResult = () => {
  const { query } = useParams();
  const searchText = decodeURI(query as string);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [sortOption, setSortOption] = useState<string>("likes");
  const [filterOption, setFilterOption] = useState<string>("title+ingredients");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const itemsPerPage = 16;

  const fetchRecipes = async () => {
    setLoading(true);

    let request = browserClient.from("MY_RECIPE_TABLE").select("*");

    if (sortOption === "likes") {
      request = request.order("like_count", { ascending: false });
    } else if (sortOption === "comment") {
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
      setFilteredRecipes(data as Recipe[]);
      setCurrentPage(1);
    }
    setLoading(false);
  };

  const applyFilter = () => {
    let filteredData = recipes;

    if (filterOption === "title") {
      filteredData = recipes.filter((recipe) => recipe.recipe_title.toLowerCase().includes(searchText.toLowerCase()));
    } else if (filterOption === "ingredients") {
      filteredData = recipes.filter((recipe) =>
        recipe.recipe_ingredients.some((ingredient) =>
          ingredient.ingredient.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    } else if (filterOption === "title+ingredients") {
      filteredData = recipes.filter((recipe) => {
        const titleMatch = recipe.recipe_title.toLowerCase().includes(searchText.toLowerCase());
        const ingredientsMatch = recipe.recipe_ingredients.some((ingredient) =>
          ingredient.ingredient.toLowerCase().includes(searchText.toLowerCase())
        );
        return titleMatch || ingredientsMatch;
      });
    }

    setFilteredRecipes(filteredData);
  };

  useEffect(() => {
    if (query) {
      fetchRecipes();
    }
  }, [query, sortOption]);

  useEffect(() => {
    applyFilter();
  }, [recipes, filterOption]);

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
    <div>
      {filteredRecipes.length > 0 && (
        <div className="mx-auto flex w-full max-w-[1024px] items-center justify-between py-10 sm:max-w-[336px] md:max-w-[688px] lg:max-w-[1024px]">
          <p className="text-body-20 font-semibold">
            &quot;{searchText}&quot; 검색결과 {filteredRecipes.length}개
          </p>
          <div className="flex items-center space-x-4">
            <FilterOptions filterOption={filterOption} setFilterOption={setFilterOption} />
            <SortOptions sortOption={sortOption} setSortOption={setSortOption} />
          </div>
        </div>
      )}
      <section>
        {loading ? (
          <LoadingSpinner />
        ) : filteredRecipes.length > 0 ? (
          <div>
            <ul className="mx-auto grid w-full max-w-[1024px] grid-cols-4 gap-4">
              {currentData.map((recipe) => (
                <RecipeCard key={recipe.post_id} post={recipe} />
              ))}
            </ul>
            <div className="mb-8 mt-8">
              <Pagination
                currentPage={currentPage}
                pageSize={itemsPerPage}
                totalItems={filteredRecipes.length}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        ) : (
          !loading && (
            <div>
              <div className="flex min-h-[50vh] flex-col items-center justify-center">
                <Image src={NoneAlert} width={80} height={80} alt="경고" className="mb-6" />
                <p className="mb-10 w-auto whitespace-nowrap text-center text-body-20 font-semibold">
                  &quot;{searchText}&quot; 키워드와 일치하는 레시피가 없습니다.
                </p>
                <ul className="flex h-[9.5rem] w-[34.25rem] list-disc flex-col items-center justify-center rounded-2xl bg-Gray-50 p-[1rem]">
                  <h1 className="mb-4 ml-8 self-start text-body-18 font-semibold text-Primary-300">검색 Tip!</h1>
                  <li className="ml-8 mt-[0.25rem] self-start text-body-16 text-Gray-500">
                    레시피명을 다시 확인해 주세요!
                  </li>
                  <li className="ml-8 mt-[0.25rem] self-start text-body-16 text-Gray-500">
                    구체적인 키워드를 사용해보세요!
                  </li>
                  <li className="ml-8 mt-[0.25rem] self-start text-body-16 text-Gray-500">
                    키워드를 조합해 레시피를 검색해보세요!
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
