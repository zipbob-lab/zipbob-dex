import { fetchRecipeData } from "@/app/api/fetchRecipeData";
import RecipeCard from "@/components/RecipeCard";
import { Recipe } from "@/types/Recipe";

export default async function Home() {
  const data = await fetchRecipeData();
  const recipes = data.COOKRCP01.row.slice(0, 5); //5개만 썰어와

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">요리 5개만 불러와보자</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe: Recipe, index: number) => (
          <RecipeCard
            key={index}
            recipe={{
              id: recipe.id,
              RCP_NM: recipe.RCP_NM,
              ATT_FILE_NO_MAIN: recipe.ATT_FILE_NO_MAIN,
              ATT_FILE_NO_MK: recipe.ATT_FILE_NO_MK
            }}
          />
        ))}
      </div>
    </div>
  );
}
