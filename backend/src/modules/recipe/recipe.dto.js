// [backend/src/modules/recipe/recipe.dto.js]

/**
 * Lọc dữ liệu Recipe để làm sạch output cho Frontend
 */
export const RecipeResponseDTO = (recipe) => {
  if (!recipe) return null;

  // Xử lý làm phẳng danh sách các bước nấu ăn (Flatten instructions)
  let steps = [];
  if (recipe.steps && Array.isArray(recipe.steps)) {
    steps = recipe.steps;
  } else if (recipe.analyzedInstructions && Array.isArray(recipe.analyzedInstructions)) {
    // Spoonacular gộp các nhóm bước vào analyzedInstructions
    steps = recipe.analyzedInstructions.flatMap(instruction => instruction.steps || []);
  }

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
    steps: steps, // Bây giờ luôn là một mảng phẳng các { number, step }
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
