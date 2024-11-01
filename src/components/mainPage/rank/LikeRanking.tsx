import { supabase } from "@/supabase/supabase";
import { UserRankingProps } from "@/types/main";
import { useQuery } from "@tanstack/react-query";
import RecipeCard from "./RecipeCard";

const LikeRanking = ({ showUserRanking }: UserRankingProps) => {
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("TEST2_TABLE")
      .select("*")
      .order("like_count", { ascending: false })
      .limit(3);

    if (error) {
      console.error("게시글을 불러오는 과정에서 에러 발생" + error);
    }

    return data;
  };

  const {
    data: posts,
    isPending: isPostPending,
    isError: isPostError
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    enabled: !showUserRanking,
    staleTime: 60
  });

  if (isPostPending) {
    return <div>좋아요 랭킹을 가져오는중입니다</div>;
  }

  if (isPostError) {
    return <div>좋아요 랭킹을 가져오는 도중 에러가 발생했습니다</div>;
  }
  console.log(posts);

  return <div className="flex gap-5">{posts?.map((post) => <RecipeCard key={post.id} post={post} />)}</div>;
};

export default LikeRanking;
