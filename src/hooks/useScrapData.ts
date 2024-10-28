import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/supabase/supabase";
import { useScrapStore } from "@/store/scrapStore";
import { getUserId } from "@/serverActions/profileAction";
import { useEffect } from "react";

// 폴더 목록을 가져오는 함수
const fetchFolders = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase.from("SCRAP_TABLE").select("folder_name").eq("user_id", userId);

  if (error) throw new Error(error.message);

  // 중복 폴더 이름 제거
  return Array.from(new Set(data.map((item) => item.folder_name)));
};

// 특정 레시피가 이미 스크랩되었는지 확인하는 함수
const isAlreadyScrapped = async (recipeId: string, userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("SCRAP_TABLE")
    .select("scrap_id")
    .eq("scrap_id", recipeId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return data && data.length > 0;
};

// 레시피의 스크랩 수를 가져오는 함수
const fetchRecipeScrapCount = async (recipeId: string): Promise<number> => {
  const { data, error } = await supabase.from("TEST_TABLE").select("scrap_count").eq("post_id", recipeId).single();

  if (error) throw new Error(error.message);
  return data?.scrap_count || 0;
};

// 스크랩 데이터 가져오기 함수
const fetchScraps = async (userId: string): Promise<Scrap[]> => {
  const { data, error } = await supabase.from("SCRAP_TABLE").select("*").eq("user_id", userId);
  if (error) throw new Error(error.message);
  return data || [];
};

// 스크랩 데이터 삭제 함수
const deleteScrapDB = async (recipeId: string, userId: string): Promise<void> => {
  const { error } = await supabase.from("SCRAP_TABLE").delete().eq("scrap_id", recipeId).eq("user_id", userId);

  if (error) throw new Error(error.message);
};

interface Scrap {
  scrap_id: string;
  folder_name: string;
  scraped_recipe: string;
  created_at: string;
  updated_at: string;
}

interface UseScrapData {
  existingFolders: string[] | undefined;
  scraps: Scrap[] | undefined;
  refetchFolders: () => void;
  refetchScraps: () => void;
  incrementScrapCount: (recipeId: string) => Promise<boolean>;
  saveScrap: (params: { recipeId: string; folderName: string }) => Promise<boolean>;
  deleteScrap: (recipeId: string) => Promise<boolean>;
  useFetchScrapCount: (recipeId: string) => UseQueryResult<number>;
}

// useScrapData 훅 정의
export const useScrapData = (): UseScrapData => {
  const { userId, setUserId } = useScrapStore();
  const queryClient = useQueryClient();

  // userId 초기화
  useEffect(() => {
    if (!userId) {
      getUserId()
        .then((id) => setUserId(id))
        .catch((error) => console.error("사용자 ID 설정 오류:", error));
    }
  }, [userId, setUserId]);

  // 폴더 목록 쿼리
  const { data: existingFolders, refetch: refetchFolders } = useQuery({
    queryKey: ["folders", userId],
    queryFn: () => fetchFolders(userId as string),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000
  });

  // 스크랩 데이터 쿼리
  const { data: scraps, refetch: refetchScraps } = useQuery({
    queryKey: ["scraps", userId],
    queryFn: () => fetchScraps(userId as string),
    enabled: !!userId
  });

  // 개별 레시피 스크랩 수를 위한 커스텀 훅
  const useFetchScrapCount = (recipeId: string) =>
    useQuery({
      queryKey: ["scrapCount", recipeId],
      queryFn: () => fetchRecipeScrapCount(recipeId),
      enabled: !!recipeId
    });

  // 스크랩 수 증가를 위한 mutation
  const { mutateAsync: incrementScrapCount } = useMutation({
    mutationFn: async (recipeId: string) => {
      const currentCount = await fetchRecipeScrapCount(recipeId);
      const newCount = currentCount + 1;

      const { error } = await supabase.from("TEST_TABLE").update({ scrap_count: newCount }).eq("post_id", recipeId);

      if (error) throw new Error(error.message);

      queryClient.setQueryData(["scrapCount", recipeId], newCount);
      return true;
    }
  });

  // 스크랩 삭제 mutation
  const { mutateAsync: deleteScrap } = useMutation({
    mutationFn: async (recipeId: string) => {
      if (!userId) throw new Error("로그인 된 사용자가 없습니다.");
      await deleteScrapDB(recipeId, userId);

      const currentCount = await fetchRecipeScrapCount(recipeId);
      const newCount = currentCount > 0 ? currentCount - 1 : 0;

      const { error } = await supabase.from("TEST_TABLE").update({ scrap_count: newCount }).eq("post_id", recipeId);
      if (error) throw new Error(error.message);

      queryClient.setQueryData(["scraps", userId], newCount);
      queryClient.setQueryData(["scrapCount", recipeId], newCount);
      return true;
    }
  });

  // 스크랩 저장 mutation
  const { mutateAsync: saveScrap } = useMutation({
    mutationFn: async ({ recipeId, folderName }: { recipeId: string; folderName: string }) => {
      if (!userId) throw new Error("로그인 된 사용자가 없습니다.");

      const alreadyScrapped = await isAlreadyScrapped(recipeId, userId);
      if (alreadyScrapped) {
        alert("이미 스크랩 한 레시피입니다.");
        return false;
      }

      const { data: recipeData, error: fetchError } = await supabase
        .from("TEST_TABLE")
        .select("*")
        .eq("post_id", recipeId)
        .single();

      if (fetchError) throw new Error(fetchError.message);

      const { error: insertError } = await supabase.from("SCRAP_TABLE").insert({
        user_id: userId,
        scrap_id: recipeId,
        folder_name: folderName,
        scraped_recipe: JSON.stringify(recipeData),
        created_at: new Date(),
        updated_at: new Date()
      });

      if (insertError) throw new Error(insertError.message);

      await incrementScrapCount(recipeId);
      refetchFolders();
      return true;
    }
  });

  return {
    existingFolders,
    scraps,
    refetchFolders,
    refetchScraps,
    incrementScrapCount,
    saveScrap,
    deleteScrap,
    useFetchScrapCount
  };
};