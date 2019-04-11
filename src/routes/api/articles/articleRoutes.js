import { Router } from 'express';
import validate from '../../../middlewares/validator/index';
import authenticator from '../../../middlewares/authorization';
import articleController from './articleController';
import searchArticles from './searchArticles';
import rating from './rateArticleController';

const { createArticle, getArticlesByPage } = articleController;
const {
  validateArticle, validateArticleSearch, validateArticleRating, validateGetArticleRating
} = validate;
const { rateArticleHandler, getRatings } = rating;

const articleRoute = Router();

articleRoute.post('/', authenticator, validateArticle, createArticle);
articleRoute.get('/search', validateArticleSearch, searchArticles);

articleRoute.get('/', getArticlesByPage);

articleRoute.post('/rating', authenticator, validateArticleRating, rateArticleHandler);
articleRoute.get('/rating/:articleId', authenticator, validateGetArticleRating, getRatings);

export default articleRoute;
