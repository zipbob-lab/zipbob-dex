"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import MainSearch from "@images/search/mainSearch.svg";
import Subsearch from "@images/search/subSearch.svg";
import Delete from "@images/search/subDelete.svg";

// 타입 지정
interface KeyInterface {
  id: number;
  text: string;
}

interface SearchBarProps {
  className?: string;
  mainSearchBar?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ className = "", mainSearchBar = false }) => {
  const [keywords, setKeywords] = useState<KeyInterface[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const router = useRouter();

  // 화면 크기 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 479);
    };

    handleResize(); // 초기 실행
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 로컬 스토리지 검색어 불러오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedKeywords = localStorage.getItem("keywords");
      if (storedKeywords) {
        setKeywords(JSON.parse(storedKeywords));
      }
    }
  }, []);

  // keywords가 변경 시 로컬 스토리지 저장
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

  // 검색어 변경 핸들러
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

  // 저장된 검색어 클릭 시 페이지 이동 후 창 닫기
  const handleKeywordClick = (text: string) => {
    setIsDropdownVisible(false); // 드롭다운 닫기
    router.push(`/searchResults/${text}`); // 페이지 이동
  };

  return (
    <div
      className={`relative mx-auto max-h-[3.25rem] w-full ${
        mainSearchBar ? "max-w-[40.5rem]" : "md:max-w-[20rem] lg:max-w-[32rem]"
      } ${className}`}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* 모바일 ui 및 데스트탑 드롭박스 */}
      {isMobileView && isDropdownVisible ? (
        <div className="fixed inset-0 z-50 bg-white px-[1.25rem] py-[1rem]">
          <div className="p-2">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center justify-center">
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="메뉴나 재료 이름을 검색해보세요!"
                className="h-[2.5rem] w-full rounded-full border-2 border-Gray-300 px-[2.5rem] py-[0.5rem] pl-4 text-body-16 focus:border-Primary-300 focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
              <button type="submit" className="absolute right-[1rem] top-1/2 -translate-y-1/2 transform">
                <Image src={MainSearch} width={24} height={24} alt="검색 버튼" />
              </button>
            </form>
          </div>
          <div className="relative w-full">
            <div className="flex items-center justify-between px-[1rem] py-[0.5rem]">
              <h3 className="text-body-14 text-Gray-300">최근 검색어</h3>
              <button type="button" onClick={deleteKeywords} className="text-body-14 text-Gray-300 hover:bg-Gray-50">
                전체 삭제
              </button>
            </div>
            <ul>
              {keywords.map((k) => (
                <li key={k.id} className="flex items-center rounded-[1.5rem] px-[1rem] py-[0.5rem] hover:bg-Gray-50">
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
        </div>
      ) : (
        <>
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
          {isDropdownVisible && keywords.length > 0 && (
            <div
              className="absolute z-10 mt-[0.5rem] w-full rounded-[1.5rem] border border-Gray-300 bg-white p-[0.5rem] shadow-lg"
              onMouseDown={(e) => e.preventDefault()}
            >
              <div className="flex items-center justify-between px-[1rem] py-[0.5rem]">
                <h3 className="text-body-14 text-Gray-300">최근 검색어</h3>
                <button type="button" onClick={deleteKeywords} className="text-body-12 text-Gray-300 hover:bg-Gray-50">
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
        </>
      )}
    </div>
  );
};

export default SearchBar;
