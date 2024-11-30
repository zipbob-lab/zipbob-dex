import React from "react";

const RecipeSubmitButton = ({ closeModal }: { closeModal: () => void }) => {
  return (
    <div>
      <div className="flex justify-end gap-x-[0.62rem]">
        <button
          className="bg-white-50 flex hidden min-w-[256px] items-center justify-center gap-2 rounded-2xl border border-Primary-300 p-[1rem] text-title-20 text-Primary-300 lg:block"
          type="button"
          onClick={closeModal}
        >
          닫기
        </button>
        <button
          className="flex w-full items-center justify-center gap-2 rounded-[1rem] bg-orange-400 px-[0.75rem] py-[1rem] text-title-16 text-white md:w-[16rem] md:rounded-[1rem] md:p-[1rem] md:px-[1rem] md:text-title-20"
          type="submit"
        >
          등록하기
        </button>
      </div>
    </div>
  );
};

export default RecipeSubmitButton;
