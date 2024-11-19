import Image from "next/image";
import MainSearch from "@images/search/mainSearch.svg";
import Subsearch from "@images/search/subSearch.svg";
import Delete from "@images/search/subDelete.svg";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface KeyInterface {
  id: number;
  text: string;
}

interface MobileSearchprops {
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileSearch = ({ setIsSearching }: MobileSearchprops) => {
  const [keywords, setKeywords] = useState<KeyInterface[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const router = useRouter();

  // 로컬 스토리지 검색어 불러오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedKeywords = localStorage.getItem("keywords");
      if (storedKeywords) {
        setKeywords(JSON.parse(storedKeywords));
      }
    }
  }, []);

  // keywords가 변경 시 로컬 스토리지 저장
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("keywords", JSON.stringify(keywords));
    }
  }, [keywords]);

  // 검색어 추가 (최대 5개 유지)
  const addKeyword = (text: string) => {
    const newKeyword = { id: Date.now(), text };
    setKeywords((prevKeywords) => {
      const updatedKeywords = [newKeyword, ...prevKeywords];
      return updatedKeywords.slice(0, 5);
    });
  };

  // 검색어 삭제
  const removeKeyword = (id: number) => {
    setKeywords((prevKeywords) => prevKeywords.filter((keyword) => keyword.id !== id));
  };

  // 모든 검색어 삭제
  const deleteKeywords = () => {
    setKeywords([]);
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // 검색 폼 작동
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim() === "") return;
    router.push(`/searchResults/${searchValue}`);
    addKeyword(searchValue);
    setSearchValue("");
    setIsSearching(false);
  };

  // 저장된 검색어 클릭 시 페이지 이동 후 창 닫기
  const handleKeywordClick = (text: string) => {
    router.push(`/searchResults/${text}`); // 페이지 이동
    setIsSearching(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white px-[1.25rem] py-[1rem]">
      <div className="p-2">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center justify-center">
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="메뉴나 재료 이름을 검색해보세요!"
            className="h-[2.5rem] w-full rounded-full border-2 border-Gray-300 px-[2.5rem] py-[0.5rem] pl-4 text-r-body-16 focus:border-Primary-300 focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          />
          <button type="submit" className="absolute right-[1rem] top-1/2 -translate-y-1/2 transform">
            <Image src={MainSearch} width={24} height={24} alt="검색 버튼" />
          </button>
        </form>
      </div>
      <div className="relative w-full">
        <div className="flex items-center justify-between px-[1rem] py-[0.5rem]">
          <h3 className="text-body-14 text-Gray-300">최근 검색어</h3>
          <button
            type="button"
            onClick={deleteKeywords}
            className="text-body-14 text-Gray-300 underline hover:bg-Gray-50"
          >
            전체 삭제
          </button>
        </div>
        <ul>
          {keywords.map((k) => (
            <li key={k.id} className="flex items-center rounded-[1.5rem] px-[1rem] py-[0.5rem] hover:bg-Gray-50">
              <div
                className="flex flex-shrink-0 flex-grow cursor-pointer items-center"
                onClick={() => handleKeywordClick(k.text)}
              >
                <Image src={Subsearch} width={16} height={16} alt="검색 아이콘" />
                <p className="ml-[0.5rem] w-full text-body-16 text-Gray-500">{k.text}</p>
              </div>
              <button type="button" onClick={() => removeKeyword(k.id)} className="text-Red-500 ml-auto text-xs">
                <Image src={Delete} width={12} height={12} alt="삭제 버튼" />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-5 flex justify-center">
        <button className="p-1" onClick={() => setIsSearching(false)}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default MobileSearch;
