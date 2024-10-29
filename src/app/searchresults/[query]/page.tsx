"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import browserClient from "@/supabase/client";
import { Recipe } from "@/types/Recipe";

const SearchResultPage = () => {
  const router = useRouter();
  const { query } = router.query;
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        const { data } = await browserClient.from("TEST2_TABLE").select("*").ilike("recipe_title", `%${query}%`);
        setRecipes(data || []);
      };
      fetchResults();
    }
  }, [query]);

  return (
    <div>
      <header>
        <h1>검색 결과</h1>
        <p>검색어: {query}</p>
      </header>

      <section>
        {recipes.length > 0 ? (
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.post_id}>
                <h2>{recipe.recipe_title}</h2>
                <img src={recipe.recipe_img_done} alt="이미지 없음" />
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

// 디테일 페이지 이동
// 유형 기능 업데이트
