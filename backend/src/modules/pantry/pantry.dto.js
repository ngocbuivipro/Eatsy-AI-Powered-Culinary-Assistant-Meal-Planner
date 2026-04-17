// [backend/src/modules/pantry/pantry.dto.js]

/**
 * Clean up Pantry response
 */
export const PantryResponseDTO = (pantry) => {
  if (!pantry) return null;

  return {
    id: pantry._id,
    userId: pantry.userId,
    items: pantry.items.map(item => ({
      id: item._id,
      spoonacularId: item.spoonacularId,
      name: item.name,
      amount: item.amount,
      unit: item.unit,
      imageUrl: item.imageUrl,
    })),
    updatedAt: pantry.updatedAt,
  };
};
