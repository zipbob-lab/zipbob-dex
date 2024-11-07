import SearchBar from "../common/search/Searchbar";
import MainSvg1 from "@images/mainSvg1.svg";
import MainSvg2 from "@images/mainSvg2.svg";
import ForkKnife from "@images/forkKnife.svg";
import Image from "next/image";

const Introduce = () => {
  return (
    <>
      <div className="h-[36.875rem] w-full bg-Secondary-100 bg-no-repeat">
        <div className="mx-auto mt-[6.5rem] flex max-w-[63.875rem] justify-between">
          <div className="flex flex-col">
            <h2 className="mt-1 w-[23.45rem] font-yangjin text-[3rem] font-medium leading-[120%] tracking-[-0.24px] text-Gray-900">
              요리 초보를 위한, 집밥도감
            </h2>
            <p className="mb-[3.75rem] mt-6 w-[23.45rem] text-title-20">
              단계별로 레시피에 도전하며 요리 실력을 키우고, 다른 유저들과 레시피를 공유해보세요!
            </p>
            <SearchBar className="max-w-[692px]" mainSearchBar={true} />
          </div>
          <Image src={MainSvg1} alt="메인페이지 이미지1" className="-mt-8" />
        </div>
      </div>
      <div className="flex justify-center gap-[4rem]">
        <Image src={MainSvg2} alt="메인페이지 이미지2" />
        <div className="flex flex-col items-center justify-center gap-7">
          <div className="flex items-center gap-4">
            <Image src={ForkKnife} alt="포크, 칼 아이콘" />
            <h3 className="mt-2 font-yangjin text-[2.25rem] font-medium leading-[120%] tracking-[-0.18px] text-Primary-300">
              단계별 레시피 경험치를 쌓아요
            </h3>
          </div>
          <p className="w-[30rem] text-body-20">
            단계별로 다양한 레시피에 도전하며 요리 실력을 쌓아보세요! 다른 유저들이 공유한 레시피를 찾아 함께 만들어
            보고, 나만의 특별한 레시피도 등록해 봐요.
            <br /> 즐거운 요리 경험이 여러분을 기다려요!
          </p>
        </div>
      </div>
    </>
  );
};

export default Introduce;
