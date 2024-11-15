"use client";

import React from "react";
import { useState } from "react";

import Image from "next/image";
import ChevronDown from "@images/chevronDown.svg";

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
        className="flex h-[32px] w-auto items-center justify-between rounded-3xl border-2 px-4 py-2 focus:border-stone-400 focus:outline-none"
      >
        <span className="text-[14px] font-medium">
          {options.find((option) => option.value === sortOption)?.label || "정렬 옵션 선택"}
        </span>
        <Image src={ChevronDown} width={24} height={24} alt="선택 버튼" className="ml-4" />
      </button>

      {/* 드롭박스 */}
      {isOpen && (
        <ul className="absolute z-10 mt-2 w-full rounded-2xl border-2 bg-white shadow-lg">
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

export default SortOptions;
