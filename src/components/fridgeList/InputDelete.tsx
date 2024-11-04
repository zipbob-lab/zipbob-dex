"use client";

import React, { useState } from "react";

const CategoreDelete = ({ onDeleteCategory }: { onDeleteCategory: (keywords: string[]) => void }) => {
  const [category, setCategory] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState<string>("");
  const [isComposing, setIsComposing] = useState(false);

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
    <form onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        value={categoryInput}
        onChange={(e) => setCategoryInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleComposition}
        onCompositionEnd={handleComposition}
        placeholder="빼고 싶은 재료를 입력하세요!"
        className="border"
      />
      <button type="button" onClick={addCategory} className="ml-2 p-1 border">
        추가
      </button>
      <div>
        {category.map((tag) => (
          <div key={tag} className="inline-block mr-2">
            <span>{tag}</span>
            <button type="button" onClick={() => deleteTag(tag)} className="ml-1">
              x
            </button>
          </div>
        ))}
      </div>
    </form>
  );
};

export default CategoreDelete;
