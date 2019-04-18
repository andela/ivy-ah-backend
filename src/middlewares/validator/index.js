import validator from './validator';

/**
 * contains static methods for validation user inputs
 * @class validate
 */
class Validate {
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
 *  middleware for handling validation on article creation
 * @static
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @return { void }
 * @memberof validate
 */
  static validateUpdateArticle(req, res, next) {
    validator(req.body, 'updateArticles').then(() => next())
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

  /**
  *  middleware for handling validation on article rating
  * @static
  * @param {Request} req request object
  * @param {Response} res response object
  * @param {Next} next called on validation success
  * @return {void} void
  * @memberof validate
  */
  static validateArticleRating(req, res, next) {
    validator(req.body, 'articleRating').then(() => next())
      .catch(error => res.status(422).json({
        status: 422, error,
      }));
  }

  /**
  *  middleware for handling validation on getting article rating
  * @static
  * @param {Request} req request object
  * @param {Response} res response object
  * @param {Next} next called on validation success
  * @return {void} void
  * @memberof validate
  */

  /**
  *  middleware for handling validation on getting article rating
  * @static
  * @param {Request} req request object
  * @param {Response} res response object
  * @param {Next} next called on validation success
  * @return {void} void
  * @memberof validate
  */
  static validateGetArticleRating(req, res, next) {
    validator(req.params, 'getArticleRating').then(() => next())
      .catch(error => res.status(422).json({
        status: 422, error,
      }));
  }

  /**
  *  middleware for handling validation on getting article rating
  * @static
  * @param {Request} req request object
  * @param {Response} res response object
  * @param {Next} next called on validation success
  * @return {void} void
  * @memberof validate
  */
  static validateUpdateUser(req, res, next) {
    validator(req.body, 'updateSchema').then(() => next())
      .catch(error => res.status(422).json({
        status: 422, error,
      }));
  }

  /**
  * middleware for handling validation for like
  * and dislike request params
  * @static
  * @param {Request} req request object
  * @param {Response} res response object
  * @param {Next} next called on validation sucesss
  * @return {void}
  * @memberof Validate
  */
  static validateArticleLikes(req, res, next) {
    validator(req.params, 'validateArticleLikes').then(() => next())
      .catch(error => res.status(422).json({
        status: 422, error,
      }));
  }


  /**
  * middleware for handling validation for like
  * and dislike request params
  * @static
  * @param {Request} req request object
  * @param {Response} res response object
  * @param {Next} next called on validation sucesss
  * @return {void}
  * @memberof Validate
  */
  static validateCommentLikes(req, res, next) {
    validator(req.params, 'likeComment').then(() => next())
      .catch(error => res.status(422).json({
        status: 422, error,
      }));
  }

  /**
 *
 * middleware for validating delete articles functionality
 * @static
 * @param {Request} req req object
 * @param {Response} res res object
 * @param {*} next called on validation success
 * @return { void }
 * @memberof Validate
 */
  static validateDeleteArticles(req, res, next) {
    validator(req.params, 'deleteArticle').then(() => next())
      .catch(error => res.status(422).json({
        status: 422, error,
      }));
  }

  /** middleware for article report data validation
   * @param {Request} req request object
   * @param {Response} res response object
   * @param {function} next called on successful validation
   * @memberof validate
   * @returns {void} void
   */
  static validateReportArticles(req, res, next) {
    validator(req.body, 'reportArticles').then(() => next())
      .catch(error => res.status(422).json({
        status: 422, error,
      }));
  }

  /**
   *
   *
   * @static
   * @param {obj} request
   * @param {obj} response
   * @param {function} next
   * @memberof Validate role update
   * @return {void}
   */
  static validateRoleUpdate(request, response, next) {
    const { role } = request.body;
    validator(request.body, 'userRole').then(() => {
      if (role === 'user' || role === 'moderator' || role === 'admin') {
        return next();
      }
      return response.status(422).json({
        status: 422,
        error: 'Role not available'
      });
    })
      .catch(error => response.status(422).json({
        status: 422, error,
      }));
  }

  /**  middleware for handling validation on comment creation
 * @static
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @return { void }
 * @memberof validate
 */
  static comment(req, res, next) {
    validator(req.body, 'comment').then(() => next())
      .catch(error => res.status(422).json({
        status: 422,
        error,
      }));
  }
}

export default Validate;
