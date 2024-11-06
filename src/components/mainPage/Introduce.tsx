import MainBackground from "@images/mainBackground.svg";
import localFont from "next/font/local";
import SearchBar from "../common/searchbar";
import MainSvg1 from "@images/mainSvg1.svg";
import MainSvg2 from "@images/mainSvg2.svg";
import ForkKnife from "@images/forkKnife.svg";
import Image from "next/image";

const yangjin = localFont({
  src: "../../app/fonts/양진체v0.9_otf.otf",
  variable: "--font-yangjin",
  display: "swap"
});

const Introduce = () => {
  return (
    <div
      className="h-auto"
      style={{
        backgroundImage: `url(${MainBackground.src})`
      }}
    >
      <div className={`h-[580px] w-full max-w-[1440px] bg-no-repeat ${yangjin.variable}`}>
        <div className="flex justify-between px-[13.125rem] pt-[6.5rem]">
          <div className="flex flex-col">
            <h2 className="font-yangjin mt-1 w-[23.45rem] text-[3rem] font-medium leading-[120%] tracking-[-0.24px] text-Gray-900">
              요리 초보를 위한, 집밥도감
            </h2>
            <p className="mb-[3.75rem] mt-6 w-[23.45rem] text-title-20">
              단계별로 레시피에 도전하며 요리 실력을 키우고, 다른 유저들과 레시피를 공유해보세요!
            </p>
            <SearchBar />
          </div>
          <Image src={MainSvg1} alt="메인페이지 이미지1" className="-mt-8" />
        </div>
      </div>
      <div className="mt-[4rem] flex justify-center gap-[4rem]">
        <Image src={MainSvg2} alt="메인페이지 이미지2" />
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <Image src={ForkKnife} alt="포크, 칼 아이콘" />
            <h3 className="font-yangjin text-[2.25rem] font-medium text-Primary-300">단계별 레시피 경험치를 쌓아요</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduce;
