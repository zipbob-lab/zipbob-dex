import Image from "next/image";
import React from "react";
import FireFilledIcon from "../../../public/images/fireFilled.svg";
import LikeEmptyIcon from "../../../public/images/likeEmpty.svg";
import ScrapEmptyIcon from "../../../public/images/scrapEmpty.svg";

const HealthyRecipe = () => {
  return (
    <div className="mt-10 bg-[#FFF6DC] rounded-[64px] max-w-[1000px]">
      <div className="px-[5rem] py-[2.5rem]">
        <h1 className="text-[1.6rem] text-Secondary-400">건강하고 맛있는 저당/저염 레시피</h1>
        <div className="flex gap-[3rem] mt-8 overflow-x-auto">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div className="flex flex-col gap-3" key={index}>
                <div className="w-[11.5rem] h-[11.5rem] relative">
                  <div className="bg-gray-500 w-[11.5rem] h-[11.5rem]" />
                </div>
                <p>레시피 제목을 입력해주세요</p>
                <p className="text-gray-500">사용자 닉네임</p>
                <div className="flex justify-between">
                  <div className="flex">
                    <Image src={FireFilledIcon} alt="레시피 난이도" />
                    <Image src={FireFilledIcon} alt="레시피 난이도" />
                    <Image src={FireFilledIcon} alt="레시피 난이도" />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center">
                      <Image src={LikeEmptyIcon} alt="좋아요 상태" />
                      <p className="text-center">323</p>
                    </div>
                    <div className="flex items-center">
                      <Image src={ScrapEmptyIcon} alt="스크랩 상태" />
                      <p className="text-center">433</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default HealthyRecipe;
