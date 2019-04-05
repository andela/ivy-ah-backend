import generateSlug from '../../../helpers/slugGenerator';
import models from '../../../models';
import getErrorCode from '../../../helpers/getErrorCode';

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
  static async create(request, response) {
    try {
      const {
        title, body, description, tagList, author
      } = request.body.article;
      const slug = generateSlug(title);
      const result = await articles.create({
        slug,
        title,
        body,
        description,
        tagList,
        author
      });
      if (result) {
        const { dataValues } = result;
        return response.status(201).json({
          status: 201,
          article: dataValues,
        });
      }
    } catch (err) {
      const code = getErrorCode(err);
      let errorMessage = 'Something went wrong. Try again Later';
      let statusMessage = 500;
      if (Number(code) === 23503) { errorMessage = 'Author not found in database'; statusMessage = 404; }
      return response.status(statusMessage).json({
        status: statusMessage,
        error: errorMessage
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
  static async rate(request, response) {
    try {
      const { rating } = request.body;
      const { article, user, rate } = rating;
      const checkRating = await ratings.findOne({
        where: {
          article,
          user
        }
      });
      if (checkRating) {
        return Article.updateRate(request, response);
      }
      const result = await ratings.create({
        article,
        user,
        rating: rate
      });
      if (result) {
        const { dataValues } = result;
        response.status(201).json({
          status: 201,
          rating: dataValues
        });
      }
    } catch (err) {
      return response.status(500).json({ error: 'Something went wrong. Please try again ' });
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
  static async updateRate(request, response) {
    const { rating } = request.body;
    const { article, user, rate } = rating;
    try {
      const [numberOfAffectedRows, affectedRows] = await ratings.update({
        rating: rate,
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
    } catch (error) {
      return response.status(500).json({
        error: 'something went wrong. Try again later'
      });
    }
  }
}
