import bcrypt from 'bcrypt';
import { config } from 'dotenv';

config();
/**
 * Hash and verify hashed password
 * @class PasswordHasher
 */
class PasswordHasher {
  /**
   * Generate a hash for supplied password
   * @param {string} password - The password to be hashed
   * @param {number} salt - The number of salt rounds used to hash a password
   * @returns {string} hash
   * @memberof PasswordHasher
   */
  static hashPassword(password, salt = Number(process.env.SALT_ROUNDS)) {
    return bcrypt.hashSync(password, salt);
  }

  /**
 * Verify a hashed password
 * @param {string} password - The password to be verified
 * @param {string} hash - The hashed password
 * @returns {boolean} true if password matches the hash
 * @memberof PasswordHasher
 */
  static comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }
}

export default PasswordHasher;
