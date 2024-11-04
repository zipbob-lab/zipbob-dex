import { useEffect, useState } from "react";
import { updateUserRank } from "@/utils/updateUserRank"; // 레벨 랭킹 계산 함수
import { fetchUserProfile } from "@/serverActions/profileAction"; // 유저 정보 받아오기

interface UserRankProps {
  userId: string;
}

const levelEmojis: { [key: number]: string } = {
  0: "🌱",
  1: "🪺",
  2: "🥚",
  3: "🐣",
  4: "🐥",
  5: "🐓"
};

const UserRank: React.FC<UserRankProps> = ({ userId }) => {
  const [userExp, setUserExp] = useState(0);
  const [userRank, setUserRank] = useState(0);

  useEffect(() => {
    const loadRankData = async () => {
      await updateUserRank(userId);
      const updatedProfile = await fetchUserProfile();
      if (updatedProfile) {
        setUserExp(updatedProfile.user_exp);
        setUserRank(updatedProfile.user_rank);
      }
    };
    loadRankData();
  }, [userId]);

  const levelEmoji: string = levelEmojis[userRank] || "🧑🏻‍🍳";
  const progressPercent: number = userExp % 100;

  return (
    <div className="w-full text-center">
      <p className="text-lg">{levelEmoji}</p>
      <div className="mt-2 h-2 w-full rounded-full bg-orange-300">
        <div className="h-2 rounded-full bg-orange-400" style={{ width: `${progressPercent}%` }}></div>
      </div>
      <p className="mt-2">{progressPercent}/100 경험치</p>
    </div>
  );
};

export default UserRank;
