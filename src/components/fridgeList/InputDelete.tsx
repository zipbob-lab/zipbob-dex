import React, { useState } from "react";

const CategoreDelete = ({ onDeleteCategory }: { onDeleteCategory: (keywords: string[]) => void }) => {
  const [category, setCategory] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState<string>("");
  const [isComposing, setIsComposing] = useState(false);

  const handleComposition = (e: React.CompositionEvent<HTMLInputElement>) => {
    if (e.type === "compositionstart") {
      setIsComposing(true);
    }
    if (e.type === "compositionend") {
      setIsComposing(false);
    }
  };

  const addcategore = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposing) {
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      if (categoryInput.length === 0 || categoryInput.trim() === "") {
        setCategoryInput("");
        return alert("빈 태그는 입력할수 없습니다.");
      }
      if (category.some((prevTag) => prevTag === categoryInput.trim())) {
        setCategoryInput("");
        return alert("이미 입력된 태그입니다");
      }
      const newCategory = [...category, categoryInput.trim()];
      setCategory(newCategory);
      onDeleteCategory(newCategory);
      setCategoryInput("");
    }
  };

  const deletetag = (tag: string) => {
    const updatedCategory = category.filter((c) => c !== tag);
    setCategory(updatedCategory);
    onDeleteCategory(updatedCategory);
  };

  return (
    <form>
      <input
        type=""
        name="categore"
        value={categoryInput}
        onChange={(e) => setCategoryInput(e.target.value)}
        onKeyDown={(e) => addcategore(e)}
        onCompositionStart={handleComposition}
        onCompositionUpdate={handleComposition}
        onCompositionEnd={handleComposition}
        className=" border p-1"
      />
      {category.map((tag) => (
        <div key={tag}>
          <div>{tag}</div>
          <button type="button" onClick={() => deletetag(tag)}>
            삭제
          </button>
        </div>
      ))}
    </form>
  );
};

export default CategoreDelete;
