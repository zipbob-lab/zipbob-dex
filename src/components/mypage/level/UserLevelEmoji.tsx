import Level1 from "@images/levels/levelOneEgg.svg";
import Level2 from "@images/levels/levelTwoKimbab.svg";
import Level3 from "@images/levels/levelThreePasta.svg";
import Level4 from "@images/levels/levelFourSalmon.svg";
import Level5 from "@images/levels/levelFiveStew.svg";
import Master from "@images/levels/hat.svg";
import Image from "next/image";

interface UserLevelEmojiProps {
  userRank: number;
}

const UserLevelEmoji: React.FC<UserLevelEmojiProps> = ({ userRank }) => {
  const getLevelImage = () => {
    switch (userRank) {
      case 0:
        return Level1;
      case 1:
        return Level2;
      case 2:
        return Level3;
      case 3:
        return Level4;
      case 4:
        return Level5;
      case 5:
        return Master;
      default:
        return null;
    }
  };

  const levelImage = getLevelImage();

  return (
    <span className="text-xl">
      {levelImage ? <Image src={levelImage.src} alt={`레벨 ${userRank}`} width={24} height={24} /> : Master}
    </span>
  );
};

export default UserLevelEmoji;
