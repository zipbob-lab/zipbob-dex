"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface KeyInterface {
  id: number;
  text: string;
}

// 상태 설정
const SearchBar = () => {
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

  const handleFocus = () => setIsDropdownVisible(true);
  const handleBlur = () => setIsDropdownVisible(false);

  return (
    <div>
      <header>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="search"
            value={searchValue}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="메뉴나 재료 이름을 검색해보세요!"
          />
          <button type="submit">검색</button>
        </form>
      </header>

      {isDropdownVisible && (
        <div onMouseDown={(e) => e.preventDefault()}>
          <h2>최근 검색어</h2>
          {keywords.length > 0 ? (
            <>
              <button type="button" onClick={deleteKeywords}>
                전체 검색어 삭제
              </button>
              <ul>
                {keywords.map((k) => (
                  <li key={k.id}>
                    <p onClick={() => handleKeywordClick(k.text)}>{k.text}</p>
                    <button type="button" onClick={() => removeKeyword(k.id)}>
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div>최근 검색어가 없습니다</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
