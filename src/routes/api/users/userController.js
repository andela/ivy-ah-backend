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
}
export default Users;
