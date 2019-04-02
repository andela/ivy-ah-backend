/* eslint-disable no-prototype-builtins */
import db from '../../../models/index';
import authenticator from '../../../helpers/authenticator';
import PasswordHasher from '../../../helpers/PasswordHasher';


/**
 *
 * contains static methods for creating a user
 * @class User
 */
class User {
  /**
   * method for handling user signup
   * @param {Request} request object
   * @param {Request} response object
   * @returns {void} void
   * @memberof User
   */
  static async userSignup(request, response) {
    try {
      const {
        username,
        firstname,
        lastname,
        email,
        bio,
        image,
        password
      } = request.body;
      const hashedPassword = await PasswordHasher.hashPassword(password);
      const result = await db.user
        .create({
          username,
          firstname,
          lastname,
          email,
          bio,
          image,
          password: hashedPassword,
        });
      const token = await authenticator.generateToken({ email: result.email });
      return response.status(201).json({
        status: 201,
        user: {
          email, token, username, bio, image,
        },
      });
    } catch (err) {
      return response.status(409).json({
        status: 409,
        errors: { body: [err.message] },
      });
    }
  }
}
const { userSignup } = User;
export default userSignup;
