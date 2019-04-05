import db from '../../../../models/index';
/**
 * @class Users
 */
class Users {
  /**
   * @static
   * @param {obj} req
   * @param {obj} res
   * @returns {obj} res
   * @memberof Users
   */
  static async getAllUsers(req, res) {
    const users = await db.user
      .findAll({
        attributes: { exclude: ['password'] }
      });
    return res.status(200)
      .json({
        status: 200,
        users
      });
  }
}
export default Users;
