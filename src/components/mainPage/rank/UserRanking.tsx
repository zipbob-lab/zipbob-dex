import { supabase } from "@/supabase/supabase";
import { useQuery } from "@tanstack/react-query";
import { UserRankingProps } from "@/types/main";
import Image from "next/image";
import RankingHat from "@images/rankingHat";
import DefaultImage from "@images/default-profile.svg";

const UserRanking = ({ showUserRanking }: UserRankingProps) => {
  const fetchUserRanking = async () => {
    const { data, error } = await supabase
      .from("USER_TABLE")
      .select("*")
      .order("user_exp", { ascending: false })
      .limit(3);

    if (error) {
      console.error("유저 랭킹을 불러오는 과정에서 에러 발생" + error);
    }

    return data;
  };

  const {
    data: users,
    isPending: isUserPending,
    isError: isUserError
  } = useQuery({
    queryKey: ["userRanking"],
    queryFn: fetchUserRanking,
    enabled: showUserRanking,
    staleTime: 60
  });

  if (isUserPending) {
    return <div>유저 랭킹을 가져오는중입니다</div>;
  }

  if (isUserError) {
    return <div>유저 랭킹을 가져오는 도중 에러가 발생했습니다</div>;
  }

  return (
    <div className="flex items-end gap-[1.75rem]">
      <div>
        <div className="ml-[1.375rem] inline-flex items-center rounded-t-[1.75rem] bg-Primary-300 px-12 py-3">
          <RankingHat fillColor="white" size={36} />
          <p className="mt-1 font-yangjin text-[1.875rem] font-medium leading-[120%] text-white">1위</p>
        </div>
        <div className="rounded-3xl p-4 shadow-[0px_4px_20px_0px_rgba(154,130,102,0.1)]">
          <div className="relative h-[20.5rem] w-[20.5rem]">
            <Image
              src={users?.[0].user_img || DefaultImage}
              fill
              alt="유저 프로필 이미지"
              className="rounded-3xl object-cover"
            />
          </div>
          <p className="mt-5 text-center text-title-20 text-Gray-900">{users?.[0].user_nickname}</p>
          <p className="mt-4 line-clamp-2 h-10 overflow-hidden text-body-15 text-Gray-500">
            {users?.[0].user_introduce || "(자기소개를 등록하지 않았습니다.)"}
          </p>
        </div>
      </div>

      <div>
        <div className="ml-[1.3125rem] inline-flex items-center rounded-t-3xl bg-Gray-300 px-[1.375rem] py-2">
          <RankingHat fillColor="white" size={32} />
          <p className="mt-1 font-yangjin text-[1.25rem] font-medium leading-[120%] text-white">2위</p>
        </div>
        <div className="rounded-3xl px-3 py-4 shadow-[0px_4px_20px_0px_rgba(154,130,102,0.1)]">
          <div className="relative h-[17.5rem] w-[17.5rem]">
            <Image src={users?.[1].user_img || DefaultImage} fill alt="유저 프로필 이미지" className="rounded-3xl" />
          </div>
          <p className="mt-4 text-center text-title-18 text-Gray-900">{users?.[1].user_nickname}</p>
          <p className="mt-4 line-clamp-2 h-9 overflow-hidden text-body-14 text-Gray-500">
            {users?.[1].user_introduce || "(자기소개를 등록하지 않았습니다.)"}
          </p>
        </div>
      </div>

      <div>
        <div className="ml-[1.3125rem] inline-flex items-center rounded-t-3xl bg-[#B6A57D] px-[1.375rem] py-2">
          <RankingHat fillColor="white" size={32} />
          <p className="mt-1 font-yangjin text-[1.25rem] font-medium leading-[120%] text-white">3위</p>
        </div>
        <div className="rounded-3xl px-3 py-4 shadow-[0px_4px_20px_0px_rgba(154,130,102,0.1)]">
          <div className="relative h-[17.5rem] w-[17.5rem]">
            <Image src={users?.[2].user_img || DefaultImage} fill alt="유저 프로필 이미지" className="rounded-3xl" />
          </div>
          <p className="mt-4 text-center text-title-18 text-Gray-900">{users?.[2].user_nickname}</p>
          <p className="mt-4 line-clamp-2 h-9 overflow-hidden text-body-14 text-Gray-500">
            {users?.[2].user_introduce || "(자기소개를 등록하지 않았습니다.)"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRanking;
