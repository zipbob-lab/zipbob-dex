export interface UserComment {
  post_id: string;
  comment: string;
  created_at: string;
  recipe?: {
    recipe_title: string;
    recipe_img_done: string;
    recipe_level: string;
  } | null;
}

export interface UserPost {
  post_id: string;
  recipe_title: string;
  recipe_img_done: string;
  recipe_level: string;
  user: {
    user_id: string;
    user_nickname: string;
    user_img: string;
    user_introduce: string;
    user_rank: number;
  };
}
