"use client";

import { useState } from "react";
import UserRanking from "./UserRanking";
import LikeRanking from "./LikeRanking";
import Carrots from "@images/carrot.svg";
import Image from "next/image";

const Ranking = () => {
  const [showUserRanking, setShowUserRanking] = useState(false);

  return (
    <div className="relative w-full">
      <div className="mx-auto flex w-[1024px] flex-col items-center py-[6.25rem]">
        <div className="flex flex-col items-center gap-4">
          <h2 className="font-wiggle text-main-30 text-[#834D27]">집밥도감 랭킹</h2>
          <p className="text-body-18 text-Gray-600">레시피에 도전하며 요리 실력을 쌓아보세요!</p>
        </div>
        <div className="mt-9 flex w-[23.75rem] justify-center rounded-[1.25rem] bg-Gray-50">
          <button
            onClick={() => setShowUserRanking(false)}
            className={`${!showUserRanking && `bg-Primary-300`} h-[2.375rem] w-1/2 rounded-[1.25rem] py-2 transition`}
          >
            <span className={`${!showUserRanking ? `text-white` : `text-Gray-900`} text-title-16`}>
              좋아요한 레시피
            </span>
          </button>
          <button
            onClick={() => setShowUserRanking(true)}
            className={`${showUserRanking && `bg-Primary-300`} h-[2.375rem] w-1/2 rounded-[1.25rem] py-2 transition`}
          >
            <span className={`${showUserRanking ? `text-white` : `text-Gray-900`} text-title-16`}>랭킹 유저</span>
          </button>
        </div>
        <div className="mt-[3.75rem] w-full">
          {showUserRanking ? (
            <UserRanking showUserRanking={showUserRanking} />
          ) : (
            <LikeRanking showUserRanking={showUserRanking} />
          )}
        </div>
      </div>
      <div className="absolute -bottom-16 left-0">
        <Image src={Carrots} alt="당근 아이콘" />
      </div>
    </div>
  );
};

export default Ranking;
