"use client";

import React, { useState } from "react";

import Image from "next/image";
import DownArrow from "@images/search/downArrow.svg";
import UpArrow from "@images/search/upArrow.svg";

interface SortOptionsProps {
  sortOption: string;
  setSortOption: (option: string) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({ sortOption, setSortOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { value: "likes", label: "좋아요 높은 순" },
    { value: "level", label: "난이도 높은 순" },
    { value: "scraps", label: "스크랩 많은 순" },
    { value: "commnet", label: "후기 많은 순" }
  ];

  const handleOptionClick = (optionValue: string) => {
    setSortOption(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-[2rem] w-auto items-center justify-between rounded-3xl border-2 border-Gray-300 px-[1rem] py-[0.5rem] focus:border-Gray-400 focus:outline-none"
      >
        <span className="text-body-14 font-medium">
          {options.find((option) => option.value === sortOption)?.label || "정렬 옵션 선택"}
        </span>
        <Image src={isOpen ? UpArrow : DownArrow} width={24} height={24} alt="선택 버튼" className="ml-[0.5rem]" />
      </button>

      {/* 드롭박스 */}
      {isOpen && (
        <ul className="absolute z-10 mt-[0.5rem] w-full rounded-2xl border-2 border-Gray-300 bg-white p-[0.25rem] shadow-lg">
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

export default SortOptions;
