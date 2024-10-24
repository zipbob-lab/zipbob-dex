import React, { useState } from "react";

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div>
      <input type="text" value={query} onChange={handleInputChange} placeholder="요리 레시피를 검색해보세요!" />
      <button onClick={handleSearch}>검색</button>
    </div>
  );
};

export default SearchBar;
