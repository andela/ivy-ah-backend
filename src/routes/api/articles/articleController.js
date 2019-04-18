import generateSlug from '../../../helpers/slugGenerator';
import models from '../../../models';
import calculateReadTime from '../../../helpers/articleReadTime';
import removeDuplicate from '../../../helpers/arrayDuplicateRemover';
import authenticator from '../../../helpers/authenticator';
import addToReadArticles from '../../../helpers/readingStats';

const {
  articles, likes, users, ratings, comment, commentlikes, sequelize
} = models;
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
 * this method updates an article
 * @static
 * @param {Request} request
 * @param {Response} response
 * @param {function} next
 * @memberof Articles
 * @returns {void}
 */
  static async updateArticle(request, response, next) {
    try {
      const updates = Object.assign({}, request.body);
      if (updates.title) {
        updates.slug = generateSlug(updates.title);
      }
      if (updates.tagList) {
        updates.tagList = removeDuplicate(updates.tagList);
      }
      if (updates.plainText) {
        updates.readTime = calculateReadTime(updates.plainText);
      }
      const result = await articles.update(updates,
        {
          where: {
            id: request.params.articleId,
            author: request.user.id,
          },
          returning: true,
        });
      const affectedRows = result[0];
      if (affectedRows !== 1) {
        return response.status(404).json({
          status: 404,
          error: 'did not find this article in the list of articles you authored'
        });
      }
      const { dataValues } = result[1][0];
      return response.status(201).json({
        status: 201,
        article: dataValues,
      });
    } catch (err) {
      return next(err);
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

  /**
 * @static
 * @param {req} req - the request body
 * @param {res} res - the response object
 *  @param {next} next -  the next function
 * @returns {article} article - an article
 * @memberof Article class
 */
  static async getOneArticle(req, res, next) {
    try {
      const { articleId } = req.params;
      let user;
      if (req.get('authorization')) {
        user = `'${authenticator.verifyToken(req.get('authorization')).id}'::uuid`;
      }

      const include = [
        {
          model: users,
          attributes: ['username', 'bio', 'image']
        },
        {
          model: comment,
          include: [
            { model: users, as: 'user', attributes: ['username', 'bio', 'image'] },
            {
              model: commentlikes,
            },
            {
              model: comment,
              as: 'childComment',
              include: [{ model: commentlikes }, { model: users, as: 'user', attributes: ['username', 'bio', 'image'] }]
            }
          ]
        },
        {
          model: likes,
        },
        {
          model: ratings
        }
      ];
      const article = await articles.findOne({
        where: {
          id: articleId,
        },
        attributes: {
          include: [[sequelize.fn('exists', sequelize.literal(`SELECT * FROM bookmarks WHERE "user" = ${user || null} AND article = '${req.params.articleId}'::uuid`)), 'bookmark']],
        },
        include
      });
      if (!article) {
        return res.status(404).json({
          status: 404,
          error: 'Article not found'
        });
      }
      if (article && user) {
        const userid = authenticator.verifyToken(req.get('authorization')).id;
        addToReadArticles(articleId, userid);
      }

      const totalRatings = article.ratings.reduce((acc, curr) => acc + curr.rating, 0);
      const { comments } = article.toJSON();
      const commentsArray = comments.map(oneComment => ({
        ...oneComment,
        commentlikes: oneComment.commentlikes.filter(like => like.like === true).length,
        commentdislikes: oneComment.commentlikes.filter(like => like.like === false).length,
      }));

      const articleLikes = article.likes.filter(like => like.like === true).length;
      const articleDislikes = article.likes.filter(like => like.like === false).length;
      const articleDetails = {
        id: article.id,
        slug: article.slug,
        title: article.title,
        body: article.body,
        plainText: article.plainText,
        tagList: article.tagList,
        readTime: article.readTime,
        isPremium: article.isPremium,
        createdAt: article.createdAt,
        user: article.user,
        likes: articleLikes,
        dislikes: articleDislikes,
        ratings: totalRatings,
        comments: commentsArray,
        bookmark: article.toJSON().bookmark
      };
      res.status(200).json({
        status: 200,
        data: {
          ...articleDetails,
        }
      });
    } catch (error) {
      return next(error);
    }
  }
}
