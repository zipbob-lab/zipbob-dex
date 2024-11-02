import Image from "next/image";
import React from "react";

type UserCardProps = {
  user: {
    user_exp: number;
    user_img: string;
    user_nickname: string;
  };
};

const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="flex flex-col gap-3">
      <Image src={user.user_img} alt="유저 프로필사진" width={120} height={120} />
      <p className="text-center">{user.user_nickname}</p>
      <p className="text-center">{user.user_exp}</p>
    </div>
  );
};

export default UserCard;
