import { createClient } from "@/supabase/server";
import Ranking from "./Ranking";

const serverClient = createClient();

export const revalidate = 60; // 60초마다 ISR

// 서버에서 UserRanking 데이터 페칭
const fetchUserRanking = async () => {
  const { data, error } = await serverClient
    .from("USER_TABLE")
    .select("user_id, user_img, user_nickname, user_introduce")
    .order("user_exp", { ascending: false })
    .limit(3);

  if (error) throw new Error("유저 랭킹 데이터를 가져오는 데 실패했습니다: " + error.message);
  return data;
};

// 서버에서 LikeRanking 데이터 페칭
const fetchLikeRanking = async () => {
  const { data, error } = await serverClient
    .from("MY_RECIPE_TABLE")
    .select("id, post_id, recipe_img_done, recipe_title, recipe_level, user_id")
    .order("like_count", { ascending: false })
    .limit(3);

  if (error) throw new Error("좋아요 랭킹 데이터를 가져오는 데 실패했습니다: " + error.message);
  return data;
};

const RankingPage = async () => {
  const [userRanking, likeRanking] = await Promise.all([fetchUserRanking(), fetchLikeRanking()]);

  return (
    <div>
      <Ranking userRanking={userRanking} likeRanking={likeRanking} />
    </div>
  );
};

export default RankingPage;
