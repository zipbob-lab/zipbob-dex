"use client";

import React, { useState } from "react";

import Image from "next/image";
import TagDelete from "@images/tagDelete.svg";
import SpoomFork from "@images/fridge/spoomFork.svg";

const CategoreAdd = ({ onAddCategory }: { onAddCategory: (keywords: string[]) => void }) => {
  const [category, setCategory] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState<string>("");
  const [isComposing, setIsComposing] = useState(false);

  const handleComposition = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(e.type !== "compositionend");
  };

  const addCategory = () => {
    if (!categoryInput.trim()) {
      alert("빈 태그는 입력할 수 없습니다.");
      return;
    }
    if (category.includes(categoryInput.trim())) {
      alert("이미 입력된 태그입니다.");
      return;
    }

    const newCategory = [...category, categoryInput.trim()];
    setCategory(newCategory);
    onAddCategory(newCategory);
    setCategoryInput("");
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (isComposing) return;
    if (e.key === "Enter") {
      e.preventDefault();
      addCategory();
    }
  };

  const deleteTag = (tag: string) => {
    const updatedCategory = category.filter((c) => c !== tag);
    setCategory(updatedCategory);
    onAddCategory(updatedCategory);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="h-auto w-[512px] overflow-auto">
      <div className="mb-2 flex space-x-2">
        <Image src={SpoomFork} width={20} height={20} alt="냉장고 재료" />
        <p className="text-[18px] font-medium">냉장고 재료</p>
      </div>

      <div className="relative mb-2 flex h-[48px] w-[452px] items-center rounded-[14px] border-2">
        <input
          type="text"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleComposition}
          onCompositionEnd={handleComposition}
          placeholder="넣고 싶은 재료를 입력해요!"
          className="h-full flex-1 rounded-full px-4 outline-none"
        />
        <button
          type="button"
          onClick={addCategory}
          className="h-full rounded-r-[12px] bg-[#ffbb8a] px-4 text-[16px] font-normal text-[#ffffff]"
        >
          입력
        </button>
      </div>
      <div>
        {category.map((tag) => (
          <div key={tag} className="mb-2 mr-2 inline-flex h-[36px] items-center rounded-lg bg-[#fff6dc] px-2">
            <span>{tag}</span>
            <button type="button" onClick={() => deleteTag(tag)} className="ml-1 flex items-center">
              <Image src={TagDelete} width={20} height={20} alt="삭제 버튼" />
            </button>
          </div>
        ))}
      </div>
    </form>
  );
};

export default CategoreAdd;
