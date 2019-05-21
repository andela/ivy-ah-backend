import db from '../../../models/index';

const {
  articles, reportedArticles
} = db;

/**
 * handles article reporting
 * @class ReportArticles
 */
class ReportArticles {
  /**
   * middleware to report an article
   * @static
   * @param {Request} req request object
   * @param {Response} res response object
   * @param {Function} next called on server errors
   * @returns {void} void
   * @memberof ReportArticles
   */
  static async report(req, res, next) {
    try {
      await reportedArticles.create({
        articleid: req.body.article,
        reason: req.body.reason,
        userid: req.user.id,
      });

      res.status(201).send({ status: 200, message: 'article reported' });
    } catch (error) {
      if (error.parent.code === '23503') {
        return res.status(404).send({ status: 404, error: 'article does not exist' });
      }
      if (error.parent.code === '23505') {
        return res.status(409).send({ status: 409, error: 'article already reported by user' });
      }
      next(error);
    }
  }

  /**
   * middleware to get all reported articles
   * @static
   * @param {Request} req request object
   * @param {Response} res response object
   * @param {Function} next called on server errors
   * @returns {void} void
   * @memberof ReportArticles
   */
  static async getReported(req, res, next) {
    try {
      const reported = await reportedArticles.findAll({
        attributes: ['reason'],
        include: {
          model: articles,
          as: 'article',
        },
        order: [['createdAt', 'DESC']]
      });

      res.status(200).send({ status: 200, data: reported });
    } catch (error) {
      next(error);
    }
  }

  /**
   * middleware to clear a reported article
   * @static
   * @param {Request} req request object
   * @param {Response} res response object
   * @param {Function} next called on server errors
   * @returns {void} void
   * @memberof ReportArticles
   */
  static async clearReported(req, res, next) {
    try {
      const deletedReport = await reportedArticles.destroy({
        where: { articleid: req.params.articleId }
      });

      if (deletedReport > 0) return res.status(200).send({ status: 200, message: 'delete request successful' });
      res.status(404).send({ status: 404, message: 'article has not been reported' });
    } catch (error) {
      next(error);
    }
  }
}

export default ReportArticles;
