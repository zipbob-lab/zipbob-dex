import Level1 from "@images/levels/levelOneEgg.svg";
import Level2 from "@images/levels/levelTwoKimbab.svg";
import Level3 from "@images/levels/levelThreePasta.svg";
import Level4 from "@images/levels/levelFourSalmon.svg";
import Level5 from "@images/levels/levelFiveStew.svg";

import { updateUserLevel } from "@/utils/updateUserRank";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabase";
import Image from "next/image";

interface UserLevelOverviewProps {
  userId: string;
}

const levelIcons = [Level1, Level2, Level3, Level4, Level5];

const UserLevelOverview: React.FC<UserLevelOverviewProps> = ({ userId }) => {
  const [userLevel, setUserLevel] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserLevel = async () => {
      await updateUserLevel(userId);
      const { data: userData, error } = await supabase
        .from("USER_TABLE")
        .select("user_rank")
        .eq("user_id", userId)
        .single();

      if (!error && userData) {
        setUserLevel(userData.user_rank);
      } else {
        console.log("사용자 레벨 불러오기 실패", error?.message);
      }
    };

    fetchUserLevel();
  }, [userId]);

  return (
    <div className="flex items-center justify-center gap-x-6 pt-4">
      {levelIcons.map((LevelIcon, index) => (
        <div
          key={index}
          className={"flex items-center justify-center"}
          style={{
            transform: index === userLevel ? "scale(1.25)" : "scale(1)",
            filter: index !== userLevel ? "grayscale(100%)" : "none"
          }}
        >
          <Image
            src={LevelIcon.src}
            alt={`레벨 ${index}`}
            width={index === userLevel ? 48 : 32}
            height={index === userLevel ? 48 : 32}
          />
        </div>
      ))}
    </div>
  );
};

export default UserLevelOverview;
