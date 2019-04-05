import { Router } from 'express';
import articleValidator from '../../../middlewares/validator/articleValidator';
import articleController from './articleController';

const { validateArticle, validateArticleRating } = articleValidator;
const { create, rate } = articleController;
const articleRouter = Router();

articleRouter.post('/', validateArticle, create);

articleRouter.post('/rating', validateArticleRating, rate);

export default articleRouter;
