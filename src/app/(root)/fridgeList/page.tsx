"use client";

import React, { useEffect, useState } from "react";
import TagFilter from "@/components/fridgeList/FridgeFilter";
import Timer from "@/components/Timer";

const FridgeListPage = () => {
  const [modal, setModal] = useState(false);

  const handleTimerOpen = () => {
    setModal(true);
  };

  const handleTimerClose = () => {
    setModal(false);
  };

  return (
    <div>
      <TagFilter />
      <button onClick={handleTimerOpen}>시계</button>
      {modal && <Timer onClose={handleTimerClose} />}
    </div>
  );
};

export default FridgeListPage;
