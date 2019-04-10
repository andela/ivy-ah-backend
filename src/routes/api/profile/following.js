import db from '../../../models/index';
import { sendFollowingNotification } from '../../../socket/sendNotification';

/**
 * Following Controller
 * @class Following
 */
class Following {
  /**
   * A method for following a user
   * @static
   * @param {request} req - Request
   * @param {response} res - Response
   * @param {function} next
   * @returns {void}
   * @memberof Following
   */
  static async followUser(req, res, next) {
    try {
      const { authorId } = req.params;
      const followerId = req.user.id;
      if (authorId === followerId) {
        return res.status(409).json({
          status: 409,
          error: 'You cannot follow yourself',
        });
      }
      const newFollowing = await db.followings.findOrCreate({
        where: { authorId, followerId, }
      });
      const [, isCreated] = newFollowing;
      if (isCreated) {
        res.status(201).json({
          status: 201,
          message: 'You have successfully followed the author',
          data: [{
            authorId,
            followerId
          }]
        });
        sendFollowingNotification({ authorId, followerId }, 'follow');
        return;
      }
      res.status(409).json({
        status: 409,
        error: 'You are already following the author'
      });
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(404).json({
          status: 404,
          error: 'The Author does not exist',
        });
      }
      return next();
    }
  }

  /**
   * A method for unfollowing a user
   * @static
   * @param {request} req - Request
   * @param {response} res - Response
   * @param {function} next
   * @returns {void}
   * @memberof Following
   */
  static async unfollowUser(req, res, next) {
    try {
      const { authorId } = req.params;
      const followerId = req.user.id;
      const removeFollowing = await db.followings.destroy({
        where: { authorId, followerId }
      });
      if (removeFollowing) {
        res.status(200).json({
          status: 200,
          message: 'You have successfully unfollowed the author',
          data: [{
            authorId,
            followerId
          }]
        });
        sendFollowingNotification({ authorId, followerId }, 'unfollow');
        return;
      }
      return res.status(404).json({
        status: 404,
        error: 'You are not following this author'
      });
    } catch (error) {
      return next();
    }
  }

  /**
   * A method for getting the followers of a user
   * @static
   * @param {request} req - Request
   * @param {response} res - Response
   * @param {function} next
   * @returns {void}
   * @memberof Following
   */
  static async getUserFollowers(req, res, next) {
    try {
      const { authorId } = req.params;
      let followers = await db.followings.findAll({
        where: { authorId },
        attributes: [],
        include: [
          {
            model: db.users,
            as: 'follower',
            attributes: ['id', 'username', 'firstname', 'lastname', 'bio', 'image'],
          },
        ],
      });
      followers = followers.map(follower => follower.follower);
      return res.status(200).json({
        status: 200,
        data: [{
          authorId,
          followers,
          count: followers.length,
        }],
      });
    } catch (error) {
      return next();
    }
  }

  /**
   * A method for getting the authors a user is following
   * @static
   * @param {request} req - Request
   * @param {response} res - Response
   * @param {function} next
   * @returns {void}
   * @memberof Following
   */
  static async getUserFollowing(req, res, next) {
    try {
      const { followerId } = req.params;
      let followings = await db.followings.findAll({
        where: { followerId },
        attributes: [],
        include: [
          {
            model: db.users,
            as: 'author',
            attributes: ['username', 'firstname', 'lastname', 'bio', 'image'],
          },
        ],
      });
      followings = followings.map(following => following.author);
      return res.status(200).json({
        status: 200,
        data: [{
          followerId,
          following: followings,
          count: followings.length,
        }],
      });
    } catch (error) {
      return next();
    }
  }
}

export const {
  followUser, getUserFollowers, unfollowUser, getUserFollowing
} = Following;
