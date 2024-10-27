import { useRouter } from "next/navigation";

const CustomToast = ({ closeToast }: { closeToast: () => void }) => {
  const router = useRouter();

  const moveToScrapPage = () => {
    closeToast();
    router.push("/scraps");
  };
  return (
    <div>
      <p>스크랩 되었습니다.</p>
      <div className="flex gap-2 justify-end">
        <button onClick={moveToScrapPage}>스크랩 보기</button>
      </div>
    </div>
  );
};

export default CustomToast;
