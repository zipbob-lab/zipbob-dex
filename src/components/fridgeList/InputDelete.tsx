"use client";

import React, { useState } from "react";

const CategoreDelete = ({ onDeleteCategory }: { onDeleteCategory: (keywords: string[]) => void }) => {
  const [category, setCategory] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState<string>("");
  const [isComposing, setIsComposing] = useState(false);

  const handleComposition = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(e.type !== "compositionend");
  };

  const addCategory = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposing) {
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (categoryInput.trim() === "") {
        setCategoryInput("");
        alert("빈 태그는 입력할 수 없습니다.");
        return;
      }
      if (category.includes(categoryInput.trim())) {
        setCategoryInput("");
        alert("이미 입력된 태그입니다.");
        return;
      }
      const newCategory = [...category, categoryInput.trim()];
      setCategory(newCategory);
      onDeleteCategory(newCategory);
      setCategoryInput("");
    }
  };

  const deleteTag = (tag: string) => {
    const updatedCategory = category.filter((c) => c !== tag);
    setCategory(updatedCategory);
    onDeleteCategory(updatedCategory);
  };

  return (
    <form>
      <input
        type="text"
        name="categore"
        value={categoryInput}
        onChange={(e) => setCategoryInput(e.target.value)}
        onKeyDown={addCategory}
        onCompositionStart={handleComposition}
        onCompositionEnd={handleComposition}
        className="border p-1"
      />
      {category.map((tag) => (
        <div key={tag}>
          <div>{tag}</div>
          <button type="button" onClick={() => deleteTag(tag)}>
            삭제
          </button>
        </div>
      ))}
    </form>
  );
};

export default CategoreDelete;
