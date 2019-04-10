import db from '../../../models/index';
/**
 * @class Profiles
 */
class Profiles {
  /**
   * method for handling get user profile
   * @param {Request} request
   * @param {Request} response
   * @returns {void} void
   * @memberof User
   */
  static async getAProfile(request, response) {
    try {
      const { userid } = request.params;
      const user = await db.users.findOne({
        attributes: { exclude: ['password'] },
        where: { userid },
      });
      if (user) {
        response.status(200).json({
          status: 200,
          profile: user,
        });
      }
      if (!user) {
        response.status(404).json({
          status: 404,
          errors: 'Profile not found',
        });
      }
    } catch (err) {
      return response.status(500).json({
        status: 500,
        errors: { body: [err.message] },
      });
    }
  }
}
export default Profiles;
