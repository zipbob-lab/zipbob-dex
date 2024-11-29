import { LikeRankingProps, UserNicknames } from "@/types/main";
import { useEffect, useState } from "react";
import { getUserNickname } from "@/serverActions/profileAction";
import LikeCard from "./LikeCard";
import LikeCardSkeleton from "./LikeCardSkeleton";

const LikeRanking = ({ likeRanking }: { likeRanking: LikeRankingProps[] }) => {
  const [userNickname, setUserNickname] = useState<UserNicknames>({
    0: "",
    1: "",
    2: ""
  });

  useEffect(() => {
    const fetchUserNicknames = async () => {
      if (!likeRanking) return;
      const userNicknames = await Promise.all(likeRanking.slice(0, 3).map((post) => getUserNickname(post.user_id)));
      setUserNickname(
        userNicknames.reduce((acc, nickname, index) => {
          acc[index] = nickname;
          return acc;
        }, {})
      );
    };
    fetchUserNicknames();
  }, [likeRanking]);

  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:gap-0">
      {!likeRanking
        ? Array(3)
            .fill(0)
            .map((_, index) => <LikeCardSkeleton key={index} rank={index + 1} />)
        : likeRanking?.map((post, index) => (
            <LikeCard key={post.id} post={post} userNickname={userNickname[index]} rank={index + 1} />
          ))}
    </div>
  );
};

export default LikeRanking;
