"use client";

import React, { useEffect, useState } from "react";
import browserClient from "@/supabase/client";
import { Recipe } from "@/types/Recipe";

interface FilteredRecipeListProps {
  addKeywords: string[];
  deleteKeywords: string[];
  isSearching: boolean;
}

const FilteredRecipeList: React.FC<FilteredRecipeListProps> = ({ addKeywords, isSearching }) => {
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  //   deleteKeywords,
  useEffect(() => {
    const fetchFilteredRecipes = async () => {
      if (isSearching) {
        let query = browserClient.from("TEST2_TABLE").select("*");

        if (addKeywords.length > 0) {
          query = query.contains("recipe_ingredients", JSON.stringify(addKeywords));
        }

        // if (deleteKeywords.length > 0) {
        //   deleteKeywords.forEach((keyword) => {
        //     query = query.not("recipe_ingredients", "cs", [keyword]);
        //   });
        // }

        const { data, error } = await query;

        if (error) {
          console.error("에러", error);
          return;
        }

        setFilteredRecipes(data as Recipe[]);
      }
    };

    fetchFilteredRecipes();
  }, [addKeywords, isSearching]);
  //   deleteKeywords,
  return (
    <div>
      <h2>검색 결과</h2>
      {filteredRecipes.length > 0 ? (
        filteredRecipes.map((recipe) => (
          <li key={recipe.post_id}>
            <div>
              <div>{recipe.recipe_title}</div>
              <img src={recipe.recipe_img_done} alt="없음" />
              <p>난이도: {recipe.recipe_level}</p>
              <p>좋아요: {recipe.like_count}</p>
              <p>스크랩: {recipe.scrap_count}</p>
            </div>
          </li>
        ))
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default FilteredRecipeList;
