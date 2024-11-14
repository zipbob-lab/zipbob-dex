import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase/supabase";
import { useScrapStore } from "@/store/scrapStore";
import { getUserId } from "@/serverActions/profileAction";
import { useEffect, useState } from "react";
import { Scrap, UseScrapData } from "@/types/Scraps";
import {
  fetchFolders,
  fetchScraps,
  fetchTotalScrapCount,
  fetchFolderScrapCount,
  deleteScrapDB,
  fetchRecipeScrapCount,
  isAlreadyScrappedDB
} from "@/serverActions/scrapActions";

// useScrapData 훅 정의
export const useScrapData = (): UseScrapData => {
  const { userId, setUserId, selectedFolder, setSelectedFolder } = useScrapStore();
  const queryClient = useQueryClient();
  const pageSize = 8;
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // 페이지네이션에 적용할 상태관리 / 전체 아이템
  const [totalScraps, setTotalScraps] = useState(0); // 전체 폴더의 레시피 개수
  const [selectedFolderTotal, setSelectedFolderTotal] = useState(0); // 현재 클릭한 폴더의 레시피 개수
  const [folderScrapCounts, setFolderScrapCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // 사용자 ID 설정
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

  // "선택된 폴더"의 총 레시피 개수를 설정
  useEffect(() => {
    const loadTotalItems = async () => {
      if (userId) {
        if (selectedFolder === "전체" || !selectedFolder) {
          const allScrapCount = await fetchTotalScrapCount(userId);
          setTotalItems(allScrapCount); // 전체 레시피 개수로 설정
        } else {
          const folderTotal = await fetchFolderScrapCount(userId, selectedFolder);
          setTotalItems(folderTotal); // 선택된 폴더의 레시피 개수로 설정
        }
      }
    };
    loadTotalItems();
  }, [userId, selectedFolder]);

  // "전체" 레시피 개수 설정
  useEffect(() => {
    const loadTotalScraps = async () => {
      if (userId) {
        const allScrapCount = await fetchTotalScrapCount(userId);
        setTotalItems(allScrapCount);

        // 각 폴더별 레시피 개수 가져오기
        const folders = await fetchFolders(userId);
        const folderCounts: { [key: string]: number } = {};

        for (const folder of folders) {
          const folderCount = await fetchFolderScrapCount(userId, folder);
          folderCounts[folder] = folderCount;
        }

        folderCounts["전체"] = allScrapCount; // 전체 개수도 저장
        setFolderScrapCounts(folderCounts);
      }
    };
    loadTotalScraps();
  }, [userId]);

  useEffect(() => {
    // 선택된 폴더의 레시피 개수 설정
    const loadSelectedFolderTotal = async () => {
      // 전체 탭이면 전체 개수를 사용
      if (selectedFolder === "전체" || !selectedFolder) {
        setSelectedFolderTotal(totalScraps);
      } else {
        // 선택된 폴더의 개수를 사용
        const folderTotal = await fetchFolderScrapCount(userId as string, selectedFolder);
        setSelectedFolderTotal(folderTotal);
      }
    };
    loadSelectedFolderTotal();
  }, [selectedFolder, totalScraps, userId]);

  const handleFolderClick = async (folder: string | null) => {
    setSelectedFolder(folder); // 폴더 변경
    setPage(1); // 페이지 초기화 - 전체 폴더로 돌아올 때 1페이지로 설정

    // 폴더 별 레시피 개수 업데이트
    const folderTotal = folder ? await fetchFolderScrapCount(userId as string, folder) : totalItems;
    setTotalItems(folderTotal);

    // 페이지네이션을 위해 데이터 리패치
    refetchScraps();
  };
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    refetchScraps();
  };

  // 폴더 목록 쿼리
  const { data: existingFolders = [], refetch: refetchFolders } = useQuery({
    queryKey: ["folders", userId],
    queryFn: () => fetchFolders(userId as string),
    enabled: !!userId
  });

  // 스크랩 데이터 쿼리 + 페이지네이션 적용
  const { data: scraps, refetch: refetchScraps } = useQuery<Scrap[] | undefined>({
    queryKey: ["scraps", userId, page, selectedFolder],
    queryFn: () => fetchScraps(userId as string, page, pageSize, selectedFolder ?? undefined),
    enabled: !!userId
  });

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

  // 삭제 기능
  const { mutateAsync: deleteScrap } = useMutation({
    mutationFn: async (recipeId: string) => {
      if (!userId) throw new Error("로그인 된 사용자가 없습니다.");

      try {
        await deleteScrapDB(recipeId, userId as string);
        // 삭제 후 개수 갱신
        const updatedTotalCount = await fetchTotalScrapCount(userId);
        const updatedFolderCount =
          selectedFolder && selectedFolder !== "전체"
            ? await fetchFolderScrapCount(userId, selectedFolder)
            : updatedTotalCount;

        // 상태 업데이트
        setTotalScraps(updatedTotalCount);
        setSelectedFolderTotal(updatedFolderCount);
        setFolderScrapCounts((prevCounts) => ({
          ...prevCounts,
          [selectedFolder ?? "전체"]: updatedFolderCount // 선택된 폴더의 개수 갱신
        }));

        // 페이지 업데이트
        const totalPages = Math.ceil(updatedFolderCount / pageSize);
        if (page > totalPages) {
          setPage(totalPages); // 현재 페이지가 전체 페이지 수보다 클 경우 마지막 페이지로 이동
        } else {
          refetchScraps();
        }
        alert("삭제되었습니다.");
        return true;
      } catch (error) {
        console.error("삭제 중 오류 발생:", error);
        return false;
      }
    }
  });

  // 스크랩 저장 mutation
  const { mutateAsync: saveScrap } = useMutation({
    mutationFn: async ({ recipeId, folderName }: { recipeId: string; folderName: string }) => {
      if (!userId) throw new Error("로그인 된 사용자가 없습니다.");

      const alreadyScrapped = await isAlreadyScrapped(recipeId);
      if (alreadyScrapped) {
        alert("이미 스크랩한 레시피입니다.");
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
    totalItems,
    refetchFolders,
    refetchScraps,
    incrementScrapCount,
    saveScrap,
    deleteScrap,
    isAlreadyScrapped,
    useFetchScrapCount,
    page,
    handlePageChange,
    totalScraps,
    selectedFolderTotal,
    folderScrapCounts,
    handleFolderClick
  };
};
