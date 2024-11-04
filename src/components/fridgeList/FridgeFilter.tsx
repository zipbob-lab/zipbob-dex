"use client";

import React, { useState, useEffect } from "react";
import browserClient from "@/supabase/client";
import CategoreAdd from "@/components/fridgeList/InputAdd";
import CategoreDelete from "@/components/fridgeList/InputDelete";
import { Recipe } from "@/types/Recipe";
import RecipeCard from "@/components/fridgeList/ListCard";

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
        console.log("fetch date result : ", Data);

        Data.forEach((item) => {
          if (item.recipe_ingredients && item.recipe_ingredients.length > 0) {
            console.log(item.recipe_ingredients[0].ingredient);
          } else {
            console.log("없음");
          }
        });
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
      console.log("필터링 데이터", newFilteredData);
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
// [{}] 형식 불러오기 (완료)
// 타이머 기능 수정 (완료)
// 카드 컴포넌트화 (완료)
// 코멘드 supabase 데이터 카운트 설정후 로직 반영 (진행중)
// 7. 빌드 오류 수정
// 1. 테이블 변경시 주석부분 구현

// 검색바 모달로 구현 css 작업시