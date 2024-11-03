import SearchBar from "@/components/common/searchbar";
import HealthyRecipe from "@/components/mainPage/HealthyRecipe";
import Ranking from "@/components/mainPage/rank/Ranking";
import RecentComment from "@/components/mainPage/RecentComment/RecentComment";
import RecentRecipe from "@/components/mainPage/RecentRecipe";

export default async function Home() {
  return (
    <div className="p-4 flex flex-col items-center">
      <SearchBar />
      <Ranking />
      <HealthyRecipe />
      <RecentRecipe />
      <RecentComment />
    </div>
  );
}
