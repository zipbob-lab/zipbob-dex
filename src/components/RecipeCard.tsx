import { Recipe } from "@/types/Recipe";
import BookmarkButton from "./common/BookmarkButton";

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  return (
    <div>
      {recipe.ATT_FILE_NO_MK && (
        <img src={recipe.ATT_FILE_NO_MK} alt={recipe.RCP_NM} className="w-1/2 h-48 object-cover rounded-md mb-4" />
      )}

      <h3>{recipe.RCP_NM}</h3>
      <BookmarkButton recipe={recipe} />
    </div>
  );
};

export default RecipeCard;
