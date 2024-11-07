import SearchBar from "@/components/common/search/Searchbar";
import HealthyRecipe from "@/components/mainPage/HealthyRecipe";
import Ranking from "@/components/mainPage/rank/Ranking";
import RecentComment from "@/components/mainPage/RecentComment/RecentComment";
import RecentRecipe from "@/components/mainPage/RecentRecipe";

export default async function Home() {
  return (
    <div className="flex flex-col items-center p-4">
      <SearchBar className="max-h-[52px] max-w-[692px]" mainSearchBar={true} />
      <Ranking />
      <HealthyRecipe />
      <RecentRecipe />
      <RecentComment />
    </div>
  );
}
