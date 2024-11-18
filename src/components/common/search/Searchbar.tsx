"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MainSearch from "@images/mainSearch.svg";
import Subsearch from "@images/subSearch.svg";
import Delete from "@images/subDelete.svg";

// 타입 지정
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
      className={`relative mx-auto max-h-[3.25rem] w-full max-w-[40.5rem] ${className}`}
      onMouseDown={(e) => e.stopPropagation()} // 드롭박스 닫히지 않도록 이벤트 적용 방지
    >
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          onFocus={() => setIsDropdownVisible(true)}
          onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)}
          placeholder="메뉴나 재료 이름을 검색해보세요!"
          className={`${
            mainSearchBar ? "h-[3.25rem] border-Primary-300" : "h-[3rem] border-Gray-200"
          } w-full rounded-full border-2 px-[3rem] py-[0.5rem] pl-4 text-body-16 focus:outline-none ${
            mainSearchBar ? "focus:border-Primary-300" : "focus:border-Gray-500"
          }`}
        />
        <button type="submit" className="absolute right-[1.5rem] top-1/2 -translate-y-1/2 transform">
          <Image src={MainSearch} width={24} height={24} alt="검색 버튼" />
        </button>
      </form>

      {/* 드롭박스 */}
      {isDropdownVisible && keywords.length > 0 && (
        <div
          className="absolute z-10 mt-[0.5rem] w-full rounded-[1.5rem] border border-Gray-300 bg-white p-[0.5rem] shadow-lg"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between px-[1rem] py-[0.5rem]">
            <div className="flex items-center space-x-2">
              <h3 className="text-body-14 text-Gray-400">최근 검색어</h3>
              <h3 className="hidden text-body-14 text-Gray-400 md:block lg:block">
                *(최대 5개까지 저장할 수 있습니다.)
              </h3>
              {/* md 다음 단위에서 안사라짐 질문할것 */}
            </div>
            <button type="button" onClick={deleteKeywords} className="text-body-13 text-[#E80018] hover:bg-Gray-50">
              전체 삭제
            </button>
          </div>
          <ul>
            {keywords.map((k) => (
              <li key={k.id} className="flex items-center rounded-[1.5rem] px-[1rem] py-[0.75rem] hover:bg-Gray-50">
                <div
                  className="flex flex-shrink-0 flex-grow cursor-pointer items-center"
                  onClick={() => handleKeywordClick(k.text)}
                >
                  <Image src={Subsearch} width={16} height={16} alt="검색 아이콘" />
                  <p className="ml-[0.5rem] w-full text-body-16 text-Gray-500">{k.text}</p>
                </div>
                <button type="button" onClick={() => removeKeyword(k.id)} className="text-Red-500 ml-auto text-xs">
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
