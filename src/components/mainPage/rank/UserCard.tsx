import Image from "next/image";
import DefaultImage from "@images/default-profile.svg";

interface UserCardProps {
  user: {
    user_exp: number;
    user_img: string;
    user_nickname: string;
    user_introduce: string;
  };
  rank: number;
}

const UserCard = ({ user, rank }: UserCardProps) => {
  return (
    <div>
      <div
        className={`${rank === 1 ? `bg-Primary-300` : rank === 2 ? `bg-[#ABA9A5]` : `bg-[#B6A57D]`} inline-flex items-center rounded-t-xl bg-Primary-300 px-7 py-2`}
      >
        <p className="mt-1 font-wiggle text-[1.125rem] leading-[120%] text-white">{rank}위</p>
      </div>
      <div className="flex max-w-[17rem] flex-col gap-[0.9rem] rounded-[1.25rem] p-4 shadow-[0px_4px_20px_0px_rgba(154,130,102,0.1)] md:max-w-[14.5rem] xl:max-w-[20rem]">
        <div className="relative h-[15rem] w-[15rem] md:h-[12.5rem] md:w-[12.5rem] xl:h-[18rem] xl:w-[18rem]">
          <Image
            src={user.user_img || DefaultImage}
            fill
            alt="유저 프로필 이미지"
            sizes="(min-width: 1440px) 18rem, (min-width: 768px) 12.5rem, 15rem"
            className="rounded-[1.25rem] object-cover"
          />
        </div>
        <p className="line-clamp-1 overflow-hidden text-center text-title-16 text-Gray-900 xl:text-title-18">
          {user.user_nickname}
        </p>
        <p className="line-clamp-2 h-10 overflow-hidden text-body-15 text-Gray-500">
          {user.user_introduce || "(자기소개를 등록하지 않았습니다.)"}
        </p>
      </div>
    </div>
  );
};

export default UserCard;
