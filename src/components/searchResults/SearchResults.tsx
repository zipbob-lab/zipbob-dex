"use client";

import React, { useEffect, useState } from "react";
import browserClient from "@/supabase/client";
import { Recipe } from "@/types/Recipe";
import { useParams } from "next/navigation";
import RecipeCard from "@/components/fridgeList/RecipeCard";

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
        } else if (sortOption === "commnet") {
          request = request.order("comment_count", { ascending: false });
        } else if (sortOption === "level") {
          request = request.order("recipe_level", { ascending: false });
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
            <option value="commnet">후기 많은 순</option>
            <option value="level">난이도 높은 순</option>
            <option value="scraps">스크랩 많은 순</option>
          </select>
        </div>
      </header>

      <section>
        {recipes.length > 0 ? (
          <ul>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.post_id} recipe={recipe} />
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
