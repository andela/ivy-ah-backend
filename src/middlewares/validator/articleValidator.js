import validator from './validator';
/**
 *
 *
 * @export
 * @class ArticleValidator
 */
export default class ArticleValidator {
  /**
 *
 *
 * @static
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return { void }
 * @memberof ArticleValidator
 */
  static validateArticle(req, res, next) {
    validator(req.body, 'articles').then(next())
      .catch(error => res.status(422).json({
        status: 422, error,
      }));
  }

  /**
 *
 *
 * @static
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @memberof ArticleValidator
 * @return {void}
 */
  static validateArticleRating(req, res, next) {
    validator(req.body, 'rating').then(next())
      .catch(error => res.status(422).json({
        status: 422, error,
      }));
  }
}
