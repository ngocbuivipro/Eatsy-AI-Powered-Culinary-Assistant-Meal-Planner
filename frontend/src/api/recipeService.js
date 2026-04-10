import apiClient from './client';

/**
 * Fetch random/popular recipes by meal type
 * @param {string} type - breakfast, lunch, dinner, snack
 * @returns {Promise}
 */
export const getRandomRecipes = async (type) => {
  try {
    const response = await apiClient.get(`/recipes/random?type=${type}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    throw error;
  }
};

/**
 * Fetch recipe details by ID
 * @param {string} id 
 * @returns {Promise}
 */
export const getRecipeDetails = async (id) => {
  try {
    const response = await apiClient.get(`/recipes/${id}/details`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};
