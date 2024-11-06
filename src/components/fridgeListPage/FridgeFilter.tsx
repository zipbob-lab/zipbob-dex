"use client";

import React, { useState, useEffect } from "react";
import browserClient from "@/supabase/client";
import CategoreAdd from "@/components/fridgeListPage/InputAdd";
import CategoreDelete from "@/components/fridgeListPage/InputDelete";
import { Recipe } from "@/types/Recipe";
import RecipeCard from "@/components/common/search/ListCard";
import SortOptions from "@/components/common/search/SortOptions";

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

        data.forEach((item) => {
          if (item.recipe_ingredients && item.recipe_ingredients.length > 0) {
            console.log(item.recipe_ingredients[0].ingredient);
          } else {
            console.log("없음");
          }
        });

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
    console.log(filteredData);
    setShowResults(true);
  };

  return (
    <div>
      <CategoreAdd onAddCategory={handleAddCategory} />
      <CategoreDelete onDeleteCategory={handleDeleteCategory} />
      <button onClick={handleResults} className="border">
        검색
      </button>
      {showResults && (
        <div>
          <ul>
            <h3>검색 결과</h3>
            <p>검색결과 {filteredData.length} 개</p>
            <SortOptions sortOption={sortOption} setSortOption={setSortOption} />
            {filteredData.length > 0 ? (
              filteredData.map((recipe) => <RecipeCard key={recipe.post_id} recipe={recipe} />)
            ) : (
              <p>결과가 없습니다.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TagFilter;
