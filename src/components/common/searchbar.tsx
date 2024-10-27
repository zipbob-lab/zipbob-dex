"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface KeyInterface {
  id: number;
  text: string;
}

const SearchBar = () => {
  const [keywords, setKeywords] = useState<KeyInterface[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const router = useRouter();

  // 로컬 스토리지에서 검색어 불러오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedKeywords = localStorage.getItem("keywords");
      if (storedKeywords) {
        setKeywords(JSON.parse(storedKeywords));
      }
    }
  }, []);

  // keywords가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("keywords", JSON.stringify(keywords));
    }
  }, [keywords]);

  // 검색어 추가
  const addKeyword = (text: string) => {
    const newKeyword = { id: Date.now(), text };
    setKeywords([newKeyword, ...keywords]);
  };

  // 검색어 삭제
  const removeKeyword = (id: number) => {
    setKeywords((prevKeywords) => prevKeywords.filter((keyword) => keyword.id !== id));
  };

  // 모든 검색어 삭제
  const clearKeywords = () => {
    setKeywords([]);
  };

  // 검색어 입력 처리
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // 검색 제출 시 페이지 이동 및 검색어 추가
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim() === "") return;
    router.push(`/search_result/${searchValue}`);
    addKeyword(searchValue);
    setSearchValue("");
  };

  // 저장된 검색어 클릭 시 페이지 이동
  const handleKeywordClick = (text: string) => {
    router.push(`/search_result/${text}`);
  };

  return (
    <div>
      <header>
        <form onSubmit={handleSearchSubmit}>
          <input type="search" value={searchValue} onChange={handleSearchChange} placeholder="레시피를 검색해보세요" />
        </form>
      </header>

      <div>
        <h2>최근 검색어</h2>
        {keywords.length > 0 && (
          <button type="button" onClick={clearKeywords}>
            전체 삭제
          </button>
        )}
      </div>

      <ul>
        {keywords.length > 0 ? (
          keywords.map((k) => (
            <li key={k.id}>
              <p onClick={() => handleKeywordClick(k.text)}>{k.text}</p>
              <button type="button" onClick={() => removeKeyword(k.id)}>
                삭제
              </button>
            </li>
          ))
        ) : (
          <div>최근 검색어가 없습니다</div>
        )}
      </ul>
    </div>
  );
};

export default SearchBar;
