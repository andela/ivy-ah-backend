import express from 'express';
import Profiles from './getProfile';
import {
  followUser,
  getUserFollowers,
  unfollowUser,
  getUserFollowing
} from './following';
import checkToken from '../../../middlewares/authorization';

const profilesRouter = express.Router();

profilesRouter.get('/:id', Profiles.getAProfile);
profilesRouter.post('/:authorId/follow', checkToken, followUser);
profilesRouter.get('/:authorId/followers', checkToken, getUserFollowers);
profilesRouter.get('/:followerId/following', checkToken, getUserFollowing);
profilesRouter.delete('/:authorId/follow', checkToken, unfollowUser);

module.exports = profilesRouter;
