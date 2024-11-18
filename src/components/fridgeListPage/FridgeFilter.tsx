"use client";

import React, { useState, useEffect } from "react";
import browserClient from "@/supabase/client";
import CategoreAdd from "@/components/fridgeListPage/InputAdd";
import CategoreDelete from "@/components/fridgeListPage/InputDelete";
import { Recipe } from "@/types/Search";
import RecipeCard from "@/components/common/search/ListCard";
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

  // 페이지네이션
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="mx-auto p-4 py-[3.75rem]">
        <div className="mx-auto w-full ssm:max-w-[21rem] sm:max-w-[21rem] md:max-w-[50.1rem] lg:max-w-[64rem]">
          <div className="gap-[0.5rem]">
            <p className="text-heading-20 md:text-heading-24 lg:text-heading-24">냉장고를 탐험해 봅시다!</p>
            <p className="mt-[1rem] text-body-14 md:text-body-18 lg:text-body-18">
              재료들을 입력하면 맞춤 레시피를 추천해 드려요.
            </p>
          </div>
          <div className="mt-[3.25rem] flex flex-col gap-y-[1.5rem] md:flex-row md:justify-between">
            <CategoreAdd onAddCategory={setAddKeywords} />
            <CategoreDelete onDeleteCategory={setDeleteKeywords} />
          </div>
          <div className="mt-[2rem] flex justify-center">
            <button
              onClick={handleSearch}
              className="mt-[4rem] flex h-[3rem] w-full max-w-[27.5rem] items-center justify-center space-x-[0.25rem] rounded-xl bg-Primary-300"
            >
              <p className="text-body-20 text-white">검색</p>
            </button>
          </div>
        </div>
        {showResults && (
          <div className="mt-6">
            {filteredData.length > 0 ? (
              <>
                <div className="mx-auto flex items-center justify-between py-[4rem] ssm:max-w-[21rem] sm:max-w-[21rem] md:max-w-[50.1rem] lg:max-w-[64rem]">
                  <p className="text-body-20 font-semibold">검색 결과 {filteredData.length}개</p>
                  <SortOptions sortOption={sortOption} setSortOption={setSortOption} />
                </div>

                <ul className="mx-auto grid max-w-[64rem] justify-items-center gap-y-[1.75rem] ssm:max-w-[21rem] ssm:grid-cols-2 sm:max-w-[21rem] sm:grid-cols-2 md:max-w-[50.1rem] md:grid-cols-4 lg:max-w-[64rem] lg:grid-cols-4">
                  {currentData.map((recipe) => (
                    <RecipeCard key={recipe.post_id} post={recipe} />
                  ))}
                </ul>
                <div className="mt-8 flex items-center justify-center">
                  <div className="w-full ssm:max-w-[21rem] sm:max-w-[21rem] md:max-w-[22.6rem] lg:max-w-[27.3rem]">
                    <Pagination
                      currentPage={currentPage}
                      pageSize={pageSize}
                      totalItems={filteredData.length}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full">
                <div className="mx-auto my-[2rem] border-t border-Gray-200 ssm:max-w-[21rem] sm:max-w-[21rem] md:max-w-[50.1rem] lg:max-w-[64rem]"></div>
                <div className="flex min-h-[40vh] flex-col items-center justify-center">
                  <Image src={NoneAlert} width={80} height={80} alt="경고" className="mb-6" />
                  <p className="mb-10 w-auto whitespace-nowrap text-center text-body-20 font-semibold">
                    태그와 일치하는 레시피가 없습니다.
                  </p>
                  <ul className="flex h-[9.5rem] list-disc flex-col items-center justify-center rounded-2xl bg-stone-100 p-[1rem] ssm:max-w-[21rem] sm:max-w-[21rem] md:max-w-[50.1rem] lg:max-w-[64rem]">
                    <h1 className="mb-4 ml-8 self-start font-semibold text-Primary-300 ssm:text-body-16 sm:text-body-16 md:text-body-18 lg:text-body-18">
                      검색 Tip!
                    </h1>
                    <li className="mb-1 ml-8 self-start text-body-16 text-stone-500">
                      입력한 재료를 다시 확인 해주세요.
                    </li>
                    <li className="mb-1 ml-8 self-start text-body-16 text-stone-500">
                      넣고 싶은 재료와 빼고 싶은 재료가 중복되진 않았는지 확인해 주세요.
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagFilter;
