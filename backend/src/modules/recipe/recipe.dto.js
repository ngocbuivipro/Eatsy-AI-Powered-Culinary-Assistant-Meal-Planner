// [backend/src/modules/recipe/recipe.dto.js]

/**
 * Lọc dữ liệu Recipe để làm sạch output cho Frontend
 */
export const RecipeResponseDTO = (recipe) => {
  if (!recipe) return null;

  return {
    id: recipe._id || recipe.id,
    title: recipe.title,
    description: recipe.description || recipe.summary,
    imageUrl: recipe.imageUrl || recipe.image,
    prepTime: recipe.prepTime || recipe.readyInMinutes,
    cookTime: recipe.cookTime || 0,
    servings: recipe.servings,
    difficulty: recipe.difficulty || "medium",
    mealType: recipe.mealType || [],
    ingredients: recipe.ingredients || recipe.extendedIngredients || [],
    steps: recipe.steps || recipe.analyzedInstructions || [],
    nutrition: recipe.nutrition,
    author: recipe.author,
    source: recipe.source || "spoonacular",
    averageRating: recipe.averageRating || 0,
  };
};

/**
 * Trả về danh sách Recipes
 */
export const RecipeListDTO = (recipes) => {
  if (!Array.isArray(recipes)) return [];
  return recipes.map(recipe => RecipeResponseDTO(recipe));
};
