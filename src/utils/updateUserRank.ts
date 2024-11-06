import { supabase } from "@/supabase/supabase";

// 경험치에 따라 레벨을 반복적으로 업데이트하는 함수
export const updateUserLevel = async (userId: string) => {
  try {
    const { data: userData, error: userError } = await supabase
      .from("USER_TABLE")
      .select("user_exp, user_rank")
      .eq("user_id", userId)
      .single();

    if (userError || !userData) {
      console.error("사용자 데이터 불러오기 실패", userError?.message);
      return;
    }

    const { user_exp } = userData;
    let { user_rank } = userData;

    const { data: rankData, error: rankError } = await supabase
      .from("RANK_TABLE")
      .select("rank_base, exp")
      .lte("exp", user_exp) // user_exp 이하의 exp를 가져오기
      .order("exp", { ascending: false }) // exp 기준 내림차순으로 정렬
      .limit(1); // 가장 높은 exp 기준 한 개만 가져오기

    if (rankError || !rankData) {
      console.log("레벨 기준 데이터 불러오기 실패", rankError?.message);
      return; // 조건에 맞는 레벨 기준이 없으면 종료
    }
    const { rank_base } = rankData[0];

    //현재 레벨과 DB 레벨 비교
    if (user_rank !== rank_base) {
      user_rank = rank_base;
      const { error: updateError } = await supabase.from("USER_TABLE").update({ user_rank }).eq("user_id", userId);

      if (updateError) {
        console.log("USER_TABLE 업데이트 오류", updateError.message);
      } else {
        console.log("USER_TABLE 업데이트 성공", { user_exp, user_rank });
      }
    }
  } catch (error) {
    console.error("레벨 업데이트 중 오류 발생:", error);
  }
};
