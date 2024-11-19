import React from "react";
import { useUserLevel } from "@/utils/updateUserRank";
import Image from "next/image";
import Level1 from "@images/levels/levelOneEgg.svg";
import Level2 from "@images/levels/levelTwoKimbab.svg";
import Level3 from "@images/levels/levelThreePasta.svg";
import Level4 from "@images/levels/levelFourSalmon.svg";
import Level5 from "@images/levels/levelFiveStew.svg";
import Arrow from "@images/levels/orangeArrow.svg";

interface UserLevelOverviewProps {
  userId: string;
}

const levelIcons = [Level1, Level2, Level3, Level4, Level5];

const UserLevelOverview: React.FC<UserLevelOverviewProps> = ({ userId }) => {
  const { userData, isLoading } = useUserLevel(userId);

  if (isLoading) {
    return <p>데이터를 불러오는 중입니다...</p>;
  }

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      {levelIcons.map((LevelIcon, index) => (
        <div key={index} className="flex items-center">
          <div
            className="flex items-center justify-center"
            style={{
              transform: index === userData?.user_rank ? "scale(1.25)" : "scale(1)",
              filter: index !== userData?.user_rank ? "grayscale(100%)" : "none"
            }}
          >
            <Image
              src={LevelIcon.src}
              alt={`레벨 ${index}`}
              width={index === userData?.user_rank ? 45 : 32}
              height={index === userData?.user_rank ? 45 : 32}
            />
          </div>
          {index < levelIcons.length - 1 && (
            <Image src={Arrow.src} alt="화살표" width={16} height={16} className="ml-2" />
          )}
        </div>
      ))}
    </div>
  );
};

export default UserLevelOverview;
