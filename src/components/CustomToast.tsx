import { useRouter } from "next/navigation";

const CustomToast = ({ closeToast }: { closeToast: () => void }) => {
  const router = useRouter();

  const moveToScrapPage = () => {
    closeToast();
    router.push("/scraps");
  };
  return (
    <div className=" flex justify-between items-center">
      <p className="text-white">스크랩 되었습니다.</p>
      <div className="flex gap-2 justify-end">
        <button onClick={moveToScrapPage} className="text-orange-500">
          스크랩 보기
        </button>
      </div>
    </div>
  );
};

export default CustomToast;
