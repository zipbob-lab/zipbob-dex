import HealthyRecipe from "@/components/mainPage/HealthyRecipe";
import Introduce from "@/components/mainPage/Introduce";
import Ranking from "@/components/mainPage/rank/Ranking";
import RecentComment from "@/components/mainPage/RecentComment/RecentComment";
import RecentRecipe from "@/components/mainPage/RecentRecipe";

export default async function Home() {
  return (
    <div className="mx-auto">
      <div className="flex flex-col">
        <Introduce />
      </div>
      <div className="flex flex-col items-center px-[7.5rem] pt-[6rem]">
        <Ranking />
        <HealthyRecipe />
        <RecentRecipe />
        <RecentComment />
      </div>
    </div>
  );
}
