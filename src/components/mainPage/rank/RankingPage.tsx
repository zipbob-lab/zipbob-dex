import { supabase } from "@/supabase/supabase";
import Ranking from "./Ranking";

export const revalidate = 180; // 60초마다 ISR

const fetchUserRanking = async () => {
  try {
    const { data, error } = await supabase
      .from("USER_TABLE")
      .select("user_id, user_img, user_nickname, user_introduce")
      .order("user_exp", { ascending: false })
      .limit(3);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("유저 랭킹 데이터를 가져오는 데 실패했습니다:", error);
    return [];
  }
};

const fetchLikeRanking = async () => {
  try {
    const { data, error } = await supabase
      .from("MY_RECIPE_TABLE")
      .select("id, post_id, recipe_img_done, recipe_title, recipe_level, user_id")
      .order("like_count", { ascending: false })
      .limit(3);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("좋아요 랭킹 데이터를 가져오는 데 실패했습니다:", error);
    return [];
  }
};

const RankingPage = async () => {
  const [userRanking, likeRanking] = await Promise.all([fetchUserRanking(), fetchLikeRanking()]);

  if (userRanking.length === 0 && likeRanking.length === 0) {
    console.error("랭킹 데이터를 불러오지 못했습니다.");
  }

  return (
    <div>
      {userRanking.length === 0 && likeRanking.length === 0 ? (
        <p>랭킹 데이터를 불러오는 데 실패했습니다.</p>
      ) : (
        <Ranking userRanking={userRanking} likeRanking={likeRanking} />
      )}
    </div>
  );
};

export default RankingPage;
