import { useEffect, useState } from "react";
import { updateUserLevel } from "@/utils/updateUserRank"; // 레벨 랭킹 계산 함수
import { fetchUserProfile } from "@/serverActions/profileAction"; // 유저 정보 받아오기

interface UserLevelProps {
  userId: string;
  onRankChange: (rank: number) => void; // 랭크가 변경되면 호출할 함수
}

const UserLevel: React.FC<UserLevelProps> = ({ userId, onRankChange }) => {
  const [userExp, setUserExp] = useState(0);

  useEffect(() => {
    const loadRankData = async () => {
      await updateUserLevel(userId);
      const updatedProfile = await fetchUserProfile();
      if (updatedProfile) {
        setUserExp(updatedProfile.user_exp);
        onRankChange(updatedProfile.user_rank);
      }
    };
    loadRankData();
  }, [userId, onRankChange]);

  const progressPercent: number = userExp % 100;

  return (
    <div>
      <div className="my-9 w-36 rounded-full bg-white">
        <div className="h-2 rounded-full bg-Primary-300" style={{ width: `${progressPercent}%` }}></div>
      </div>
    </div>
  );
};

export default UserLevel;
