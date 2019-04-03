import { Router } from 'express';
import articleValidator from '../../../middlewares/validator/articleValidator';
import articleController from './articleController';

const { createArticle } = articleValidator;
const { create } = articleController;
const articleRoute = Router();

articleRoute.post('/', createArticle, create);

export default articleRoute;
