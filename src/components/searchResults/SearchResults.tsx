"use client";

import React, { useEffect, useState } from "react";
import browserClient from "@/supabase/client";
import { Recipe } from "@/types/Recipe";
import { useParams } from "next/navigation";
import Link from "next/link";

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
            {/* 테이블 변경시 후기 많은 순 넣어서 수정 */}
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
                {/* 테이블 변경시 링크 수정 */}
                <Link key={recipe.post_id} href={`/myrecipedetail/${recipe.post_id}`}>
                  <h2>{recipe.recipe_title}</h2>
                  <img src={recipe.recipe_img_done} alt="이미지 없음" />
                  <p>난이도: {recipe.recipe_level}</p>
                  <p>좋아요: {recipe.like_count}</p>
                  <p>스크랩: {recipe.scrap_count}</p>
                </Link>
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
// 1. json {} 형태 불러오기
// 2. 테이블 변경시 주석부분 구현
// 3. 유형 기능 업데이트


// 번외. 카드 컴포넌트화 하기
// 번외. 타이머 기능 만들기
