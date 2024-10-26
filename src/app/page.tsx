import { fetchRecipeDbData } from "@/serverActions/fetchRecipeDataFromSupabase";
import RecipeCard from "@/components/RecipeCard";
import { Recipe } from "@/types/Recipe";

export default async function Home() {
  const data = await fetchRecipeDbData();
  const recipes = data?.slice(0, 10);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">요리 10개만 불러와보자</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes?.map((recipe: Recipe) => <RecipeCard key={recipe.post_id} recipe={recipe} />)}
      </div>
    </div>
  );
}
