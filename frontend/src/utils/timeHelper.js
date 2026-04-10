/**
 * Returns the meal type based on the current hour of the day
 * @returns {string} breakfast, lunch, dinner, or snack
 */
export const getMealTypeByTime = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 11) {
    return 'breakfast';
  } else if (hour >= 11 && hour < 15) {
    return 'lunch';
  } else if (hour >= 17 && hour < 22) {
    return 'dinner';
  } else {
    // Default to main course or snacks for other times
    return 'main course';
  }
};

/**
 * Returns a friendly greeting based on the current time
 * @returns {string}
 */
export const getTimeGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
};
