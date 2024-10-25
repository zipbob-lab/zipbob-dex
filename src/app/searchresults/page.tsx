"use client";

import React, { useState } from "react";
import SearchBar from "@/components/common/searchbar";
import { fetchRecipeData } from "@/app/api/fetchRecipeData";

const SearchResultsPage = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError("");
    setRecipes([]);

    try {
      const data = await fetchRecipeData(query);
      setRecipes(data.COOKRCP01.row);
    } catch (err) {
      setError("데이터를 가져오는데 실패했습니다.");
    }

    setLoading(false);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <div>
        {recipes.length > 0 ? (
          <ul>
            {recipes.map((recipe, index) => (
              <li key={index}>
                <h3>{recipe.RCP_NM}</h3>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
