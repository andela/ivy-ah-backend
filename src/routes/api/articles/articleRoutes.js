import { Router } from 'express';
import validate from '../../../middlewares/validator/index';
import articleController from './articleController';

const { createArticle } = validate;
const { create } = articleController;
const articleRoute = Router();

articleRoute.post('/', createArticle, create);

export default articleRoute;
