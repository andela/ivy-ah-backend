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

  /**
 * @static
 * @param {obj} request
 * @param {ogj} response
 *  @param {next} next
 * @returns {void}
 * @memberof Article class
 */
  static async getArticlesByPage(request, response, next) {
    try {
      const limit = request.query.limit ? request.query.limit : null;
      const offset = request.query.page ? limit * (request.query.page - 1) : null;
      const { count, rows } = await articles.findAndCountAll({
        offset,
        limit
      });
      const numberOfPages = limit ? (Math.ceil(count / limit)) : 1;
      return response.status(200).json({
        status: 200,
        numberOfArticles: count,
        numberOfPages,
        currentPage: request.query.page,
        articles: rows,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
 *
 * This function handles the deleting of articles
 * @static
 * @param {Request} request request params having the articleId
 * @param {Response} response response object sent if delete is successful or not
 * @param {Next} next
 * @returns {void}
 * @memberof Article
 */
  static async deleteSpecificArticle(request, response, next) {
    try {
      const article = await articles.findByPk(request.params.articleId, { attributes: ['author'], plainText: true });
      if (!article) { return response.status(404).json({ status: 404, error: 'The article you want to delete is not found' }); }
      if (request.user.role === 'Admin' || article.dataValues.author === request.user.id) {
        await articles.destroy({
          where: { id: request.params.articleId }
        });
        return response.status(200).json({ status: 200, message: 'The article was deleted successfully' });
      }
      return response.status(401).json({ status: 401, error: 'You are not authorized to delete this article' });
    } catch (error) {
      error.customMessage = 'Delete failed. Try again later';
      return next(error);
    }
  }
}
