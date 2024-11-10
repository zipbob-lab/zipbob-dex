import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase/supabase";
import { useScrapStore } from "@/store/scrapStore";
import { getUserId } from "@/serverActions/profileAction";
import { useEffect, useState } from "react";
import { Scrap, UseScrapData } from "@/types/Scraps";

// 폴더 목록을 가져오는 함수
const fetchFolders = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase.from("SCRAP_TABLE").select("folder_name").eq("user_id", userId);
  if (error) throw new Error(error.message);
  return Array.from(new Set(data.map((item) => item.folder_name)));
};

// 레시피가 이미 스크랩되었는지 확인하는 함수
const isAlreadyScrappedDB = async (recipeId: string, userId: string): Promise<boolean> => {
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
  const { data, error } = await supabase
    .from("MY_RECIPE_TABLE")
    .select("scrap_count")
    .eq("post_id", recipeId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.scrap_count || 0;
};

// 스크랩 데이터 가져오기 함수 + 페이지네이션 추가
const fetchScraps = async (userId: string, page: number, pageSize: number): Promise<Scrap[]> => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data, error } = await supabase.from("SCRAP_TABLE").select("*").eq("user_id", userId).range(start, end);
  if (error) throw new Error(error.message);
  return data || [];
};

// 현재 로그인 된 사용자의 전체 스크랩 한 레시피의 개수 -> 페이지네이션에 활용
const fetchScrapCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from("SCRAP_TABLE")
    .select("*", { count: "exact", head: true }) // head : 개수만 가져옴
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return count || 0;
};

// 스크랩 데이터 삭제 함수
const deleteScrapDB = async (recipeId: string, userId: string): Promise<void> => {
  const { error } = await supabase.from("SCRAP_TABLE").delete().eq("scrap_id", recipeId).eq("user_id", userId);
  if (error) throw new Error(error.message);
};

// useScrapData 훅 정의
export const useScrapData = (): UseScrapData => {
  const { userId, setUserId } = useScrapStore();
  const queryClient = useQueryClient();

  // 페이지네이션
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [totalScraps, setTotalScraps] = useState(0);

  useEffect(() => {
    const fetchUserId = async () => {
      if (!userId) {
        try {
          const id = await getUserId();
          setUserId(id);
        } catch (error) {
          console.error("사용자 ID 설정 오류:", error);
        }
      }
    };

    fetchUserId();
  }, [userId, setUserId]);

  // 전체 스크랩 개수 가져오는 로직
  useEffect(() => {
    if (userId) {
      const loadScrapCount = async () => {
        const count = await fetchScrapCount(userId);
        setTotalScraps(count);
      };
      loadScrapCount();
    }
  }, [userId]);

  // 폴더 목록 쿼리
  const { data: existingFolders, refetch: refetchFolders } = useQuery({
    queryKey: ["folders", userId],
    queryFn: () => fetchFolders(userId as string),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000
  });

  // 스크랩 데이터 쿼리 + 페이지네이션 적용
  const { data: scraps, refetch: refetchScraps } = useQuery<Scrap[] | undefined>({
    queryKey: ["scraps", userId, page],
    queryFn: () => fetchScraps(userId as string, page, pageSize),
    enabled: !!userId,
    placeholderData: queryClient.getQueryData(["scraps", userId, page - 1]) as Scrap[] | undefined
  });

  // 페이지 변경 함수
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 개별 레시피 스크랩 수를 위한 커스텀 훅
  const useFetchScrapCount = (recipeId: string) =>
    useQuery({
      queryKey: ["scrapCount", recipeId],
      queryFn: () => fetchRecipeScrapCount(recipeId),
      enabled: !!recipeId
    });

  // 스크랩 확인 함수
  const isAlreadyScrapped = async (recipeId: string): Promise<boolean> => {
    if (!userId) {
      console.warn("로그인 된 사용자가 없습니다.");
      return false;
    }
    return await isAlreadyScrappedDB(recipeId, userId);
  };

  // 스크랩 수 증가를 위한 mutation
  const { mutateAsync: incrementScrapCount } = useMutation({
    mutationFn: async (recipeId: string) => {
      const currentCount = await fetchRecipeScrapCount(recipeId);
      const newCount = currentCount + 1;

      const { error } = await supabase
        .from("MY_RECIPE_TABLE")
        .update({ scrap_count: newCount })
        .eq("post_id", recipeId);
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

      const { error } = await supabase
        .from("MY_RECIPE_TABLE")
        .update({ scrap_count: newCount })
        .eq("post_id", recipeId);
      if (error) throw new Error(error.message);

      queryClient.setQueryData(["scraps", userId], (oldData: Scrap[] | undefined) =>
        oldData ? oldData.filter((scrap) => scrap.scrap_id !== recipeId) : []
      );
      queryClient.setQueryData(["scrapCount", recipeId], newCount);

      alert("삭제되었습니다.");
      refetchFolders();
      refetchScraps();
      return true;
    }
  });

  // 스크랩 저장 mutation
  const { mutateAsync: saveScrap } = useMutation({
    mutationFn: async ({ recipeId, folderName }: { recipeId: string; folderName: string }) => {
      if (!userId) throw new Error("로그인 된 사용자가 없습니다.");

      const alreadyScrapped = await isAlreadyScrapped(recipeId);
      if (alreadyScrapped) {
        alert("이미 스크랩 한 레시피입니다.");
        return false;
      }

      const { data: recipeData, error: fetchError } = await supabase
        .from("MY_RECIPE_TABLE")
        .select("*")
        .eq("post_id", recipeId)
        .maybeSingle();

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
      queryClient.invalidateQueries({ queryKey: ["folders", userId] });
      queryClient.invalidateQueries({ queryKey: ["scraps", userId] });
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
    isAlreadyScrapped,
    useFetchScrapCount,
    page,
    handlePageChange,
    totalScraps
  };
};
