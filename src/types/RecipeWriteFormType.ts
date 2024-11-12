import { RecipeMethodEnum } from "./RecipeMethodEnum";
import { RecipeTypeEnum } from "./RecipeTypeEnum";

export interface IFormInput {
    recipeMethod: RecipeMethodEnum;
    recipeType: RecipeTypeEnum;
    recipeTitle: string;
    recipeDescription: string;
    recipeDoneImg?: File | undefined;
    recipeDoingImgs?: { file: File | undefined }[];
    recipeDoingTexts?: { text: string }[];
    ingredients: RecipeForm[];
    recipeManual: string;
  }
  
export interface RecipeForm {
    ingredient: string;
    amount: string;
    unit: string;
  }