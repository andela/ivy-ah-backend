import usersRoute from './users/usersRoute';
import articleRoute from './articles/articleRoutes';

const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../../documentation.json');

router.use('/', usersRoute);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.use('/users', usersRoute);

router.use('/articles', articleRoute);
module.exports = router;
