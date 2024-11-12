import Image from 'next/image'
import React from 'react'
import Pencil from "@images/penWhite.svg";
import PencilOrange from "@images/penOrange.svg";

const RecipeSubmitButton = ({ closeModal }: { closeModal: () => void }) => {
  return (
    <div>
    <div className="flex justify-end gap-x-[10px]">
      <button
        className="bg-white-50 flex min-w-[256px] items-center justify-center gap-2 rounded-2xl border border-Primary-300 p-4 text-title-20 text-Primary-300"
        type="button"
        onClick={closeModal}
      >
        <Image src={PencilOrange} width={20} height={20} alt="연필 아이콘" />
        닫기
      </button>
      <button
        className="flex min-w-[256px] items-center justify-center gap-2 rounded-2xl bg-orange-400 p-4 text-title-20 text-white"
        type="submit"
      >
        <Image src={Pencil} width={20} height={20} alt="연필 아이콘" />
        등록하기
      </button>
    </div>
  </div>
  )
}

export default RecipeSubmitButton