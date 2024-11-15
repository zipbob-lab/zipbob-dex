"use client";

import React, { useState, useEffect } from "react";
import browserClient from "@/supabase/client";
import CategoreAdd from "@/components/fridgeListPage/InputAdd";
import CategoreDelete from "@/components/fridgeListPage/InputDelete";
import { Recipe } from "@/types/Recipe";
import RecipeCard from "@/components/mainPage/RecipeCard";
import SortOptions from "@/components/common/search/SortOptions";
import Pagination from "@/components/common/Pagination";

import Image from "next/image";
import NoneAlert from "@images/noneAlert.svg";

const TagFilter: React.FC = () => {
  // 필터 메인 상태
  const [data, setData] = useState<Recipe[]>([]);
  const [filteredData, setFilteredData] = useState<Recipe[]>([]);
  const [addKeywords, setAddKeywords] = useState<string[]>([]);
  const [deleteKeywords, setDeleteKeywords] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [sortOption, setSortOption] = useState<string>("likes");

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 16;

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      let request = browserClient.from("MY_RECIPE_TABLE").select("*");
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
        console.error("MY_RECIPE_TABLE 에러", error);
      } else {
        setData(data as Recipe[]);
        setFilteredData(data as Recipe[]);
        setCurrentPage(1);
      }
    };
    fetchData();
  }, [sortOption]);

  // 필터링 로직
  const filterData = () => {
    if (addKeywords.length === 0 && deleteKeywords.length === 0) {
      setFilteredData(data);
      return;
    }

    let newFilteredData = data;

    if (addKeywords.length > 0) {
      newFilteredData = newFilteredData.filter((recipe) => {
        return recipe.recipe_ingredients.some((item) =>
          addKeywords.some((keyword) => item.ingredient.includes(keyword))
        );
      });
    }

    if (deleteKeywords.length > 0) {
      newFilteredData = newFilteredData.filter((recipe) => {
        return !recipe.recipe_ingredients.some((item) =>
          deleteKeywords.some((keyword) => item.ingredient.includes(keyword))
        );
      });
    }

    setFilteredData(newFilteredData);
    setCurrentPage(1);
  };

  // 검색 버튼 클릭 시에만 필터링
  const handleSearch = () => {
    filterData();
    setShowResults(true);
  };

  // 페이지 네이션
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  // 페이지 네이션
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="mx-auto max-w-[1024px] p-4 py-[60px]">
        <p className="text-[24px] font-semibold">냉장고를 탐험해 봅시다!</p>
        <p className="mt-4 text-[18px] font-normal">재료들을 입력하면 맞춤 레시피를 추천해 드려요.</p>
        <div className="mt-12 flex">
          <CategoreAdd onAddCategory={setAddKeywords} />
          <CategoreDelete onDeleteCategory={setDeleteKeywords} />
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSearch}
            className="mt-16 flex h-[48px] w-[440px] items-center justify-center space-x-1 rounded-xl bg-[#ff9143]"
          >
            <p className="text-[20px] font-normal text-white">검색</p>
          </button>
        </div>
        {showResults && (
          <div className="mt-6">
            <div className="mx-auto flex max-w-[1024px] items-center justify-between py-[100px]">
              <p className="text-[20px] font-semibold">검색 결과 {filteredData.length}개</p>
              <SortOptions sortOption={sortOption} setSortOption={setSortOption} />
            </div>
            <ul
              className={`${currentData.length > 0 ? "grid-cols-4" : "grid-cols-1"} mx-auto grid max-w-[1024px] items-center gap-x-[16px] gap-y-[28px]`}
            >
              {currentData.length > 0 ? (
                currentData.map((recipe) => <RecipeCard key={recipe.post_id} post={recipe} />)
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="flex min-h-[40vh] flex-col items-center justify-center">
                    <Image src={NoneAlert} width={80} height={80} alt="경고" className="mb-6" />
                    <p className="mb-10 w-auto whitespace-nowrap text-center text-[20px] font-semibold">
                      태그와 일치하는 레시피가 없습니다.
                    </p>
                    <ul className="flex h-[152px] w-[548px] list-disc flex-col items-center justify-center rounded-2xl bg-stone-100 p-4">
                      <h1 className="mb-4 ml-8 self-start text-[18px] font-semibold text-[#ff9143]">검색 Tip!</h1>
                      <li className="mb-1 ml-8 self-start text-[16px] text-stone-500">
                        입력한 재료를 다시 확인 해주세요!
                      </li>
                      <li className="mb-1 ml-8 self-start text-[16px] text-stone-500">
                        넣고 싶은 재료와 빼고 싶은 재료가 중복될 경우 결과가 나오지 않습니다!
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </ul>
            <div className="mb-8 mt-8">
              {filteredData.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalItems={filteredData.length}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagFilter;
