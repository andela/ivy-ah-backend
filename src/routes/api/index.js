import usersRoute from './users/usersRoute';
import articleRoute from './articles/articleRoutes';
import profileRoute from './users/profileRoute';

const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../../documentation.json');

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.use('/users', usersRoute);
router.use('/profiles', profileRoute);
router.use('/articles', articleRoute);
module.exports = router;
