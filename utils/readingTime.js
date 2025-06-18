// utils/readingTime.js

/**
 * Estimate reading time based on word count.
 * Assumes 200 words per minute reading speed.
 * 
 * @param {string} text - The blog body text.
 * @returns {string} - Estimated reading time, e.g. "2 mins read"
 */
const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const noOfWords = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(noOfWords / wordsPerMinute);
  return `${minutes} min${minutes > 1 ? 's' : ''} read`;
};

module.exports = calculateReadingTime;
