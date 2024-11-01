"use client";

import { useState } from "react";
import UserRanking from "./UserRanking";
import LikeRanking from "./LikeRanking";

const Ranking = () => {
  const [showUserRanking, setShowUserRanking] = useState(false);

  return (
    <>
      <div className="mt-5 flex gap-10 mb-5">
        <button
          onClick={() => setShowUserRanking(false)}
          className={`${showUserRanking ? `text-black` : `text-yellow-300`}`}
        >
          좋아요한 레시피
        </button>
        <button
          onClick={() => setShowUserRanking(true)}
          className={`${showUserRanking ? `text-yellow-300` : `text-black`}`}
        >
          랭킹 유저
        </button>
      </div>
      {showUserRanking ? (
        <UserRanking showUserRanking={showUserRanking} />
      ) : (
        <LikeRanking showUserRanking={showUserRanking} />
      )}
    </>
  );
};

export default Ranking;
