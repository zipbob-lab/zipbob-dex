import BookmarkButton from "@/components/common/BookmarkButton";

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Home 페이지 입니다..</h1>

      {/* 북마크 버튼 컴포넌트 사용 */}
      <BookmarkButton recipeId="recipe_1" />
    </div>
  );
}
