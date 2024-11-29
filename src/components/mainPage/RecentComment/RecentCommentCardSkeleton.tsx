const RecentCommentCardSkeleton = () => {
  return (
    <div className="flex cursor-pointer rounded-2xl p-4 shadow-[0px_4px_20px_0px_rgba(154,130,102,0.1)]">
      <div className="relative h-[6.25rem] w-[6.25rem] md:h-[7.5rem] md:w-[7.5rem]">
        <div className="h-full w-full rounded-2xl bg-Gray-300" />
      </div>
      <div className="ml-4 flex w-[calc(100%-7.25rem)] flex-col justify-between md:w-[calc(100%-8.5rem)]" />
    </div>
  );
};

export default RecentCommentCardSkeleton;
