/**
 * Upgrades a Spoonacular recipe image URL to the highest available resolution.
 * Spoonacular serves images at multiple sizes. The default is 312x231 which
 * looks blurry on modern displays. This swaps it to 636x393.
 *
 * @param {string} imageUrl - Original image URL from Spoonacular
 * @returns {string} High-resolution image URL
 */
export const getHighResImage = (imageUrl) => {
  if (!imageUrl) return null;
  // Replace all known low-res size patterns with the highest resolution
  return imageUrl
    .replace('312x231', '636x393')
    .replace('240x150', '636x393')
    .replace('480x360', '636x393')
    .replace('556x370', '636x393');
};
