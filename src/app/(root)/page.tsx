import HealthyRecipe from "@/components/mainPage/HealthyRecipe";
import Introduce from "@/components/mainPage/Introduce";
import Ranking from "@/components/mainPage/rank/Ranking";
import RecentComment from "@/components/mainPage/RecentComment/RecentComment";
import RecentRecipe from "@/components/mainPage/RecentRecipe";

export default async function Home() {
  return (
    <>
      <Introduce />
      <div className="flex flex-col items-center p-4">
        <Ranking />
        <HealthyRecipe />
        <RecentRecipe />
        <RecentComment />
      </div>
    </>
  );
}
