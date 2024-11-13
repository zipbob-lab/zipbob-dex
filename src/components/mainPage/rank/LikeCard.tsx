import Image from "next/image";
import { useRouter } from "next/navigation";
import FireFilledIcon from "@images/fireFilled.svg";
import FireEmptyIcon from "@images/fireEmpty.svg";
import LikeButton from "@/components/common/button/LikeButton";
import ScrapButton from "@/components/common/button/ScrapButton";
import { RecipeCardProps } from "@/types/main";

interface LikeCardProps extends RecipeCardProps {
  userNickname: string;
  rank: number;
}

const LikeCard = ({ post, userNickname, rank }: LikeCardProps) => {
  const router = useRouter();

  return (
    <div>
      <div
        className={`inline-flex items-center rounded-t-xl ${rank === 1 ? `bg-Primary-300` : rank === 2 ? `bg-[#ABA9A5]` : `bg-[#B6A57D]`} px-7 py-2`}
      >
        <p className="mt-1 font-wiggle text-[1.125rem] leading-[120%] text-white">{rank}위</p>
      </div>
      <div
        className="flex cursor-pointer flex-col gap-3 rounded-[1.25rem] p-4 shadow-[0px_4px_20px_0px_rgba(154,130,102,0.1)]"
        onClick={() => router.push(`/myrecipedetail/${post?.post_id}`)}
      >
        <div className="relative h-[18rem] w-[18rem]">
          <Image
            src={post?.recipe_img_done}
            fill
            alt="레시피 이미지"
            sizes="18rem"
            className="rounded-[1.25rem] object-cover"
          />
        </div>
        <div>
          <p className="text-title-18 text-Gray-900">{post?.recipe_title}</p>
          <p className="mt-1 h-[1.125rem] text-[0.875rem] font-medium leading-[130%] text-Gray-500">{userNickname}</p>
          <div className="mt-3 flex justify-between">
            <div className="flex">
              <Image src={FireFilledIcon} alt="레시피 난이도" className="h-auto w-auto" />
              <Image
                src={post?.recipe_level !== "하" ? FireFilledIcon : FireEmptyIcon}
                alt="레시피 난이도"
                className="h-auto w-auto"
              />
              <Image
                src={post?.recipe_level === "상" ? FireFilledIcon : FireEmptyIcon}
                alt="레시피 난이도"
                className="h-auto w-auto"
              />
            </div>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <LikeButton postId={post?.post_id} />
              <ScrapButton postId={post?.post_id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikeCard;