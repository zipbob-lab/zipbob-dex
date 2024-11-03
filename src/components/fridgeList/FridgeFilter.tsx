"use client";

import React, { useState, useEffect } from "react";
import browserClient from "@/supabase/client";
import CategoreAdd from "@/components/fridgeList/InputAdd";
import CategoreDelete from "@/components/fridgeList/InputDelete";
import { Recipe } from "@/types/Recipe";
import Link from "next/link";

const TagFilter: React.FC = () => {
  const [data, setData] = useState<Recipe[]>([]);
  const [filteredData, setFilteredData] = useState<Recipe[]>([]);
  const [addKeywords, setAddKeywords] = useState<string[]>([]);
  const [deleteKeywords, setDeleteKeywords] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: Data, error } = await browserClient.from("TEST2_TABLE").select("*");

      if (error) {
        console.error("TEST2_TABLE 에러", error);
      } else {
        setData(Data as Recipe[]);
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
            filteredData.map((recipe) => (
              <li key={recipe.post_id}>
                {/* 테이블 변경시 링크 수정 */}
                <Link key={recipe.post_id} href={`/myrecipedetail/${recipe.post_id}`}>
                  <h2>{recipe.recipe_title}</h2>
                  <img src={recipe.recipe_img_done} alt="이미지 없음" />
                  <p>난이도: {recipe.recipe_level}</p>
                  <p>좋아요: {recipe.like_count}</p>
                  <p>스크랩: {recipe.scrap_count}</p>
                </Link>
              </li>
            ))
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
// 1. json {} 형태 불러오기
// 2. 테이블 변경시 주석부분 구현
