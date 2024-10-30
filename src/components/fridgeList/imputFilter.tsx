// import { debounce } from "lodash";
import React, { useState } from "react";

const Categore = () => {
  const [category, setCategory] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState<string>("");
  const [isComposing, setIsComposing] = useState(false);

  //   const debouncedSetCategory = debounce(
  //     (newCategory: string, currentCategories: string[], setCategory: React.Dispatch<React.SetStateAction<string[]>>) => {
  //       setCategory([...currentCategories, newCategory.trim()]);
  //     },
  //     300
  //   );
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
      setCategory([...category, categoryInput.trim()]);
      //   debouncedSetCategory(categoryInput, category, setCategory);
      setCategoryInput("");
    }
  };
  console.log(category);
  console.log(categoryInput);

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
        className=" border"
      />
      {category.map((c) => (
        <div key={c}>{c}</div>
      ))}
    </form>
  );
};

export default Categore;

// 1. 디바운싱 처리 시도
// 2. 컴포지션 처리 시도
// 3. Enter !== 처리
// 4. 디바운싱 주석 처리와 컴포지션 처리 시도후 해결완료
