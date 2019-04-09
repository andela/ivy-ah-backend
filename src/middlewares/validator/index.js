import validator from './validator';

/**
 * contains static methods for validation user inputs
 * @class validate
 */
class validate {
  /**
   * middleware for handling login data validation
   * passes over duty to next middleware on success or sends
   * an error response otherwise
   * @param {Request} req request object
   * @param {Response} res response object
   * @param {function} next called on successful validation
   * @memberof validate
   * @returns {void} void
   */
  static userLogin(req, res, next) {
    validator(req.body, 'userLogin').then(() => next())
      .catch(error => res.status(422).json({
        status: 422,
        error,
      }));
  }

  /**
   * middleware for handling signup data validation
   * passes over duty to next middleware on success or sends
   * an error response otherwise
   * @param {Request} req request object
   * @param {Response} res response object
   * @param {function} next called on successful validation
   * @memberof validate
   * @returns {void} void
   */
  static userSignup(req, res, next) {
    validator(req.body, 'userSignup').then(() => next())
      .catch(error => res.status(422).json({
        status: 422,
        error,
      }));
  }

  /**
   * middleware for handling requesting password reset
   * passes over duty to next middleware on success or sends
   * an error response otherwise
   * @param {Request} req request object
   * @param {Response} res response object
   * @param {function} next called on successful validation
   * @memberof validate
   * @returns {void} void
   */
  static forgotPassword(req, res, next) {
    validator(req.body, 'forgotPassword').then(() => next())
      .catch(error => res.status(422).json({
        status: 422,
        error,
      }));
  }

  /**
   * middleware for handling requesting password reset
   * passes over duty to next middleware on success or sends
   * an error response otherwise
   * @param {Request} req request object
   * @param {Response} res response object
   * @param {function} next called on successful validation
   * @memberof validate
   * @returns {void} void
   */
  static resetPassword(req, res, next) {
    validator(req.body, 'resetPassword').then(() => next())
      .catch(error => res.status(422).json({
        status: 422,
        error,
      }));
  }

  /**
 *  middleware for handling validation on article creation
 * @static
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @return { void }
 * @memberof validate
 */
  static validateArticle(req, res, next) {
    validator(req.body, 'articles').then(() => next())
      .catch(error => res.status(422).json({
        status: 422,
        error,
      }));
  }

  /**
  *  middleware for handling validation on article search
  * @static
  * @param {Request} req request object
  * @param {Response} res response object
  * @param {Next} next called on validation success
  * @return {void} void
  * @memberof validate
  */
  static validateArticleSearch(req, res, next) {
    validator(req.body, 'articleSearch').then(() => next())
      .catch(error => res.status(422).json({
        status: 422, error,
      }));
  }
}

export default validate;
