"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MainSearch from "@images/mainSearch.svg";
import Subsearch from "@images/subSearch.svg";
import Delete from "@images/subDelete.svg";

interface KeyInterface {
  id: number;
  text: string;
}

interface SearchBarProps {
  className?: string;
  mainSearchBar?: boolean;
}

// 상태 설정
const SearchBar: React.FC<SearchBarProps> = ({ className = "", mainSearchBar = false }) => {
  const [keywords, setKeywords] = useState<KeyInterface[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const router = useRouter();

  // 로컬 스토리지 검색어 불러오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedKeywords = localStorage.getItem("keywords");
      if (storedKeywords) {
        setKeywords(JSON.parse(storedKeywords));
      }
    }
  }, []);

  // keywords가 변경시 로컬 스토리지 저장
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("keywords", JSON.stringify(keywords));
    }
  }, [keywords]);

  // 검색어 추가 (최대 5개 유지)
  const addKeyword = (text: string) => {
    const newKeyword = { id: Date.now(), text };
    setKeywords((prevKeywords) => {
      const updatedKeywords = [newKeyword, ...prevKeywords];
      return updatedKeywords.slice(0, 5);
    });
  };

  // 검색어 삭제
  const removeKeyword = (id: number) => {
    setKeywords((prevKeywords) => prevKeywords.filter((keyword) => keyword.id !== id));
  };

  // 모든 검색어 삭제
  const deleteKeywords = () => {
    setKeywords([]);
  };

  // 검색어 클릭시 이동
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // 검색 폼 작동
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim() === "") return;
    router.push(`/searchResults/${searchValue}`);
    addKeyword(searchValue);
    setSearchValue("");
    setIsDropdownVisible(false);
  };

  // 저장된 검색어 클릭 시 페이지 이동
  const handleKeywordClick = (text: string) => {
    router.push(`/searchResults/${text}`);
  };

  return (
    <div
      className={`relative mx-auto max-h-[52px] w-full max-w-[648px] ${className}`}
      onMouseDown={(e) => e.stopPropagation()} // 드롭박스 닫히지 않도록 이벤트 적용 방지
    >
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 transform"></div>
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          onFocus={() => setIsDropdownVisible(true)}
          onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)}
          placeholder="메뉴나 재료 이름을 검색해보세요!"
          className={`${
            mainSearchBar ? "h-[52px]" : "h-[48px]"
          } w-full rounded-full border-2 px-12 py-2 pl-4 text-left focus:outline-none ${
            mainSearchBar ? "focus:border-[#ff9143]" : "border-gray-300 focus:border-stone-400"
          }`}
          style={mainSearchBar ? { borderColor: "#ff9143" } : {}}
        />
        <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 transform">
          <Image src={MainSearch} width={24} height={24} alt="큰 돋보기" />
        </button>
      </form>

      {/* 드롭박스 */}
      {isDropdownVisible && keywords.length > 0 && (
        <div
          className="absolute z-10 mt-2 w-full rounded-3xl border border-gray-300 bg-white shadow-lg"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between px-4 py-2">
            <h3 className="py-1 text-sm font-normal text-gray-400">최근 검색어 * (최대 5개까지 저장할 수 있습니다.)</h3>
            <button type="button" onClick={deleteKeywords} className="text-xs text-red-400 hover:bg-gray-100">
              전체 삭제
            </button>
          </div>
          <ul>
            {keywords.map((k) => (
              <li key={k.id} className="flex items-center rounded-3xl px-4 py-3 hover:bg-stone-100">
                <div
                  className="flex flex-shrink-0 flex-grow cursor-pointer items-center"
                  onClick={() => handleKeywordClick(k.text)}
                >
                  <Image src={Subsearch} width={16} height={16} alt="작은 돋보기" />
                  <p className="ml-2 w-full font-medium text-gray-500">{k.text}</p>
                </div>
                <button type="button" onClick={() => removeKeyword(k.id)} className="ml-auto text-xs text-red-500">
                  <Image src={Delete} width={12} height={12} alt="삭제 버튼" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
