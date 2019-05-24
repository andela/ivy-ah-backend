import db from '../../../models';

const { bookmark, articles, users } = db;
/**
 *contains static methods for adding, removing
 *and getting bookmarks
 * @class Bookmarks
 */
class Bookmark {
  /**
   *method to handle adding bookmarks
   *to articles
   * @static
   * @param {Request} req object
   * @param {Response} res object
   * @param {Function} next function
   * @returns {void} void
   * @memberof Bookmark
   */
  static async addBookmark(req, res, next) {
    const { article } = req.body;
    try {
      const bookmarks = await bookmark.create({
        user: req.user.id,
        article
      });
      return res.status(201).json({
        status: 201,
        bookmarks

      });
    } catch (err) {
      // Errorcode for Sequelize fkey constraint = 23503
      if (err.parent.code === '23503') {
        return res.status(404).json({
          status: 404,
          error: 'Article not found'
        });
      }
      // Error code for Sequelize unique constraint = 23505
      if (err.parent.code === '23505') {
        return res.status(409).json({
          status: 409,
          message: 'You have already bookmarked this article'
        });
      }
      next(err);
    }
  }

  /**
 *method to handle removing bookmarks from
 *articles
 * @static
 * @param {Request} req object
 * @param {Response} res object
 * @param {Function} next function
 * @returns {void} void
 * @memberof Bookmark
 */
  static async removeBookmark(req, res, next) {
    const { article } = req.body;
    const user = req.user.id;
    try {
      const bookmarks = await bookmark.destroy({
        where: { user, article }
      });
      if (bookmarks < 1) {
        return res.status(404).json({
          status: 404,
          error: 'Article not found'
        });
      }
      return res.status(200).json({
        status: 200,
        message: 'Bookmark removed'
      });
    } catch (err) {
      next(err);
    }
  }

  /**
 *method to handle getting all bookmarks for
 *a particular user
 * @static
 * @param {Request} req object
 * @param {Response} res object
 * @param {Function} next function
 * @returns {void} void
 * @memberof Bookmarks
 */
  static async getBookmarks(req, res, next) {
    const user = req.user.id;
    try {
      const { count, rows } = await bookmark.findAndCountAll({
        attributes: ['article'],
        include: {
          model: articles,
          as: 'articleDetail',
          include: {
            model: users,
            attributes: ['firstname', 'lastname', 'image']
          }
        },
        where: { user },
        order: [['createdAt', 'DESC']]
      });
      return res.status(200).json({
        status: 200,
        bookmarks: rows,
        count
      });
    } catch (err) {
      next(err);
    }
  }
}

export default Bookmark;
