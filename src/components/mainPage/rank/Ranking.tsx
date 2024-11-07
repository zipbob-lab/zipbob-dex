"use client";

import { useState } from "react";
import UserRanking from "./UserRanking";
import LikeRanking from "./LikeRanking";
import RankingHat from "@images/rankingHat";

const Ranking = () => {
  const [showUserRanking, setShowUserRanking] = useState(false);

  return (
    <div className="flex w-full flex-col items-center px-[5.5rem]">
      <div className="flex flex-col items-center">
        <RankingHat fillColor="#ff9143" size={40} />
        <h2 className="font-yangjin mt-2 text-[2.25rem] font-medium leading-[120%] tracking-[-0.18px] text-Primary-400">
          집밥도감 랭킹
        </h2>
      </div>
      <div className="mt-12 flex w-full justify-center">
        <button
          onClick={() => setShowUserRanking(false)}
          className={`${showUserRanking ? `text-Gray-900` : `border-b border-Primary-300 text-Primary-300`} h-[2.375rem] w-1/2 py-2 text-title-18`}
        >
          좋아요한 레시피
        </button>
        <button
          onClick={() => setShowUserRanking(true)}
          className={`${showUserRanking ? `border-b border-Primary-300 text-Primary-300` : `text-Gray-900`} h-[2.375rem] w-1/2 py-2 text-title-18`}
        >
          랭킹 유저
        </button>
      </div>
      <div className="mt-[3rem]">
        {showUserRanking ? (
          <UserRanking showUserRanking={showUserRanking} />
        ) : (
          <LikeRanking showUserRanking={showUserRanking} />
        )}
      </div>
    </div>
  );
};

export default Ranking;
