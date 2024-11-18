import HealthyRecipe from "@/components/mainPage/HealthyRecipe";
import Introduce from "@/components/mainPage/Introduce";
import Ranking from "@/components/mainPage/rank/Ranking";
import RecentComment from "@/components/mainPage/RecentComment/RecentComment";
import RecentRecipe from "@/components/mainPage/RecentRecipe";

export default async function Home() {
  return (
    <div className="mx-auto px-[1rem] sm:px-[3.19rem] md:px-[1.03rem] lg:px-[3.75rem]">
      <div className="flex flex-col gap-[3.25rem] md:gap-[6.25rem] xl:gap-[8.62rem]">
        <Introduce />
      </div>
      <div className="mx-auto mt-[3rem] flex flex-col items-center gap-[3rem] md:mt-[1.75rem] md:gap-[3.25rem] xl:gap-[5rem]">
        <Ranking />
        <HealthyRecipe />
        <RecentRecipe />
        <RecentComment />
      </div>
    </div>
  );
}
