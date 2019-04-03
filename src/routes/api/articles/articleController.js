import generateSlug from '../../../helpers/slugGenerator';
import models from '../../../models';
import getErrorCode from '../../../helpers/getErrorCode';

const { articles } = models;
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
}
