import HealthyRecipe from "@/components/mainPage/HealthyRecipe";
import Introduce from "@/components/mainPage/Introduce";
import Ranking from "@/components/mainPage/rank/Ranking";
import RecentComment from "@/components/mainPage/RecentComment/RecentComment";
import RecentRecipe from "@/components/mainPage/RecentRecipe";

export default async function Home() {
  return (
    <div className="mx-auto bg-[#FBFBFB] pb-[9rem]">
      <div className="flex flex-col gap-[4rem]">
        <Introduce />
      </div>
      <div className="mx-auto mt-[4rem] flex max-w-[1200px] flex-col items-center gap-[7.5rem]">
        <Ranking />
        <HealthyRecipe />
        <RecentRecipe />
        <RecentComment />
      </div>
    </div>
  );
}
