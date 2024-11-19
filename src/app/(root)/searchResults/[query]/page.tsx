import React from "react";
import SearchResults from "@/components/searchResultsPage/SearchResults";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "검색결과",
  description: "단어를 입력해 원하는 레시피를 찾아 볼수 있습니다."
};

const SearchResultPage = () => {
  return (
    <div>
      <SearchResults />
    </div>
  );
};

export default SearchResultPage;
