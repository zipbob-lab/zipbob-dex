const RecipeCardSkeleton = () => {
  return (
    <div className="flex w-[9rem] cursor-pointer flex-col rounded-[1.25rem] bg-white p-[0.75rem] shadow-[0px_4px_20px_0px_rgba(154,130,102,0.1)] sm:w-[10rem] xl:w-[15.25rem] xl:p-[1rem]">
      <div className="relative h-[7.5rem] w-[7.5rem] overflow-hidden sm:h-[8.5rem] sm:w-[8.5rem] xl:h-[13.25rem] xl:w-[13.25rem]">
        <div className="h-full w-full rounded-[1.25rem] bg-Gray-300" />
      </div>
      <div className="h-[4.61125rem] xl:h-[5.36125rem]" />
    </div>
  );
};

export default RecipeCardSkeleton;
