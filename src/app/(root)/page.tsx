import SearchBar from "@/components/common/Searchbar";
import Ranking from "@/components/mainPage/rank/Ranking";

export default async function Home() {
  return (
    <div className="p-4 flex flex-col items-center">
      <SearchBar />
      <Ranking />
    </div>
  );
}
