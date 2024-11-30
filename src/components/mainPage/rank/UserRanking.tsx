import { UserRankingProps } from "@/types/main";
import UserCard from "./UserCard";
import UserCardSkeleton from "./UserCardSkeleton";

const UserRanking = ({ userRanking }: { userRanking: UserRankingProps[] }) => {
  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:gap-0">
      {!userRanking
        ? Array(3)
            .fill(0)
            .map((_, index) => <UserCardSkeleton key={index} rank={index + 1} />)
        : userRanking?.map((user, index) => <UserCard key={user.user_id} user={user} rank={index + 1} />)}
    </div>
  );
};

export default UserRanking;
