// src/shared/utils/index.js

/**
 * Format a date to a human-readable string.
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  // TODO: implement
  return date.toLocaleDateString();
}

/**
 * Truncate text to a max length.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
