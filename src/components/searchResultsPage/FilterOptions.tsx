"use client";

import React, { useState } from "react";
import Image from "next/image";
import DownArrow from "@images/search/downArrow.svg";
import UpArrow from "@images/search/upArrow.svg";

interface FilterOptionsProps {
  filterOption: string;
  setFilterOption: (value: string) => void;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({ filterOption, setFilterOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: "title+ingredients", label: "제목+재료 검색" },
    { value: "title", label: "제목 검색" },
    { value: "ingredients", label: "재료 검색" }
  ];

  const handleOptionClick = (optionValue: string) => {
    setFilterOption(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-[32px] w-auto items-center justify-between rounded-3xl border-2 px-4 py-2 focus:border-stone-400 focus:outline-none"
      >
        <span className="text-[14px] font-medium">
          {options.find((option) => option.value === filterOption)?.label || "필터 옵션 선택"}
        </span>
        <Image src={isOpen ? UpArrow : DownArrow} width={24} height={24} alt="선택 버튼" className="ml-8" />
      </button>

      {/* 드롭박스 */}
      {isOpen && (
        <ul className="absolute z-10 mt-2 w-full rounded-2xl border-2 bg-white p-1 shadow-lg">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className="cursor-pointer rounded-2xl px-4 py-2 text-[13px] hover:bg-stone-100"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilterOptions;
