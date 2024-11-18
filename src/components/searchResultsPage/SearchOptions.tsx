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
    { value: "title+ingredients", label: "제목 + 재료" },
    { value: "title", label: "제목" },
    { value: "ingredients", label: "재료" }
  ];

  const handleOptionClick = (optionValue: string) => {
    setFilterOption(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-[2rem] items-center justify-between rounded-3xl border-2 border-Gray-200 bg-white px-[1rem] py-[0.5rem] focus:border-Gray-500 focus:outline-none sm:w-[9rem] md:w-[12.5rem]"
      >
        <span className="text-body-14 font-medium">
          {options.find((option) => option.value === filterOption)?.label || "필터 옵션 선택"}
        </span>
        <Image src={isOpen ? UpArrow : DownArrow} width={24} height={24} alt="선택 버튼" />
      </button>

      {/* 드롭박스 */}
      {isOpen && (
        <ul className="absolute z-10 mt-[0.5rem] w-full rounded-2xl border-2 border-Gray-200 bg-white p-[0.25rem] shadow-lg">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className="cursor-pointer rounded-2xl px-[1rem] py-[0.5rem] text-body-13 hover:bg-Gray-50"
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
