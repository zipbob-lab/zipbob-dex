import { supabase } from "@/supabase/supabase";
import { Scrap } from "@/types/Scraps";

// 폴더 목록을 가져오는 함수
export const fetchFolders = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase.from("SCRAP_TABLE").select("folder_name").eq("user_id", userId);
  if (error) throw new Error(error.message);
  return Array.from(new Set(data.map((item) => item.folder_name)));
};

// 스크랩 데이터 가져오기 함수 + 페이지네이션 추가
export const fetchScraps = async (
  userId: string,
  page: number,
  pageSize: number,
  folderName?: string
): Promise<Scrap[]> => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  // folderName 조건 추가
  const query = supabase.from("SCRAP_TABLE").select("*").eq("user_id", userId).range(start, end);
  if (folderName !== "전체" && folderName) {
    query.eq("folder_name", folderName);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data || [];
};

// 전체 스크랩 개수 가져오기 함수
export const fetchTotalScrapCount = async (userID: string): Promise<number> => {
  const { count: totalCount, error } = await supabase
    .from("SCRAP_TABLE")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userID);
  if (error) throw new Error(error.message);
  return totalCount || 0;
};

// 특정 폴더의 스크랩 개수 가져오기 함수
export const fetchFolderScrapCount = async (userId: string, folderName: string): Promise<number> => {
  const { count, error } = await supabase
    .from("SCRAP_TABLE")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("folder_name", folderName);
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
