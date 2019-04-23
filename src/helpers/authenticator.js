import jwt from 'jsonwebtoken';
/**
 * Handles jwt signing and verification
 * @class authenticator
 */
class authenticator {
  /**
   * signs and generates a jwt token from a payload using either the
   * provided key or JWT_SECRET
   * @param {Payload} payload payload to be signed
   * @param {String} key secret key to be used for signing, defaults to JWT_SECRET
   * @param {Options} options jwt standard options
   * @returns {String} jwt token
   * @memberof authenticator
   */
  static generateToken(payload, key = process.env.JWT_SECRET) {
    return jwt.sign(payload, key);
  }

  /**
   * verify a jwt secret using either the provided key or JWT_SECRET
   * @param {String} token jwt token to be verified
   * @param {String} key secret key to be used for verification, defaults to JWT_SECRET
   * @returns {String} payload
   * @throws a jwt error object on verification failure
   * @memberof authenticator
   */
  static verifyToken(token, key = process.env.JWT_SECRET) {
    try {
      const payload = jwt.verify(token, key);
      return payload;
    } catch (error) {
      throw error;
    }
  }
}

export default authenticator;
