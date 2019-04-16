import models from '../../../models';

const { users } = models;
/**
 *
 *
 * @class Admin
 */
class Admin {
  /**
   * THis gets all administrators
   * and moderators on the system
   * @static
   * @param {obj} request
   * @param {obj} response
   * @param {function} next
   * @returns {obj} response
   * @memberof Admin
   */
  static async getAllAdminAndModerators(request, response, next) {
    try {
      const admin = await users.findAndCountAll({
        where: {
          role: ['admin', 'moderator']
        },
        attributes: { exclude: ['password'] }
      });
      return response.status(200).json({
        status: 200,
        admin: admin.rows
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * This changes the status of a user
   * @static
   * @param {obj} request
   * @param {obj} response
   * @param {function} next
   * @returns {obj} response
   * @memberof Admin
   */
  static async assignRole(request, response, next) {
    const { id } = request.params;
    const { role } = request.body;
    try {
      const [, updatedUser] = await users.update({ role }, {
        where: { id },
        returning: true,
      });
      const { password, ...user } = updatedUser[0].dataValues;
      return response.status(200).json({
        status: 200,
        user
      });
    } catch (err) {
      return next(err);
    }
  }
}

export default Admin;
