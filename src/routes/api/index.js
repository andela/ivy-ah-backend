import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../../documentation.json';
import usersRoute from './users/usersRoute';
import articleRoute from './articles/articleRoutes';

const router = express.Router();

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use('/users', usersRoute);
router.use('/articles', articleRoute);

module.exports = router;
