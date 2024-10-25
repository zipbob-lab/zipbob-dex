import React, { useEffect, useState } from "react";

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState<string>("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    const sevedSearches = localStorage.getItem("recentSearches");
    if (sevedSearches) {
      setRecentSearches(JSON.parse(sevedSearches));
    }
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      const updatedSearches = [query, ...recentSearches].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
      onSearch(query);
    }
  };

  return (
    <div>
      <input type="text" value={query} onChange={handleInputChange} placeholder="요리 레시피를 검색해보세요!" />
      <button onClick={handleSearch}>검색</button>
      <div>
        <h4>최근 검색어</h4>
        <ul>
          {recentSearches.map((search, index) => (
            <li key={index}>{search}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchBar;

// todo 1. : 최근 검색어 로컬 스토리지 저장
// todo 2. : 수퍼베이스 스토어 연결 or 서버 연결
