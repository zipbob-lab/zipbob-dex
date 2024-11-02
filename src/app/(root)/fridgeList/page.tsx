"use client";

import React, { useState, useEffect } from "react";
import browserClient from "@/supabase/client";
import CategoreAdd from "@/components/fridgeList/InputAdd";
import CategoreDelete from "@/components/fridgeList/InputDelete";
import { Recipe } from "@/types/Recipe";

const TagFilter = () => {
  const [data, setData] = useState<Recipe[]>([]);
  const [filteredData, setFilteredData] = useState<Recipe[]>([]);
  const [addKeywords, setAddKeywords] = useState<string[]>([]);
  const [deleteKeywords, setDeleteKeywords] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await browserClient.from("TEST2_TABLE").select("*");
      if (error) {
        console.error("에러", error);
      } else {
        setData(data as Recipe[]);
        setFilteredData(data as Recipe[]);
      }
    };

    fetchData();
  }, []);

  const handleAddCategory = (keywords: string[]) => {
    setAddKeywords(keywords);
    const newFilteredData = data.filter((recipe) =>
      keywords.some((keyword) => recipe.recipe_ingredients.includes(keyword))
    );
    setFilteredData(newFilteredData);
  };

  const handleDeleteCategory = (keywords: string[]) => {
    setDeleteKeywords(keywords);
    const newFilteredData = data.filter(
      (recipe) => !keywords.some((keyword) => recipe.recipe_ingredients.includes(keyword))
    );
    setFilteredData(newFilteredData);
  };

  const handleShowResults = () => {
    setShowResults(true);
  };

  return (
    <div>
      <CategoreAdd onAddCategory={handleAddCategory} />
      <CategoreDelete onDeleteCategory={handleDeleteCategory} />
      <button onClick={handleShowResults} className="border">
        검색
      </button>
      {showResults && (
        <div>
          <h3>검색 결과</h3>
          {filteredData.length > 0 ? (
            filteredData.map((recipe) => <div key={recipe.post_id}>{recipe.recipe_title}</div>)
          ) : (
            <p>결과가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TagFilter;
