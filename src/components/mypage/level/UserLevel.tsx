import { useUserLevel } from "@/utils/updateUserRank";
import React, { useEffect } from "react";

interface UserLevelProps {
  userId: string;
  onRankChange: (rank: number) => void;
}

const UserLevel: React.FC<UserLevelProps> = ({ userId, onRankChange }) => {
  const { userData, checkAndUpdateRank, isLoading } = useUserLevel(userId);

  useEffect(() => {
    if (!isLoading) {
      checkAndUpdateRank();
      onRankChange(userData?.user_rank || 0);
    }
  }, [userData, isLoading, checkAndUpdateRank, onRankChange]);

  const progressPercent = (userData?.user_exp ?? 0) % 100;

  return (
    <div className="h-3 w-full rounded-full bg-white">
      <div className="h-3 rounded-full bg-Primary-300" style={{ width: `${progressPercent}%` }}></div>
    </div>
  );
};

export default UserLevel;
