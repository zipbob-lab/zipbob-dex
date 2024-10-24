"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabase";

type Scrap = {
  scrap_id: string;
  folder_name: string;
  scraped_recipe: string;
  created_at: string;
  updated_at: string;
};

const ScrapPage = () => {
  const [scraps, setScraps] = useState<Scrap[]>([]);
  useEffect(() => {
    const fetchScraps = async () => {
      const { data, error } = await supabase
        .from("SCRAP_TABLE")
        .select("*")
        .eq("user_id", "12fc1c2d-f564-4510-9aac-635b1345b3ca"); // 나중에 로그인된 user_id로 대체

      if (error) {
        console.error("스크랩 데이터를 불러오는 중 오류:", error.message);
      } else {
        setScraps(data);
      }
    };

    fetchScraps();
  }, []);

  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mt-8 mb-4">스크랩한 레시피</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scraps.map((scrap) => (
            <div key={scrap.scrap_id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-bold">{scrap.scraped_recipe}</h3>
              <p className="text-gray-600">폴더: {scrap.folder_name}</p>
              <p className="text-gray-500 text-sm">저장일: {new Date(scrap.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ScrapPage;
