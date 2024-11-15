
import React from 'react'


const RecipeSubmitButton = ({ closeModal }: { closeModal: () => void }) => {
  return (
    <div>
    <div className="flex justify-end gap-x-[0.62rem]">
      <button
        className="bg-white-50 flex min-w-[256px] items-center justify-center gap-2 rounded-2xl border border-Primary-300 p-[1rem] text-title-20 text-Primary-300"
        type="button"
        onClick={closeModal}
      >
        {/* <Image src={PencilOrange} width={20} height={20} alt="연필 아이콘" /> */}
        닫기
      </button>
      <button
        className="flex min-w-[16rem] items-center justify-center gap-2 rounded-2xl bg-orange-400 p-[1rem] text-title-20 text-white"
        type="submit"
      >
        {/* <Image src={Pencil} width={20} height={20} alt="연필 아이콘" /> */}
        등록하기
      </button>
    </div>
  </div>
  )
}

export default RecipeSubmitButton