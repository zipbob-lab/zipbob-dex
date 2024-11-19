import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase/supabase";

interface UserRankData {
  user_exp: number;
  user_rank: number;
}

interface RankData {
  rank_base: number;
  exp: number;
}

// 사용자 데이터 가져오기
const fetchUserData = async (userId: string): Promise<UserRankData> => {
  const { data, error } = await supabase
    .from("USER_TABLE")
    .select("user_exp, user_rank")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    throw new Error(error.message || "사용자 데이터를 가져올 수 없습니다.");
  }
  return data;
};

// 랭킹 기준 데이터 가져오기
const fetchRankData = async (userExp: number): Promise<RankData | null> => {
  const { data, error } = await supabase
    .from("RANK_TABLE")
    .select("rank_base, exp")
    .lte("exp", userExp)
    .order("exp", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    throw new Error(error?.message || "랭킹 기준 데이터를 가져올 수 없습니다.");
  }
  return data[0];
};

// 사용자 랭킹 업데이트
const updateUserRank = async ({ userId, userRank }: { userId: string; userRank: number }) => {
  const { error } = await supabase.from("USER_TABLE").update({ user_rank: userRank }).eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
};

export const useUserLevel = (userId: string) => {
  const queryClient = useQueryClient();

  // 사용자 데이터 가져오기
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["userData", userId],
    queryFn: () => fetchUserData(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchInterval: false
  });

  // 랭킹 데이터 가져오기
  const { data: rankData, isLoading: isRankLoading } = useQuery({
    queryKey: ["rankData", userData?.user_exp],
    queryFn: () => fetchRankData(userData!.user_exp),
    enabled: !!userData?.user_exp,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchInterval: false
  });

  // 사용자 레벨 업데이트
  const { mutate: updateRank } = useMutation({
    mutationFn: updateUserRank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData", userId] });
    }
  });

  // 사용자 랭킹 비교 및 업데이트
  const checkAndUpdateRank = () => {
    if (userData && rankData && userData.user_rank !== rankData.rank_base) {
      updateRank({ userId, userRank: rankData.rank_base });
    }
  };

  return {
    userData,
    rankData,
    isLoading: isUserLoading || isRankLoading,
    checkAndUpdateRank
  };
};
