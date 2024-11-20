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
  // 메인 상태 관리
  const [data, setData] = useState<Recipe[]>([]);
  const [filteredData, setFilteredData] = useState<Recipe[]>([]);
  const [addKeywords, setAddKeywords] = useState<string[]>([]);
  const [deleteKeywords, setDeleteKeywords] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [sortOption, setSortOption] = useState<string>("likes");

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);

  // 1024 경계 반응형
  useEffect(() => {
    const updatePageSize = () => {
      if (window.innerWidth <= 1024) {
        setPageSize(8);
      } else {
        setPageSize(16);
      }
    };
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => {
      window.removeEventListener("resize", updatePageSize);
    };
  }, []);

  // 데이터 가져오기
  const fetchData = async () => {
    let request = browserClient.from("MY_RECIPE_TABLE").select("*");

    // 정렬 옵션 처리
    if (sortOption === "likes") {
      request = request.order("like_count", { ascending: false });
    } else if (sortOption === "commnet") {
      request = request.order("comment_count", { ascending: false });
    } else if (sortOption === "scraps") {
      request = request.order("scrap_count", { ascending: false });
    }

    // 데이터 가져오기
    const { data, error } = await request;

    if (error) {
      console.error("MY_RECIPE_TABLE 에러", error);
    } else {
      if (sortOption === "level") {
        // '하', '중', '상'을 직접 비교하여 정렬
        const sortedData = data?.sort((a, b) => {
          if (a.recipe_level === b.recipe_level) {
            return 0;
          }
          if (a.recipe_level === "상") {
            return -1;
          }
          if (b.recipe_level === "상") {
            return 1;
          }
          if (a.recipe_level === "중") {
            return -1;
          }
          return 1;
        });

        setData(sortedData as Recipe[]);
        setFilteredData(sortedData as Recipe[]);
      } else {
        setData(data as Recipe[]);
        setFilteredData(data as Recipe[]);
      }
      setCurrentPage(1);
    }
  };

  // 인풋창을 키워드를 통한 결과 필터링
  const applyFilter = () => {
    let newFilteredData = data;

    if (addKeywords.length > 0) {
      newFilteredData = newFilteredData.filter((recipe) =>
        recipe.recipe_ingredients.some((item) => addKeywords.some((keyword) => item.ingredient.includes(keyword)))
      );
    }

    if (deleteKeywords.length > 0) {
      newFilteredData = newFilteredData.filter(
        (recipe) =>
          !recipe.recipe_ingredients.some((item) => deleteKeywords.some((keyword) => item.ingredient.includes(keyword)))
      );
    }

    setFilteredData(newFilteredData);
    setCurrentPage(1);
  };

  // useEffect 분산 처리
  useEffect(() => {
    fetchData();
  }, [sortOption]);

  useEffect(() => {
    applyFilter();
  }, [addKeywords, deleteKeywords, data]);

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const handleSearch = () => {
    applyFilter();
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
      <div className="mx-auto">
        <div className="mx-auto w-full ssm:max-w-[21rem] sm:max-w-[21rem] md:max-w-[50.1rem] lg:max-w-[64rem]">
          <div className="gap-[0.5rem]">
            <p className="mt-[2rem] text-heading-20 md:text-heading-24 lg:text-heading-24">냉장고를 탐험해 봅시다!</p>
            <p className="mt-[1rem] text-body-14 md:text-body-18 lg:text-body-18">
              재료들을 입력하면 맞춤 레시피를 추천해 드려요.
            </p>
          </div>
          <div className="mt-[3.25rem] flex flex-col gap-y-[1.5rem] md:flex-row md:justify-between">
            <CategoreAdd onAddCategory={setAddKeywords} />
            <CategoreDelete onDeleteCategory={setDeleteKeywords} />
          </div>
          <div className="mb-[5rem] mt-[5rem] flex justify-center">
            <button
              onClick={handleSearch}
              className="flex h-[3rem] w-full items-center justify-center space-x-[0.25rem] rounded-xl bg-Primary-300 ssm:max-w-[21.4rem] sm:max-w-[21.4rem] md:max-w-[27.5rem] lg:md:max-w-[27.5rem]"
            >
              <p className="text-body-20 text-white">검색</p>
            </button>
          </div>
        </div>
        {showResults && (
          <div className="py-[2rem]">
            {filteredData.length > 0 ? (
              <>
                <div className="mx-auto flex items-center justify-between ssm:mb-[1.5rem] ssm:max-w-[21rem] sm:mb-[1.5rem] sm:max-w-[21rem] md:mb-[1.5rem] md:max-w-[43rem] lg:mb-[1.5rem] lg:max-w-[64rem]">
                  <p className="font-semibold ssm:text-body-20 sm:text-body-20 md:text-body-20 lg:text-body-20">
                    검색 결과 {filteredData.length}개
                  </p>
                  <SortOptions sortOption={sortOption} setSortOption={handleSortChange} />
                </div>
                <ul className="gap-w-[1rem] mx-auto grid max-w-[64rem] justify-items-center gap-y-[1.75rem] ssm:max-w-[21rem] ssm:grid-cols-2 md:max-w-[43rem] md:grid-cols-4 lg:max-w-[64rem] lg:grid-cols-4">
                  {currentData.map((recipe) => (
                    <RecipeCard key={recipe.post_id} post={recipe} />
                  ))}
                </ul>
                <div className="flex items-center justify-center ssm:mt-[1.25rem] md:mt-[1.5rem] lg:mt-[1.75rem]">
                  <div className="w-full ssm:max-w-[21rem] md:max-w-[22.6rem] lg:max-w-[27.3rem]">
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
                  <ul className="h-38 mx-auto flex list-disc flex-col items-center justify-center rounded-2xl bg-Gray-50 px-8 py-5 ssm:w-[21rem] sm:w-[21rem] md:w-[34.3rem] lg:w-[34.3rem]">
                    <h1 className="mb-4 self-start font-semibold text-Primary-300 ssm:text-body-16 md:text-body-18 lg:text-body-18">
                      검색 Tip!
                    </h1>
                    <li className="ml-4 mt-1 self-start text-body-16 text-Gray-500">
                      입력한 재료를 다시 확인해서 검색해 주세요.
                    </li>
                    <li className="ml-4 mt-1 self-start text-body-16 text-Gray-500">
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
