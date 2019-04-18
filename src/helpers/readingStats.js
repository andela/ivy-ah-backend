import db from '../models';

const { ReadArticles } = db;

const addToReadArticles = async (articleId, readerId) => {
  await ReadArticles.findOrCreate({
    where: { articleId, readerId }
  });
};

export default addToReadArticles;
