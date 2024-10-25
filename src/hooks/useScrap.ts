import { supabase } from "@/supabase/supabase";
import { useEffect, useState } from "react";
import { Recipe } from "@/types/Recipe";
import { getUserId } from "@/serverActions/profileAction";

export const useScrap = () => {
  const [folderName, setFolderName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [existingFolders, setExistingFolders] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

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

  // 레시피 스크랩 함수
  const saveScrap = async (recipe: Recipe) => {
    if (!userId) {
      console.error("로그인 된 사용자가 없습니다.");
      return;
    }
    setIsSaving(true);

    // 새 폴더와 레시피를 저장
    const { error } = await supabase.from("SCRAP_TABLE").insert({
      user_id: userId,
      scrap_id: crypto.randomUUID(),
      folder_name: folderName,
      scraped_recipe: JSON.stringify(recipe),
      created_at: new Date(),
      updated_at: new Date()
    });

    if (error) {
      console.error("스크랩 저장 오류:", error.message);
    } else {
      alert("스크랩이 저장되었습니다.");
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

  return {
    folderName,
    setFolderName,
    isSaving,
    saveScrap,
    existingFolders
  };
};
