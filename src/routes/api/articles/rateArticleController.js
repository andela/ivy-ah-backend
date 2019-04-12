import models from '../../../models';

const { ratings, sequelize } = models;
/**
 *
 *
 * @export
 * @class Rating
 */
export default class Rating {
  /**
   * this methods handles rating of articles
   * rating can be updated
   * @static
   * @param {Request} request this is the object where params are gotten
   * @param {Response} response object
   * @param {Next} next
   * @returns {void} void
   * @memberof Rating
   */
  static async rateArticleHandler(request, response, next) {
    try {
      const { articleId, rating } = request.body;
      const [ratedArticle, isCreated] = await ratings.findOrCreate({
        where: { articleId, userId: request.user.id },
        defaults: { rating },
        attributes: { exclude: ['id', 'createdAt'] }
      });
      if (isCreated) {
        return response.status(201).json({
          status: 201,
          data: ratedArticle.dataValues
        });
      }
      if (Number(rating) !== ratedArticle.dataValues.rating) {
        const [, [updatedRating]] = await ratings.update({ rating },
          { returning: true, where: { articleId }, attributes: ['articleId', 'rating'] });
        return response.status(200).json({
          status: 200,
          data: updatedRating,
        });
      }
      return response.status(200).json({
        status: 200,
        data: ratedArticle.dataValues
      });
    } catch (err) {
      if (err.parent.code === '23503') {
        return response.status(404).json({
          status: 404,
          error: 'You cannot rate an article that does not exit'
        });
      }
      return next(err);
    }
  }

  /**
   * this method handles getting the total rating for
   * an article
   * @static
   * @param {Request} request this is the object where params are gotten
   * @param {Response} response object
   * @param {Next} next
   * @returns {void} void
   * @memberof Rating
   */
  static async getRatings(request, response, next) {
    try {
      const { articleId } = request.params;
      const { dataValues } = await ratings.findOne({
        where: { articleId },
        attributes: [[sequelize.fn('SUM', sequelize.col('rating')), 'totalRating']],
      });
      return response.status(200).json({
        status: 200,
        data: {
          totalRating: dataValues.totalRating,
          articleId
        },
      });
    } catch (err) {
      return next(err);
    }
  }
}
