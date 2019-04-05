import { Router } from 'express';
import validate from '../../../middlewares/validator/index';
import authenticator from '../../../middlewares/authorization';
import articleController from './articleController';
import searchArticles from './searchArticles';

const { validateArticle, validateArticleSearch } = validate;
const { createArticle } = articleController;

const articleRoute = Router();

articleRoute.post('/', authenticator, validateArticle, createArticle);

articleRoute.get('/search', validateArticleSearch, searchArticles);

export default articleRoute;
