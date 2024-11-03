"use client";

import React, { useState, useEffect } from "react";
import browserClient from "@/supabase/client";
import CategoreAdd from "@/components/fridgeList/InputAdd";
import CategoreDelete from "@/components/fridgeList/InputDelete";
import { Recipe } from "@/types/Recipe";

const TagFilter: React.FC = () => {
  const [data, setData] = useState<Recipe[]>([]);
  const [filteredData, setFilteredData] = useState<Recipe[]>([]);
  const [addKeywords, setAddKeywords] = useState<string[]>([]);
  const [deleteKeywords, setDeleteKeywords] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: testData, error } = await browserClient.from("TEST2_TABLE").select("*");
      if (error) {
        console.error("TEST2_TABLE 에러", error);
      } else {
        setData(testData as Recipe[]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterData = () => {
      if (addKeywords.length === 0 && deleteKeywords.length === 0) {
        setFilteredData([]);
        return;
      }

      let newFilteredData = data;

      if (addKeywords.length > 0) {
        newFilteredData = newFilteredData.filter((recipe) =>
          addKeywords.some((keyword) => recipe.recipe_ingredients.includes(keyword))
        );
      }

      if (deleteKeywords.length > 0) {
        newFilteredData = newFilteredData.filter(
          (recipe) => !deleteKeywords.some((keyword) => recipe.recipe_ingredients.includes(keyword))
        );
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
      <CategoreAdd onAddCategory={handleAddCategory} />
      <CategoreDelete onDeleteCategory={handleDeleteCategory} />
      <button onClick={handleResults} className="border">
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

// todos
// 1. 테이블 변경시 테이블 위치와 컬럼 수정하기 (필요시 이중 처리)
// 2. 유형 기능 업데이트
// 3. 링크 기능 업데이트
