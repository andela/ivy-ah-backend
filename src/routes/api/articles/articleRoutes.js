import { Router } from 'express';
import validate from '../../../middlewares/validator/index';
import authenticator from '../../../middlewares/authorization';
import articleController from './articleController';

const { validateArticle, validateArticleRating } = validate;
const { createArticle, rateArticle } = articleController;
const articleRoute = Router();

articleRoute.post('/', authenticator, validateArticle, createArticle);

articleRoute.post('/rating', validateArticleRating, rateArticle);

export default articleRoute;
