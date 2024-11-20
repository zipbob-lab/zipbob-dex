"use client";

import { useAuthStore } from "@/store/authStore";
import SearchBar from "../common/search/Searchbar";
import MainSvg1 from "@images/mainSvg1.svg";
import MainSvg2 from "@images/mainSvg2.svg";
import Tomatoes from "@images/tomato.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "zustand";

const Introduce = () => {
  const router = useRouter();
  const { isLoggedIn } = useStore(useAuthStore);

  return (
    <>
      <div className="mx-auto mt-[2rem] flex w-full flex-col-reverse items-center md:mt-[3.25rem] md:w-[46rem] md:flex-row md:justify-between lg:w-[58.75rem] xl:min-w-[85rem] xl:max-w-[93.75rem]">
        <div className="flex w-[18.8rem] flex-col justify-center md:w-[23.0625rem] lg:w-[29.2rem] xl:w-[41.3rem]">
          <h2 className="mt-10 font-wiggle text-[3rem] text-main-20 text-Primary-400 md:mt-0 md:text-main-28 lg:text-main-30 xl:text-main-54">
            더 맛있는 요리를 더 재미있게!
          </h2>
          <p className="mb-[1.5rem] mt-[1.75rem] text-body-14 md:mb-[2rem] md:text-body-18 lg:w-[29.375rem] xl:mb-[3.25rem] xl:mt-7 xl:w-[32.5rem] xl:text-body-20">
            쉬운 레시피부터 어려운 레시피까지 다양하게 도전하며 레벨업해요. 즐거운 요리 경험이 당신을 기다리고있어요!
          </p>
          <SearchBar mainSearchBar={true} />
        </div>
        <div className="relative h-[16.3rem] w-[18.7rem] md:h-[15rem] md:w-[15.71869rem] lg:h-[18rem] lg:w-[19.18756rem] xl:h-[521px] xl:w-[528px]">
          <Image src={MainSvg1} priority fill alt="메인페이지 이미지1" />
        </div>
      </div>
      <div className="relative w-full rounded-[3.75rem] bg-[#F7F7F7] py-[2.75rem] md:py-[2.81rem] xl:py-[4rem]">
        <div className="mx-auto flex flex-col items-center gap-[2rem] overflow-hidden md:flex-row md:justify-center xl:gap-[5.87rem]">
          <div className="relative h-[7.56rem] w-[15.5rem] md:h-[10.5rem] md:w-[21.5rem] lg:h-[15.6rem] lg:w-[32rem] xl:h-[19.5rem] xl:w-[40rem]">
            <Image src={MainSvg2} priority fill alt="메인페이지 이미지2" />
          </div>
          <div className="flex w-[16.3rem] flex-col justify-center gap-6 lg:w-[18.1rem]">
            <h2 className="font-wiggle text-main-20 text-[#834D27] md:text-main-24 xl:text-main-30">
              당신을 위한 집밥도감
            </h2>
            <p className="text-body-16 text-Gray-600 md:w-[16.3125rem] lg:w-[14.4rem] xl:w-[18.1rem] xl:text-body-20">
              다른 유저들이 공유한 레시피를 찾아 함께 만들어 보고,
              <br />
              나만의 특별한 레시피도 등록해 봐요.
              <br />
              레시피에 댓글을 달면 경험치를 얻어 레벨업할 수 있어요!
            </p>
            <button
              className="rounded-2xl bg-Primary-300 py-4 transition hover:bg-Primary-500 lg:w-[13.75rem] xl:w-[18.125rem]"
              onClick={() => {
                if (isLoggedIn) {
                  router.push("/myrecipewrite");
                } else {
                  alert("나만의 레시피를 작성하려면 로그인 먼저 해주세요.");
                }
              }}
            >
              <span className="text-title-18 text-white">나만의 레시피 올리기</span>
            </button>
          </div>
          <div className="absolute -bottom-10 -right-3 h-[5.375rem] w-[6.875rem] md:h-[6.5rem] md:w-[8.125rem]">
            <Image src={Tomatoes} alt="토마토 아이콘" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Introduce;
