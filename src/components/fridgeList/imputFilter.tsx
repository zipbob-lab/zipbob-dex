import React, { useEffect, useState } from "react";

const Categore = () => {
  const [category, setCategory] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState<string>("");


  
  const addcategore = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (categoryInput.length === 0 || categoryInput.trim() === "") {
        setCategoryInput("");
        return alert("빈 태그는 입력할수 없습니다.");
      }
      if (category.some((prevTag) => prevTag === categoryInput.trim())) {
        setCategoryInput("");
        return alert("이미 입력된 태그입니다");
      }
      setCategory([...category, categoryInput.trim()]);
      setCategoryInput("");
      //   debounce(() => {
      //     setCategory([...category, categoryInput.trim()]);
      //   }, 300);
    }
  };
  console.log(categoryInput);
  console.log(category);
  return (
    <form>
      <input
        type=""
        name="categore"
        value={categoryInput}
        onChange={(e) => setCategoryInput(e.target.value)}
        onKeyDown={(e) => addcategore(e)}
        className=" border"
      />
      {category.map((c) => (
        <div key={c}>{c}</div>
      ))}
    </form>
  );
};

export default Categore;
