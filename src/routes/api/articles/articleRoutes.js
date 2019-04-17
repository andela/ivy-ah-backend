import { Router } from 'express';
import validate from '../../../middlewares/validator/index';
import authenticator from '../../../middlewares/authorization';
import articleController from './articleController';
import searchArticles from './searchArticles';
import rating from './rateArticleController';
import likeController from './likeController';
import reportArticles from './reportArticles';
import { postComment, getComment } from './commentController';

const { createArticle, getArticlesByPage, deleteSpecificArticle } = articleController;
const {
  validateArticle, validateArticleSearch, validateArticleRating, validateGetArticleRating,
  validateArticleLikes, validateReportArticles, validateDeleteArticles
} = validate;
const { rateArticleHandler, getRatings } = rating;

const articleRoute = Router();

articleRoute.post('/', authenticator, validateArticle, createArticle);
articleRoute.get('/search', validateArticleSearch, searchArticles);
articleRoute.put('/likes/:articleId/:option', authenticator, validateArticleLikes, likeController);
articleRoute.post('/:articlesId/comments', authenticator, validate.comment, postComment);
articleRoute.get('/:articlesId/comments', getComment);
articleRoute.post('/:parentCommentsId/comments/reply', authenticator, validate.comment, postComment);
articleRoute.get('/:parentCommentsId/comments/reply', getComment);


articleRoute.get('/', getArticlesByPage);

articleRoute.post('/rating', authenticator, validateArticleRating, rateArticleHandler);
articleRoute.get('/rating/:articleId', authenticator, validateGetArticleRating, getRatings);
articleRoute.post('/report', authenticator, validateReportArticles, reportArticles.report);
articleRoute.delete('/:articleId', authenticator, validateDeleteArticles, deleteSpecificArticle);
articleRoute.get('/report', authenticator, reportArticles.getReported);

articleRoute.delete('/report/:articleId', authenticator, reportArticles.clearReported);

export default articleRoute;
