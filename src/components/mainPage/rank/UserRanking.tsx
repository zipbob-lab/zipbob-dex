import { supabase } from "@/supabase/supabase";
import { useQuery } from "@tanstack/react-query";
import UserCard from "./UserCard";
import { UserRankingProps } from "@/types/main";

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
    staleTime: 60
  });

  if (isUserPending) {
    return <div>유저 랭킹을 가져오는중입니다</div>;
  }

  if (isUserError) {
    return <div>유저 랭킹을 가져오는 도중 에러가 발생했습니다</div>;
  }

  return <div className="flex gap-5">{users?.map((user) => <UserCard key={user.user_id} user={user} />)}</div>;
};

export default UserRanking;
