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
      <div className="mx-auto mt-[3.25rem] flex justify-center gap-[16.4375rem]">
        <div className="flex w-[40.9375rem] flex-col justify-center">
          <h2 className="font-wiggle text-[3rem] text-main-54 text-Primary-400">더 맛있는 요리를 더 재미있게!</h2>
          <p className="mb-[3.25rem] mt-7 w-[32.5rem] text-body-20">
            쉬운 레시피부터 어려운 레시피까지 다양하게 도전하며 레벨업해요. 즐거운 요리 경험이 당신을 기다리고있어요!
          </p>
          <SearchBar mainSearchBar={true} />
        </div>
        <div className="relative h-[32.5rem] w-[36.875rem]">
          <Image src={MainSvg1} alt="메인페이지 이미지1" />
        </div>
      </div>
      <div className="relative flex w-full justify-center gap-[5.875rem] rounded-[3.75rem] bg-[#F7F7F7] py-16">
        <div className="relative h-[19.5rem] w-[40rem]">
          <Image src={MainSvg2} alt="메인페이지 이미지2" />
        </div>
        <div className="flex max-w-[18.125rem] flex-col justify-center gap-6">
          <h3 className="font-wiggle text-main-30 text-[#834D27]">당신을 위한 집밥도감</h3>
          <p className="text-body-20 text-gray-600">
            다른 유저들이 공유한 레시피를 찾아 함께 만들어 보고,
            <br />
            나만의 특별한 레시피도 등록해 봐요!
          </p>
          <button
            className="rounded-2xl bg-Primary-300 py-4 transition hover:bg-Primary-400"
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
        <div className="absolute -bottom-10 -right-3 h-[6.5rem] w-[8.125rem]">
          <Image src={Tomatoes} alt="토마토 아이콘" />
        </div>
      </div>
    </>
  );
};

export default Introduce;
