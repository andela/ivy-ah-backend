/**
 * this takes string of words as input and calculates
 * the time it takes to read the article in seconds
 * @param {string} article
 * @returns {number} readtime
 */
const calculateReadTime = (article) => {
  const averageWordsPerMinute = 280;

  const numberOfWords = article.match(/\b[-'?(\w+)]+/gi).length;

  const readtime = Math.round((numberOfWords / averageWordsPerMinute) * 60);
  return readtime;
};

export default calculateReadTime;
