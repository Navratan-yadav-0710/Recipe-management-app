import { useContext } from "react";
import { RecipeContext } from "./recipe-context.js";

export function useRecipes() {
  const context = useContext(RecipeContext);

  if (!context) {
    throw new Error("useRecipes must be used inside a RecipeProvider");
  }

  return context;
}