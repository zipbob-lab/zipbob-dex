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

  const incrementScrapCount = async (recipeId: string) => {
    const { error } = await supabase
      .from("TEST_TABLE")
      .update({ scrap_count: supabase.raw("scrap_count + 1") })
      .eq("post_id", recipeId);

    if (error) {
      console.log("스크랩 카운트 오류", error.message);
    }
  };

  // 레시피 스크랩 함수
  const saveScrap = async (recipeId: string, folderName: string) => {
    // console.log("saveScrap에 전달된 recipeId:", recipeId); //uuid인지 확인
    if (!userId) {
      console.error("로그인 된 사용자가 없습니다.");
      return;
    }
    setIsSaving(true);

    const { data: recipeData, error: fetchError } = await supabase
      .from("TEST_TABLE")
      .select("*")
      .eq("post_id", recipeId)
      .single();

    // console.log("recipeData 확인", recipeData);

    if (fetchError) {
      console.error("레시피 데이터 가져오기 실패", fetchError.message);
      setIsSaving(false);
      return;
    }

    // 새 폴더와 레시피를 저장
    const { error } = await supabase.from("SCRAP_TABLE").insert({
      user_id: userId,
      scrap_id: recipeId, //test_table 속성과 동일하게 설정
      folder_name: folderName,
      scraped_recipe: JSON.stringify(recipeData),
      created_at: new Date(),
      updated_at: new Date()
    });

    if (error) {
      console.error("스크랩 저장 오류:", error.message);
    } else {
      await incrementScrapCount(recipeId);
      fetchRecipeScrapCount(recipeId);
    }
    setIsSaving(false);
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
      const { count, error } = await supabase
        .from("SCRAP_TABLE")
        .select("scraped_recipe", { count: "exact" })
        .eq("scraped_recipe", recipeId);

      if (error) {
        console.log("총 스크랩 개수를 가져오던 중 오류 발생:", error.message);
      } else {
        setScrapCounts((prev) => ({
          ...prev,
          [recipeId]: count ?? 0
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
