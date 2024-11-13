import HealthyRecipe from "@/components/mainPage/HealthyRecipe";
import Introduce from "@/components/mainPage/Introduce";
import Ranking from "@/components/mainPage/rank/Ranking";
import RecentComment from "@/components/mainPage/RecentComment/RecentComment";
import RecentRecipe from "@/components/mainPage/RecentRecipe";

export default async function Home() {
  return (
    <div className="mx-auto px-[3.75rem] pb-[9rem]">
      <div className="flex flex-col gap-32">
        <Introduce />
      </div>
      <div className="mx-auto mt-20 flex flex-col items-center gap-[5rem]">
        <Ranking />
        <HealthyRecipe />
        <RecentRecipe />
        <RecentComment />
      </div>
    </div>
  );
}
