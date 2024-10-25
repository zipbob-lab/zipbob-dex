"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabase";
import { getUserId } from "@/serverActions/profileAction";

type Scrap = {
  scrap_id: string;
  folder_name: string;
  scraped_recipe: string;
  created_at: string;
  updated_at: string;
};

const ScrapPage = () => {
  const [scraps, setScraps] = useState<Scrap[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [folders, setFolders] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const user_id = await getUserId();
      if (user_id) {
        setUserId(user_id);
        fetchScraps(user_id);
      } else {
        console.log("로그인 된 사용자가 없습니다.");
      }
    };

    const fetchScraps = async (user_id: string) => {
      const { data, error } = await supabase.from("SCRAP_TABLE").select("*").eq("user_id", user_id);

      if (error) {
        console.error("스크랩 데이터를 불러오는 중 오류:", error.message);
      } else {
        setScraps(data);

        const uniqueFolders = Array.from(new Set(data.map((scrap: Scrap) => scrap.folder_name)));
        setFolders(uniqueFolders);
      }
    };

    fetchUserId();
  }, []);

  const handleFolderClick = (folder: string | null) => {
    setSelectedFolder(folder);
  };

  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mt-8 mb-4">스크랩한 레시피</h2>

        {/* 폴더명 리스트*/}

        <div className="mb-6">
          <button
            onClick={() => handleFolderClick(null)}
            className={`px-4 py-2 mr-2 mb-2 bg-yellow-500 text-white rounded-full ${
              selectedFolder === null ? "bg-yellow-500" : ""
            }`}
          >
            전체
          </button>
          {folders.map((folder) => (
            <button
              key={folder}
              onClick={() => handleFolderClick(folder)}
              className={`px-4 py-2 mr-2 mb-2 bg-orange-500 text-white rounded-full ${
                selectedFolder === folder ? "bg-orange-700" : ""
              }`}
            >
              {folder}
            </button>
          ))}

          {/* 해당 폴더의 레시피 리스트*/}

          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scraps
                .filter((scrap) => selectedFolder === null || scrap.folder_name === selectedFolder)
                .map((scrap) => {
                  const recipeDetail = JSON.parse(scrap.scraped_recipe);

                  return (
                    <div key={scrap.scrap_id}>
                      {recipeDetail.ATT_FILE_NO_MAIN && (
                        <img
                          src={recipeDetail.ATT_FILE_NO_MAIN}
                          alt={recipeDetail.RCP_NM}
                          className="w-1/2 h-48 object-cover rounded-md mb-4"
                        />
                      )}
                      <h4>{recipeDetail.RCP_NM}</h4>
                      <p>만든사람 닉네임 들어갑니다</p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScrapPage;
