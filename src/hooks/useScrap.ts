import { supabase } from "@/supabase/supabase";
import { useEffect, useState } from "react";
import { getUserId } from "@/serverActions/profileAction";

export const useScrap = () => {
  const [folderName, setFolderName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [existingFolders, setExistingFolders] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [scrapCounts, setScrapCounts] = useState<Record<string, number>>({});

  // supabase에서 로그인한 user 데이터 가져오기
  useEffect(() => {
    const fetchUserId = async () => {
      const user_id = await getUserId();
      if (user_id) {
        setUserId(user_id);
        fetchFolders(user_id);
      } else {
        console.error("로그인된 사용자가 없습니다.");
      }
    };

    fetchUserId();
  }, []);

  //중복 스크랩 막기 함수
  const isAlreadyScrapped = async (recipeId: string) => {
    const { data, error } = await supabase
      .from("SCRAP_TABLE")
      .select("scrap_id")
      .eq("scrap_id", recipeId)
      .eq("user_id", userId);

    if (error) {
      console.log("스크랩 확인 오류 발생", error.message);
      return false;
    }
    return data && data.length > 0;
  };

  // 북마크 개수 증가 함수
  const incrementScrapCount = async (recipeId: string) => {
    const { data, error: fetchError } = await supabase
      .from("TEST2_TABLE")
      .select("scrap_count")
      .eq("post_id", recipeId)
      .single();

    if (fetchError) {
      console.error("스크랩 카운트 오류", fetchError.message);
      return;
    }

    // 1 count up!!
    const currentCount = data?.scrap_count || 0;
    const newCount = currentCount + 1;

    const { error: scrapCountUpdateError } = await supabase
      .from("TEST2_TABLE")
      .update({ scrap_count: newCount })
      .eq("post_id", recipeId);

    if (scrapCountUpdateError) {
      console.error("스크랩 카운트 증가 오류:", scrapCountUpdateError.message);
    } else {
      setScrapCounts((prev) => ({ ...prev, [recipeId]: newCount }));
    }
  };

  // 레시피 스크랩 함수
  const saveScrap = async (recipeId: string, folderName: string): Promise<boolean> => {
    if (!userId) {
      console.error("로그인 된 사용자가 없습니다.");
      return false;
    }
    setIsSaving(true);

    const alreadyScrraped = await isAlreadyScrapped(recipeId);
    if (alreadyScrraped) {
      alert("이미 스크랩 한 레시피 입니다.");
      setIsSaving(false);
      return false;
    }

    const { data: recipeData, error: fetchError } = await supabase
      .from("TEST2_TABLE")
      .select("*")
      .eq("post_id", recipeId)
      .single();

    if (fetchError) {
      console.error("레시피 데이터 가져오기 실패", fetchError.message);
      setIsSaving(false);
      return false;
    }

    // 새 폴더와 레시피를 저장
    const { error } = await supabase.from("SCRAP_TABLE").insert({
      user_id: userId,
      scrap_id: recipeId, //test2_table 속성과 동일하게 설정
      folder_name: folderName,
      scraped_recipe: JSON.stringify(recipeData),
      created_at: new Date(),
      updated_at: new Date()
    });

    if (error) {
      console.error("스크랩 저장 오류:", error.message);
      return false;
    } else {
      await incrementScrapCount(recipeId);
      fetchRecipeScrapCount(recipeId);
      return true;
    }
    // setIsSaving(false);
  };

  const fetchFolders = async (user_id: string) => {
    const { data, error } = await supabase.from("SCRAP_TABLE").select("folder_name").eq("user_id", user_id);

    if (error) {
      console.error("폴더 목록 불러오기 오류:", error.message);
    } else if (data) {
      // 중복된 폴더 이름 제거
      const uniqueFolders = Array.from(new Set(data.map((item) => item.folder_name)));
      setExistingFolders(uniqueFolders);
    }
  };

  const fetchRecipeScrapCount = async (recipeId: string) => {
    try {
      const { data, error } = await supabase.from("TEST2_TABLE").select("scrap_count").eq("post_id", recipeId).single();

      if (error) {
        console.log("총 스크랩 개수를 가져오던 중 오류 발생:", error.message);
      } else if (data) {
        const count = parseInt(data.scrap_count as string, 10);
        setScrapCounts((prev) => ({
          ...prev,
          [recipeId]: isNaN(count) ? 0 : count
        }));
      }
    } catch (error) {
      console.error("스크랩 개수 조회 중 에러 발생:", error);
    }
  };

  return {
    folderName,
    setFolderName,
    isSaving,
    saveScrap,
    existingFolders,
    scrapCounts,
    fetchRecipeScrapCount
  };
};
