import generateSlug from '../../../helpers/slugGenerator';
import models from '../../../models';

const { articles, ratings } = models;

/**
 *
 *
 * @export
 * @class Articles
 */
export default class Article {
/**
 *
 *
 * @static
 * @param {*} request
 * @param {*} response
 * @memberof Articles
 * @returns {void}
 */
  static async createArticle(request, response) {
    try {
      const {
        title, body, description, tagList, plainText
      } = request.body;
      const slug = generateSlug(title);
      const result = await articles.create({
        slug,
        title,
        body,
        description,
        tagList,
        plainText,
        author: request.user.email
      });
      if (result) {
        const { dataValues } = result;
        return response.status(201).json({
          status: 201,
          article: dataValues,
        });
      }
    } catch (err) {
      console.log(err)
      return response.status(500).json({
        status: 500,
        error: 'Something went wrong. Please try again later'
      });
    }
  }

  /**
 *
 *
 * @static
 * @param {*} request
 * @param {*} response
 * @returns
 * @memberof Article
 * @return {void}
 */
  static async rateArticle(request, response) {
    try {
      const { article, user, rating } = request.body;
      const checkRating = await ratings.findOne({
        where: {
          article,
          user
        }
      });
      if (checkRating) {
        return Article.updateRating(request, response);
      }
      const ratedArticle = await ratings.create({
        article,
        user,
        rating
      });
      if (ratedArticle) {
        response.status(201).json({
          status: 201,
          rating: ratedArticle
        });
      }
    } catch (err) {
      return response.status(500).json({
        error: 'Something went wrong. Please try again '
      });
    }
  }

  /**
*
*
* @static
* @param {*} request
* @param {*} response
* @returns
* @memberof Article
* @return {void}
*/
  static async updateRating(request, response) {
    const { article, user, rating } = request.body;
    try {
      const [numberOfAffectedRows, affectedRows] = await ratings.update({
        rating
      }, {
        where: {
          article,
          user
        },
        returning: true
      });
      if (numberOfAffectedRows > 0) {
        return response.status(200).json({
          status: 200,
          rating: affectedRows,
          message: 'rating updated'
        });
      }
    } catch (err) {
      return response.status(500).json({
        error: 'something went wrong. Try again later'
      });
    }
  }
}
