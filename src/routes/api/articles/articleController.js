import generateSlug from '../../../helpers/slugGenerator';
import models from '../../../models';
import calculateReadTime from '../../../helpers/articleReadTime';
import removeDuplicate from '../../../helpers/arrayDuplicateRemover';

const { articles } = models;
/**
 *
 *
 * @export
 * @class Articles
 */
export default class Article {
/**
 * this function handles the creation of an article
 * @static
 * @param {Request} request this is the request object
 * @param {Response} response this is the response object
 * @memberof Articles
 * @returns {void}
 */
  static async createArticle(request, response) {
    try {
      const {
        title, body, description, tagList, plainText
      } = request.body;
      const result = await articles.create({
        title,
        body,
        description,
        plainText,
        author: request.user.id,
        slug: generateSlug(title),
        tagList: removeDuplicate(tagList),
        readTime: calculateReadTime(plainText)
      });
      if (result) {
        const { dataValues } = result;
        return response.status(201).json({
          status: 201,
          article: dataValues,
        });
      }
    } catch (err) {
      return response.status(500).json({
        status: 500,
        error: 'Something went wrong. Please try again later'
      });
    }
  }
}
