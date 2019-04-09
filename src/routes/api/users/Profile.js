import db from '../../../models';
/**
 *
 * contains static methods for getting user profile
 * @class User
 */
class Profile {
/**
   * method for handling get user profile
   * @param {Request} request
   * @param {Request} response
   * @returns {void} void
   * @memberof User
   */
  static async getAProfile(request, response) {
    try {
      const { email } = request.params;
      const user = await db.user.findByPk(email, { attributes: ['email', 'bio', 'image'] });
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

export default Profile;
