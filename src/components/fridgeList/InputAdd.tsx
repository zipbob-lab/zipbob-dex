"use client";

import React, { useState } from "react";

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
    <form onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        value={categoryInput}
        onChange={(e) => setCategoryInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleComposition}
        onCompositionEnd={handleComposition}
        placeholder="넣고 싶은 재료를 입력해보세요!"
        className="border p-1"
      />
      <button type="button" onClick={addCategory} className="ml-2 border p-1">
        추가
      </button>
      <div>
        {category.map((tag) => (
          <div key={tag} className="mr-2 inline-block">
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

export default CategoreAdd;
