import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../../documentation.json';
import usersRoute from './users/usersRoute';
import profilesRouter from './profile/profilesRoutes';
import articleRoute from './articles/articleRoutes';
import bookmarkRoute from './bookmarks/bookmarkRoute';
import adminRoute from './admin/adminRoute';
import commentRoute from './comments/commentRoute';
import readingStatsRoute from './readingStats/readingStatsRoute';
import notificationsRoute from './notifications/notificationsRoute';

const router = express.Router();

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use('/users', usersRoute);
router.use('/profiles', profilesRouter);
router.use('/articles', articleRoute);
router.use('/admin', adminRoute);
router.use('/comments', commentRoute);
router.use('/reading-statistics', readingStatsRoute);
router.use('/notifications', notificationsRoute);
router.use('/bookmarks', bookmarkRoute);

module.exports = router;
