/* eslint-disable require-jsdoc */
import db from '../../../models';

const {
  articles, Sequelize, comment
} = db;
const { Op } = Sequelize;

class Notifications {
  static async commentNotifications(id) {
    const comments = await articles.findAll({
      where: { author: id },
      include: {
        model: comment,
        where: {
          createdAt: { [Op.gt]: Sequelize.col('authorLastSeen') },
          author: { [Op.ne]: id },
        }
      }
    });
    return comments;
  }

  /**
   * get all comment notifications
   * @static
   * @param {Request} req request object
   * @param {Response} res response object
   * @param {Function} next next fucntion
   * @memberof Notifications
   * @returns {void} void
   */
  static async getCommentNotifications(req, res, next) {
    try {
      const comments = await Notifications.commentNotifications(req.user.id);

      res.status(200).send({ status: 200, data: comments });
    } catch (error) {
      next(error);
    }
  }

  static async clear(options) {
    await articles.update({ authorLastSeen: new Date().toISOString() }, {
      where: { ...options },
    });
  }

  /**
   * clear comment notifications
   * @static
   * @param {Request} req request object
   * @param {Response} res response object
   * @param {Function} next next fucntion
   * @memberof Notifications
   * @returns {void} void
   */
  static async clearCommentNotifications(req, res, next) {
    try {
      const id = req.params.articleId ? {
        id: req.params.articleId
      } : {};

      const options = { author: req.user.id, ...id };

      await Notifications.clear(options);

      res.status(200).send({ status: 200, message: 'notifications cleared' });
    } catch (error) {
      next(error);
    }
  }
}

export default Notifications;
