import express from 'express';
import Profiles from './getProfile';

const profilesRouter = express.Router();

profilesRouter.get('/:id', Profiles.getAProfile);

module.exports = profilesRouter;
