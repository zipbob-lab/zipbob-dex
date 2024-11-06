"use client";

import React, { useState, useEffect } from "react";
import browserClient from "@/supabase/client";
import CategoreAdd from "@/components/fridgeListPage/InputAdd";
import CategoreDelete from "@/components/fridgeListPage/InputDelete";
import { Recipe } from "@/types/Recipe";
import RecipeCard from "@/components/common/search/ListCard";
import SortOptions from "@/components/common/search/SortOptions";

import Image from "next/image";
import SearchPan from "@images/searchPan.svg";

const TagFilter: React.FC = () => {
  const [data, setData] = useState<Recipe[]>([]);
  const [filteredData, setFilteredData] = useState<Recipe[]>([]);
  const [addKeywords, setAddKeywords] = useState<string[]>([]);
  const [deleteKeywords, setDeleteKeywords] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [sortOption, setSortOption] = useState<string>("default");

  useEffect(() => {
    const fetchData = async () => {
      let request = browserClient.from("MY_RECIPE_TABLE").select("*");
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
        console.error("MY_RECIPE_TABLE 에러", error);
      } else {
        console.log("fetch data result: ", data);
        setData(data as Recipe[]);
        setFilteredData(data as Recipe[]);
      }
    };
    fetchData();
  }, [sortOption]);

  useEffect(() => {
    const filterData = () => {
      if (addKeywords.length === 0 && deleteKeywords.length === 0) {
        setFilteredData(data);
        return;
      }

      let newFilteredData = data;

      if (addKeywords.length > 0) {
        newFilteredData = newFilteredData.filter((recipe) => {
          if (Array.isArray(recipe.recipe_ingredients)) {
            return recipe.recipe_ingredients.some((item) => {
              if (typeof item === "object" && item !== null && "ingredient" in item) {
                return addKeywords.some((keyword) => (item as { ingredient: string }).ingredient.includes(keyword));
              }
              return false;
            });
          } else if (typeof recipe.recipe_ingredients === "string") {
            return addKeywords.some((keyword) => recipe.recipe_ingredients.includes(keyword));
          }
          return false;
        });
      }

      if (deleteKeywords.length > 0) {
        newFilteredData = newFilteredData.filter((recipe) => {
          if (Array.isArray(recipe.recipe_ingredients)) {
            return !recipe.recipe_ingredients.some((item) => {
              if (typeof item === "object" && item !== null && "ingredient" in item) {
                return deleteKeywords.some((keyword) => (item as { ingredient: string }).ingredient.includes(keyword));
              }
              return false;
            });
          } else if (typeof recipe.recipe_ingredients === "string") {
            return !deleteKeywords.some((keyword) => recipe.recipe_ingredients.includes(keyword));
          }
          return true;
        });
      }

      setFilteredData(newFilteredData);
    };

    filterData();
  }, [addKeywords, deleteKeywords, data]);

  const handleAddCategory = (keywords: string[]) => {
    setAddKeywords(keywords);
  };

  const handleDeleteCategory = (keywords: string[]) => {
    setDeleteKeywords(keywords);
  };

  const handleResults = () => {
    setShowResults(true);
  };

  return (
    <div>
      <div className="mx-auto max-w-[1024px] p-4 py-[60px]">
        <p className="text-[24px] font-semibold">냉장고를 탐험해 봅시다!</p>
        <p className="mt-4 text-[18px]">재료들을 입력하면 맞춤 레시피를 추천해 드려요.</p>
        <div className="mt-12 flex">
          <CategoreAdd onAddCategory={handleAddCategory} />
          <CategoreDelete onDeleteCategory={handleDeleteCategory} />
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleResults}
            className="mt-16 flex h-[48px] w-[440px] items-center justify-center space-x-1 rounded-xl bg-[#ff9143]"
          >
            <Image src={SearchPan} width={20} height={20} alt="검색 팬" />
            <p className="text-[20px] text-white">검색</p>
          </button>
        </div>
        {showResults && (
          <div className="mt-6">
            <ul>
              <div className="mx-auto flex max-w-[1024px] items-center justify-between py-[100px]">
                <p className="text-[20px] font-semibold">검색 결과 {filteredData.length}개</p>
                <SortOptions sortOption={sortOption} setSortOption={setSortOption} />
              </div>
              <ul className="mx-auto grid max-w-[1024px] grid-cols-4 gap-[22px]">
                {filteredData.length > 0 ? (
                  filteredData.map((recipe) => <RecipeCard key={recipe.post_id} recipe={recipe} />)
                ) : (
                  <p>결과가 없습니다.</p>
                )}
              </ul>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagFilter;
