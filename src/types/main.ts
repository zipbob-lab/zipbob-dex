export interface UserRankingProps {
  showUserRanking: boolean;
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
    like_count: number;
    scrap_count: number;
    recipe_level: string;
    user_id: string;
  };
}

export interface UserCardProps {
  user: {
    user_exp: number;
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
