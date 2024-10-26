import { Recipe } from "@/types/Recipe";
import ScrapButton from "./common/button/ScrapButton";

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  return (
    <div>
      {recipe.recipe_img_done && (
        <img
          src={recipe.recipe_img_done}
          alt={recipe.recipe_title}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}

      <h3 className="text-lg font-semibold mb-2">{recipe.recipe_title}</h3>

      <ScrapButton postId={recipe.post_id} />
    </div>
  );
};

export default RecipeCard;
