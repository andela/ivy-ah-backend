import jwt from 'jsonwebtoken';
import db from '../../../models/index';
import authenticator from '../../../helpers/authenticator';
import PasswordHasher from '../../../helpers/PasswordHasher';
import emailSender from '../../../helpers/emailSender';
import Templates from '../../../helpers/Templates';

const getPayload = async (email) => {
  try {
    const row = await db.users.findOne({
      where: { email },
      attributes: ['updatedAt', 'firstname'],
      raw: true,
    });
    if (row) {
      const { updatedAt, firstname } = row;
      const payload = `${email}${updatedAt.getTime()}`;
      return { payload, firstname: firstname || 'there' };
    }
    const err = new Error('user does not exists');
    err.status = '404';
    throw err;
  } catch (error) {
    throw error;
  }
};

/**
 *
 * contains static methods for resetting a password
 * @class PasswordReset
 */
class PasswordReset {
  /**
   * Method for handling sending request for password reset
   * @param {object} req Object
   * @param {object} res Object
   * @returns {object} Success message
   * @memberof PasswordReset
   */
  static async sendPasswordResetToken(req, res) {
    try {
      const { email } = req.body;
      const { payload, firstname } = await getPayload(email);
      const secret = payload;
      const passwordResetToken = await authenticator.generateToken({
        email
      }, secret);
      const url = `${req.protocol}://${req.get('host')}/api/v1/resetpassword`;
      const fullUrl = `${url}/${passwordResetToken}`;
      emailSender(email, 'Reset Your password', Templates.forgotPassword(fullUrl, firstname));
      return res.status(200).json({
        status: 200,
        message: 'A password reset link has been sent to your email',
        passwordResetToken
      });
    } catch (error) {
      return res.status(error.status).json({
        status: error.status,
        error: error.message
      });
    }
  }

  /**
   * Method for handling password reset
   * @param {object} req Object
   * @param {object} res Object
   * @returns {object} Success message
   * @memberof User
   */
  static async resetPassword(req, res) {
    try {
      const { password, resetToken } = req.body;
      const userData = jwt.decode(resetToken);
      if (!userData) return res.status(422).json({ status: 422, error: { resetToken: 'invalid jwt' } });
      const { email } = userData;
      const { payload, firstname } = await getPayload(email);
      const secret = payload;
      const url = `${req.protocol}://${req.get('host')}/api/v1/users/login`;
      const isVerified = await authenticator.verifyToken(resetToken, secret);
      if (isVerified) {
        const hashedPassword = await PasswordHasher.hashPassword(password);
        const row = await db.users.update({ password: hashedPassword },
          { where: { email } });
        if (row[0] === 1) {
          emailSender(email, 'Notification for a Successful Password Reset', Templates.resetPassword(url, firstname));
          return res.status(200).json({
            status: 200,
            message: 'Your password was successfully changed'
          });
        }
      }
    } catch (error) {
      if (error.message === 'invalid signature') {
        return res.status(401).json({
          status: 401,
          error: 'The password reset link has expired, kindly request for a new reset link'
        });
      }
      return res.status(500).json({
        status: 500,
        error: error.message
      });
    }
  }
}

export const { sendPasswordResetToken, resetPassword } = PasswordReset;
