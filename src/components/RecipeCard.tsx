import { Recipe } from "@/types/Recipe";
// import ScrapButton from "./common/button/ScrapButton";
// import LikeButton from "./common/button/LikeButton";

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  return (
    <div>
      {recipe.recipe_img_done && (
        <img
          src={recipe.recipe_img_done}
          alt={recipe.recipe_title}
          className="mb-4 h-48 w-full rounded-md object-cover"
        />
      )}

      <h3 className="mb-2 text-lg font-semibold">{recipe.recipe_title}</h3>
      {recipe.creator_nickname || "집밥도감 마스터"}
      <div className="flex justify-end"></div>
    </div>
  );
};

export default RecipeCard;
