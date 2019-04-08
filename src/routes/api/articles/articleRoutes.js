import { Router } from 'express';
import validate from '../../../middlewares/validator/index';
import authenticator from '../../../middlewares/authorization';
import articleController from './articleController';

const { validateArticle } = validate;
const { createArticle } = articleController;
const articleRoute = Router();

articleRoute.post('/', authenticator, validateArticle, createArticle);

export default articleRoute;
