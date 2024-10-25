"use client";

import React, { useState } from "react";
import SearchBar from "@/components/common/searchbar";

const SearchPage = () => {
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = (query: string) => {
    // 실제 검색 로직을 여기에 추가하거나 API를 호출해 검색 결과를 가져올 수 있음
    // 예시로, 입력된 검색어를 단순히 결과 목록에 추가
    setResults((prevResults) => [...prevResults, query]);
  };

  return (
    <div>
      <h1>레시피 검색</h1>
      <SearchBar onSearch={handleSearch} />

      <div>
        <h2>검색 결과</h2>
        <ul>
          {results.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchPage;
