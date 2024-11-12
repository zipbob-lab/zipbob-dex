import { supabase } from "@/supabase/supabase";
import { Scrap } from "@/types/Scraps";

// 폴더 목록을 가져오는 함수
export const fetchFolders = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase.from("SCRAP_TABLE").select("folder_name").eq("user_id", userId);
  if (error) throw new Error(error.message);
  return Array.from(new Set(data.map((item) => item.folder_name)));
};

// 스크랩 데이터 가져오기 함수 + 페이지네이션 추가
export const fetchScraps = async (userId: string, page: number, pageSize: number): Promise<Scrap[]> => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data, error } = await supabase.from("SCRAP_TABLE").select("*").eq("user_id", userId).range(start, end);
  if (error) throw new Error(error.message);
  return data || [];
};

// 현재 로그인 된 사용자의 전체 스크랩 한 레시피의 개수 -> 페이지네이션에 활용
export const fetchScrapCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from("SCRAP_TABLE")
    .select("*", { count: "exact", head: true }) // head : 개수만 가져옴
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return count || 0;
};

// 스크랩 데이터 삭제 함수
export const deleteScrapDB = async (recipeId: string, userId: string): Promise<void> => {
  const { error } = await supabase.from("SCRAP_TABLE").delete().eq("scrap_id", recipeId).eq("user_id", userId);
  if (error) throw new Error(error.message);
};

// 레시피가 이미 스크랩되었는지 확인하는 함수
export const isAlreadyScrappedDB = async (recipeId: string, userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("SCRAP_TABLE")
    .select("scrap_id")
    .eq("scrap_id", recipeId)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return data && data.length > 0;
};

// 레시피의 스크랩 수를 가져오는 함수
export const fetchRecipeScrapCount = async (recipeId: string): Promise<number> => {
  const { data, error } = await supabase
    .from("MY_RECIPE_TABLE")
    .select("scrap_count")
    .eq("post_id", recipeId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.scrap_count || 0;
};
