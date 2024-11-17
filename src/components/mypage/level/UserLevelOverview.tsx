import Level1 from "@images/levels/levelOneEgg.svg";
import Level2 from "@images/levels/levelTwoKimbab.svg";
import Level3 from "@images/levels/levelThreePasta.svg";
import Level4 from "@images/levels/levelFourSalmon.svg";
import Level5 from "@images/levels/levelFiveStew.svg";
import Arrow from "@images/levels/orangeArrow.svg";

import { supabase } from "@/supabase/supabase";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

interface UserLevelOverviewProps {
  userId: string;
}

const levelIcons = [Level1, Level2, Level3, Level4, Level5];

const fetchUserLevel = async (userId: string): Promise<number | null> => {
  const { data: userData, error } = await supabase
    .from("USER_TABLE")
    .select("user_rank")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("사용자 레벨 불러오기 실패", error.message);
    return null;
  }
  return userData?.user_rank ?? null;
};

const UserLevelOverview: React.FC<UserLevelOverviewProps> = ({ userId }) => {
  const {
    data: userLevel,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["userLevel", userId],
    queryFn: () => fetchUserLevel(userId),
    enabled: !!userId
  });

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <p>데이터를 불러오는 중 입니다.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center">
        <p>데이터를 불러오는 중 문제가 발생했습니다. </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      {levelIcons.map((LevelIcon, index) => (
        <div key={index} className="flex items-center">
          <div
            className="flex items-center justify-center"
            style={{
              transform: index === userLevel ? "scale(1.25)" : "scale(1)",
              filter: index !== userLevel ? "grayscale(100%)" : "none"
            }}
          >
            <Image
              src={LevelIcon.src}
              alt={`레벨 ${index}`}
              width={index === userLevel ? 45 : 32}
              height={index === userLevel ? 45 : 32}
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
