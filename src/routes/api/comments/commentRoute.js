import { Router } from 'express';
import validate from '../../../middlewares/validator/index';
import authenticator from '../../../middlewares/authorization';
import commentController from './commentController';
import reportComment from './reportComment';
import likeCommentController from './likeCommentController';

const commentRoute = Router();

const {
  postComment, getComment, updateComment, deleteComment
} = commentController;

const {
  report, clearReported, getAllReported
} = reportComment;

commentRoute.get('/report', authenticator, getAllReported);
commentRoute.post('/:articlesId', authenticator, validate.comment, postComment);
commentRoute.get('/:articlesId', getComment);
commentRoute.post('/reply/:parentCommentsId', authenticator, validate.comment, postComment);
commentRoute.get('/reply/:parentCommentsId', getComment);
commentRoute.patch('/:commentId', authenticator, validate.comment, updateComment);
commentRoute.delete('/:commentId', authenticator, deleteComment);
commentRoute.post('/report/:commentId', authenticator, report);
commentRoute.delete('/report/:reportId', authenticator, clearReported);
commentRoute.put('/likes/:commentId/:option', authenticator, validate.validateCommentLikes, likeCommentController);


export default commentRoute;
