"use client";

import React, { useState } from "react";
import CategoreAdd from "@/components/fridgeList/InputAdd";
import CategoreDelete from "@/components/fridgeList/InputDelete";
import FilteredRecipeList from "@/components/fridgeList/Filter";

const CategoreFilter = () => {
  const [addKeywords, setAddKeywords] = useState<string[]>([]);
  const [deleteKeywords, setDeleteKeywords] = useState<string[]>([]);
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);

  const handleAddKeywords = (keywords: string[]) => {
    setAddKeywords(keywords);
  };

  const handleDeleteKeywords = (keywords: string[]) => {
    setDeleteKeywords(keywords);
  };

  const handleSearch = () => {
    setIsSearchTriggered(true);
  };

  return (
    <div>
      <h2>필터링 조건 입력</h2>

      <CategoreAdd onAddCategory={handleAddKeywords} />
      <CategoreDelete onDeleteCategory={handleDeleteKeywords} />

      <button onClick={handleSearch} className="search-button">
        검색
      </button>

      {isSearchTriggered && (
        <FilteredRecipeList addKeywords={addKeywords} deleteKeywords={deleteKeywords} isSearching={isSearchTriggered} />
      )}
    </div>
  );
};

export default CategoreFilter;

// 필터 기능 페이지화 하기