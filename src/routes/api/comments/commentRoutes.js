import { Router } from 'express';
import validate from '../../../middlewares/validator/index';
import authenticator from '../../../middlewares/authorization';
import likeCommentController from './likeCommentController';

const { validateCommentLikes } = validate;

const commentRoute = Router();
commentRoute.put('/likes/:commentId/:option', authenticator, validateCommentLikes, likeCommentController);

export default commentRoute;
