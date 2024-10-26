export type Recipe = {
  post_id: string; // Supabase의 post_id
  recipe_title: string; // 요리 제목
  recipe_ingredients: string[]; // 재료 리스트 (JSON 형태로 관리)
  recipe_img_doing: string[]; // 요리 중 이미지 리스트 (JSON 형태)
  recipe_img_done: string[]; // 완성된 요리 이미지 리스트 (JSON 형태)
  recipe_manual: string[]; // 조리법 (JSON 형태)
  recipe_type: string; // 요리 종류
  recipe_method: string; // 요리 방법
  recipe_tip: string; // 요리 팁
  recipe_kcal: number; // 칼로리 (float)
  recipe_description: string; // 요리 설명
  recipe_level: string; // 요리 난이도
  created_at: string; // 생성 날짜
  updated_at: string; // 업데이트 날짜
  creator_nickname?: string; // 생성한 사람 닉네임 필드 추가
};
