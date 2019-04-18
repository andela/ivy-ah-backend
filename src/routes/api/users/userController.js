import db from '../../../models/index';

const { articles } = db;
/**
 * @class Users
 */
class Users {
  /**
   * @static
   * @param {obj} req
   * @param {obj} res
   * @param {function} next
   * @returns {obj} res
   * @memberof Users
   */
  static async getAllUsers(req, res, next) {
    try {
      const limit = req.query.limit ? req.query.limit : 30;
      const offset = req.query.page ? limit * (req.query.page - 1) : 0;
      const currentPage = req.query.page ? req.query.page : 1;
      const { count, rows } = await db.users
        .findAndCountAll({
          offset,
          limit,
          attributes: { exclude: ['password'] }
        });
      const numberOfPages = limit ? (Math.ceil(count / limit)) : 1;
      return res.status(200)
        .json({
          status: 200,
          numberOfPages,
          numberOfUsers: count,
          currentPage,
          users: rows
        });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * method for handling updating
   * @param {Request} req
   *  @param {Res} res
   * @param {Response} next sends the error to the global error handler
   * @returns {void} void
   * @memberof User
   */
  static async updateUser(req, res, next) {
    try {
      const { id } = req.user;
      const [, data] = await db.users.update(req.body, { where: { id }, returning: true });
      const {
        isVerified, isSubscribed, role, email, bio, image, createdAt, updatedAt,
        username, firstname, lastname
      } = data[0].dataValues;

      return res.status(200).json({
        status: 200,
        user: {
          isVerified,
          isSubscribed,
          role,
          email,
          bio,
          image,
          createdAt,
          updatedAt,
          username,
          firstname,
          lastname
        }
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
 *
 * this function gets all articles created by a specific
 * user
 * @static
 * @param {Request} req request object
 * @param {Response} res response object
 * @param {Next} next called if there is an error
 * @memberof Users
 * @return { void }
 */
  static async getUserArticles(req, res, next) {
    try {
      const limit = req.query.limit ? req.query.limit : 30;
      const offset = req.query.page ? limit * (req.query.page - 1) : 0;
      const currentPage = req.query.page ? req.query.page : 1;
      const { count, rows } = await articles
        .findAndCountAll({
          offset,
          limit,
          where: { author: req.user.id },
          attributes: { exclude: ['author'] },
        });
      const pageCount = limit ? (Math.ceil(count / limit)) : 1;
      return res.status(200)
        .json({
          status: 200,
          pageCount,
          articleCount: count,
          currentPage,
          articles: rows
        });
    } catch (error) {
      return next(error);
    }
  }
}
export default Users;
