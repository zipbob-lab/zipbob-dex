"use client";

import React from "react";
import TagFilter from "@/components/fridgeList/FridgeFilter";
import Stopwatch from "@/components/StopWatch";

const FridgeListPage = () => {
  return (
    <div>
      <TagFilter />
      <Stopwatch />
    </div>
  );
};

export default FridgeListPage;
