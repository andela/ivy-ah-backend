import express from 'express';
import notifications from './notificationsController';
import authenticator from '../../../middlewares/authorization';

const router = express.Router();

router.get('/comments', authenticator, notifications.getCommentNotifications);

router.patch('/comments/clear', authenticator, notifications.clearCommentNotifications);

router.patch('/comments/clear/:articleId', authenticator, notifications.clearCommentNotifications);

export default router;
