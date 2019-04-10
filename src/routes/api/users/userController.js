import db from '../../../models/index';
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
      const users = await db.users
        .findAll({
          attributes: { exclude: ['password'] }
        });
      return res.status(200)
        .json({
          status: 200,
          users
        });
    } catch (err) {
      return next(err);
    }
  }
}
export default Users;
