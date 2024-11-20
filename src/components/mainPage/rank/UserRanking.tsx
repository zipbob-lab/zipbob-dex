import { supabase } from "@/supabase/supabase";
import { useQuery } from "@tanstack/react-query";
import { UserRankingProps } from "@/types/main";
import UserCard from "./UserCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const UserRanking = ({ showUserRanking }: UserRankingProps) => {
  const fetchUserRanking = async () => {
    const { data, error } = await supabase
      .from("USER_TABLE")
      .select("*")
      .order("user_exp", { ascending: false })
      .limit(3);

    if (error) {
      console.error("유저 랭킹을 불러오는 과정에서 에러 발생" + error);
    }

    return data;
  };

  const {
    data: users,
    isPending: isUserPending,
    isError: isUserError
  } = useQuery({
    queryKey: ["userRanking"],
    queryFn: fetchUserRanking,
    enabled: showUserRanking,
    staleTime: 0
  });

  if (isUserPending) {
    return <LoadingSpinner />;
  }

  if (isUserError) {
    return <div>유저 랭킹을 가져오는 도중 에러가 발생했습니다</div>;
  }

  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:gap-0">
      {users?.map((user, index) => <UserCard key={user.user_id} user={user} rank={index + 1} />)}
    </div>
  );
};

export default UserRanking;
