import { useEffect, useState } from "react";
import { updateUserLevel } from "@/utils/updateUserRank";
import { fetchUserProfile } from "@/serverActions/profileAction";

interface UserLevelProps {
  userId: string;
  onRankChange: (rank: number) => void;
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
    <div className="h-3 w-full rounded-full bg-white">
      <div className="h-3 rounded-full bg-Primary-300" style={{ width: `${progressPercent}%` }}></div>
    </div>
  );
};

export default UserLevel;
