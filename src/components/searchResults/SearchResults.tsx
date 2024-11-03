"use client";

import React, { useEffect, useState } from "react";
import browserClient from "@/supabase/client";
import { Recipe } from "@/types/Recipe";
import { useParams } from "next/navigation";

const SearchResultPage = () => {
  const { query } = useParams();
  const searchText = decodeURI(query as string);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [sortOption, setSortOption] = useState<string>("default");

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        let request = browserClient.from("TEST2_TABLE").select("*").like("recipe_title", `%${searchText}%`);
        if (sortOption === "likes") {
          request = request.order("like_count", { ascending: false });
        } else if (sortOption === "scraps") {
          request = request.order("scrap_count", { ascending: false });
        }

        const { data, error } = await request;

        if (error) {
          console.error("에러", error);
        } else {
          setRecipes(data as Recipe[]);
        }
      };
      fetchResults();
    }
  }, [query, sortOption]);

  return (
    <div>
      <header>
        <h1>검색 결과</h1>
        <p>검색 결과 {recipes.length}개</p>

        <div>
          <select id="sort-option" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="default">전체</option>
            <option value="likes">좋아요 높은 순</option>
            <option value="scraps">스크랩 많은 순</option>
          </select>
        </div>
      </header>

      <section>
        {recipes.length > 0 ? (
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.post_id}>
                {/* 디테일 페이지 pr시 링크 기능 넣기 */}
                <div>
                  <h2>{recipe.recipe_title}</h2>
                  <img src={recipe.recipe_img_done} alt="이미지 없음" />
                  <p>난이도: {recipe.recipe_level}</p>
                  <p>좋아요: {recipe.like_count}</p>
                  <p>스크랩: {recipe.scrap_count}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </section>
    </div>
  );
};

export default SearchResultPage;
// todos
// 1. 테이블 변경시 테이블 위치와 컬럼 수정하기 (필요시 이중 처리)
// 2. 유형 기능 업데이트
// 3. 링크 기능 업데이트


// 2. css 작업시 냉장고 페이지와 css 동일하게 하기 (카드 컴포넌트화 고려해볼것)
// 번외. 타이머 기능 만들기
