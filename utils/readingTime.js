module.exports = (text) => {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  return `${time} min read`;
};