import { Recipe } from "@/types/Recipe";
import ScrapButton from "./common/button/ScrapButton";
import Image from "next/image";

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  return (
    <div>
      {recipe.recipe_img_done && (
        <Image
          src={recipe.recipe_img_done}
          alt={recipe.recipe_title}
          className="w-full h-48 object-cover rounded-md mb-4"
          unoptimized
        />
      )}

      <h3 className="text-lg font-semibold mb-2">{recipe.recipe_title}</h3>

      {/* post_id를 ScrapButton에 전달하여 각 레시피별 스크랩 가능 */}
      <ScrapButton postId={recipe.post_id} />
    </div>
  );
};

export default RecipeCard;
