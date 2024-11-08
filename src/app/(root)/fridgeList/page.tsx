"use client";

// import React, { useState } from "react";
import TagFilter from "@/components/fridgeListPage/FridgeFilter";
import Timer from "@/components/Timer";

const FridgeListPage = () => {
  // const [modal, setModal] = useState(false);

  // const handleTimerOpen = () => {
  //   setModal(true);
  // };

  // const handleTimerClose = () => {
  //   setModal(false);
  // };

  return (
    <div>
      <TagFilter />
      {/* 타이머 모달 기능 메인페이지 적용하기 */}
      {/* <button onClick={handleTimerOpen}>타이머</button>
      {modal && <Timer onClose={handleTimerClose} />} */}
    </div>
  );
};

export default FridgeListPage;
