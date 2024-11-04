"use client";

import React, { useState, useEffect } from "react";
import browserClient from "@/supabase/client";
import CategoreAdd from "@/components/fridgeList/InputAdd";
import CategoreDelete from "@/components/fridgeList/InputDelete";
import { Recipe } from "@/types/Recipe";
import RecipeCard from "@/components/fridgeList/RecipeCard";

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
        console.log(Data);
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
          <ul>
            <h3>검색 결과</h3>
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

// todos
// 1. 테이블 변경시 주석부분 구현
// 2. [{}] 형식 불러오기
// 3. 타이머 기능 수정 (수정)
// 4. 검색바 모달로 구현 css 작업시
// 5. 카드 컴포넌트화 (완료)
// 6. 코멘드 supabase데이터 카운트 설정후 로직 반영
// 7. 빌드 오류 수정
