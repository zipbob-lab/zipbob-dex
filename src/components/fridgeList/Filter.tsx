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
          query = query.contains("recipe_title", addKeywords);
        }

        if (deleteKeywords.length > 0) {
          deleteKeywords.forEach((keyword) => {
            query = query.not("recipe_title", "cs", [keyword]);
          });
        }
        const { data, error } = await query;

        if (error) {
          console.error("Error fetching recipes:", error);
          return;
        }

        setFilteredRecipes(data || []);
      }
    };

    fetchFilteredRecipes();
  }, [addKeywords, deleteKeywords, isSearching]);

  return (
    <div>
      <h2>검색 결과</h2>
      {filteredRecipes.length > 0 ? (
        filteredRecipes.map((recipe) => <div key={recipe.post_id}>{recipe.recipe_title}</div>)
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default FilteredRecipeList;
