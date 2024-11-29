import { RankingCardSkeletonProps } from "@/types/main";

const LikeCardSkeleton = ({ rank }: RankingCardSkeletonProps) => {
  return (
    <div>
      <div
        className={`inline-flex items-center rounded-t-xl ${rank === 1 ? `bg-Primary-300` : rank === 2 ? `bg-[#ABA9A5]` : `bg-[#B6A57D]`} px-7 py-2`}
      >
        <p className="mt-1 font-wiggle text-[1.125rem] leading-[120%] text-white">{rank}위</p>
      </div>
      <div className="flex cursor-pointer flex-col gap-4 rounded-[1.25rem] p-4 shadow-[0px_4px_20px_0px_rgba(154,130,102,0.1)]">
        <div className="relative h-[15rem] w-[15rem] md:h-[12.5rem] md:w-[12.5rem] xl:h-[18rem] xl:w-[18rem]">
          <div className="h-full w-full rounded-[1.25rem] bg-Gray-300" />
        </div>
        <div className="h-[4.360625rem] xl:h-[4.8175rem]" />
      </div>
    </div>
  );
};

export default LikeCardSkeleton;
