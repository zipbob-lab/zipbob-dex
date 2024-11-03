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
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}

      <h3 className="text-lg font-semibold mb-2">{recipe.recipe_title}</h3>
      {recipe.creator_nickname || "집밥도감 마스터"}
      <div className="flex justify-end"></div>
    </div>
  );
};

export default RecipeCard;
