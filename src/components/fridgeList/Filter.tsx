"use client";

import React, { useEffect, useState } from "react";
import browserClient from "@/supabase/client";
import { Recipe } from "@/types/Recipe";

interface FilteredRecipeListProps {
  addKeywords: string[];
  deleteKeywords: string[];
  isSearching: boolean;
}

const FilteredRecipeList: React.FC<FilteredRecipeListProps> = ({ addKeywords, deleteKeywords, isSearching }) => {
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchFilteredRecipes = async () => {
      if (isSearching) {
        let query = browserClient.from("TEST2_TABLE").select("*");

        if (addKeywords.length > 0) {
          query = query.contains("recipe_ingredients", JSON.stringify(addKeywords));
        }

        if (deleteKeywords.length > 0) {
          deleteKeywords.forEach((keyword) => {
            query = query.not("recipe_ingredients", "cs", [keyword]);
          });
        }

        const { data, error } = await query;

        if (error) {
          console.error("에러", error);
          return;
        }

        setFilteredRecipes(data as Recipe[]);
      }
    };

    fetchFilteredRecipes();
  }, [addKeywords, deleteKeywords, isSearching]);

  return (
    <div>
      <h2>검색 결과</h2>
      {filteredRecipes.length > 0 ? (
        filteredRecipes.map((recipe) => (
          <div key={recipe.post_id}>
            <div>{recipe.recipe_title}</div>
          </div>
        ))
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default FilteredRecipeList;
