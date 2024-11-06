"use client";

import React, { useState } from "react";

interface SortOptionsProps {
  sortOption: string;
  setSortOption: (option: string) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({ sortOption, setSortOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { value: "default", label: "정렬 옵션 (기본 순)" },
    { value: "commnet", label: "후기 많은 순" },
    { value: "likes", label: "좋아요 높은 순" },
    { value: "level", label: "난이도 높은 순" },
    { value: "scraps", label: "스크랩 많은 순" }
  ];

  const handleOptionClick = (optionValue: string) => {
    setSortOption(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-64">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full rounded-md border p-2 text-left">
        {options.find((option) => option.value === sortOption)?.label || "정렬 옵션 선택"}
      </button>
      {isOpen && (
        <ul className="absolute mt-1 w-full rounded-md border bg-white shadow-lg">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className="cursor-pointer p-2 hover:bg-gray-200"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortOptions;
