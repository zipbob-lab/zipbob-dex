export interface UserRankingProps {
  user_id: string;
  user_img: string;
  user_nickname: string;
  user_introduce: string;
}

export interface PostRank {
  post_count: number;
  post_id: string;
}

export interface RecentCommentCardProps {
  comment: {
    comment: string;
    post_id: string;
    user_id: string;
    created_at: string;
  };
}

export interface RecipeCardProps {
  post: {
    post_id: string;
    recipe_img_done: string;
    recipe_title: string;
    recipe_level: string;
    user_id: string;
  };
}

export interface UserCardProps {
  user: {
    user_img: string;
    user_nickname: string;
    user_introduce: string;
  };
  rank: number;
}

export interface UserNicknames {
  [key: number]: string;
}

export interface LikeCardProps extends RecipeCardProps {
  userNickname: string;
  rank: number;
}

export interface RankingCardSkeletonProps {
  rank: number;
}

export interface LikeRankingProps {
  id: number;
  post_id: string;
  recipe_img_done: string;
  recipe_title: string;
  recipe_level: string;
  user_id: string;
}
