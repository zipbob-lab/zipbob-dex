"use client";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import TagDelete from "@images/tagDelete.svg";
import SoopmFork from "@images/fridge/forkSpoom.svg";

const CategoreDelete = ({ onDeleteCategory }: { onDeleteCategory: (keywords: string[]) => void }) => {
  const [category, setCategory] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState<string>("");
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    const storedCategories = localStorage.getItem("deletedCategories");
    if (storedCategories) {
      const parsedCategories = JSON.parse(storedCategories);
      setCategory(parsedCategories);
      onDeleteCategory(parsedCategories);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("deletedCategories", JSON.stringify(category));
  }, [category]);

  const handleComposition = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(e.type !== "compositionend");
  };

  const addCategory = () => {
    if (categoryInput.trim() === "") {
      alert("빈 태그는 입력할 수 없습니다.");
      return;
    }
    if (category.includes(categoryInput.trim())) {
      alert("이미 입력된 태그입니다.");
      return;
    }

    const newCategory = [...category, categoryInput.trim()];
    setCategory(newCategory);
    onDeleteCategory(newCategory);
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
    onDeleteCategory(updatedCategory);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="h-auto w-full max-w-[32rem] overflow-auto ssm:max-w-[21rem] sm:max-w-[21rem] md:max-w-[22.6rem] lg:max-w-[27.3rem]"
    >
      <div className="mb-[0.5rem] flex space-x-[0.5rem]">
        <Image src={SoopmFork} width={20} height={20} alt="냉장고 재료" />
        <p className="font-medium ssm:text-body-16 sm:text-body-16 md:text-body-18 lg:text-body-18">없는 재료</p>
      </div>
      <p className="mb-[0.5rem] text-Gray-500 ssm:text-body-12 sm:text-body-12 md:text-body-14 lg:text-body-14">
        뺴고 싶은 재료를 하나씩 적고, 입력 버튼을 눌러요!
      </p>
      <div className="relative ml-auto flex w-full items-center rounded-[0.875rem] border-2 ssm:h-[2.5rem] sm:h-[2.5rem] md:h-[3rem] lg:h-[3rem]">
        <input
          type="text"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleComposition}
          onCompositionEnd={handleComposition}
          placeholder="예) 크림"
          className="h-full flex-1 rounded-full px-[1rem] outline-none ssm:text-body-14 sm:text-body-14 md:text-body-16 lg:text-body-16"
        />
        <button
          type="button"
          onClick={addCategory}
          className="h-full rounded-r-[0.75rem] bg-Primary-200 px-[1rem] text-body-16 text-white"
        >
          입력
        </button>
      </div>
      <div className="ssm:mt-[1rem] sm:mt-[1rem] md:mt-[1.25rem] lg:mt-[1.25rem]">
        {category.map((tag) => (
          <div
            key={tag}
            className="mb-[0.5rem] mr-[0.5rem] inline-flex h-[2.25rem] items-center rounded-lg bg-Gray-100 px-[0.5rem]"
          >
            <span className="ssm:text-body-14 sm:text-body-14 md:text-body-16 lg:text-body-16">{tag}</span>
            <button type="button" onClick={() => deleteTag(tag)} className="ml-[0.25rem] flex items-center">
              <Image src={TagDelete} width={20} height={20} alt="삭제 버튼" />
            </button>
          </div>
        ))}
      </div>
    </form>
  );
};

export default CategoreDelete;
