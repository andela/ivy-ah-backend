import moment from 'moment';
import db from '../../../models';

const {
  ReadArticles, articles, Sequelize, users
} = db;

const { Op } = Sequelize;

/**
*
*
* @export
* @class Readingtats
*/
export default class ReadingStats {
  /**
* A method for getting the reading stats for a user
* @static
* @param {req} req - the request body
* @param {res} res - the response object
*  @param {next} next -  the next function
* @returns {void}
* @memberof ReadingStats class
*/
  static async getReadingStats(req, res, next) {
    try {
      const readerId = req.user.id;
      const { timeline } = req.params;
      const result = await ReadArticles.findAndCountAll({
        where: {
          readerId,
          createdAt: {
            [Op.gte]: moment().subtract(timeline, 'days').toDate()
          }
        },
        include: [
          {
            model: articles,
            as: 'article',
            include: {
              model: users,
              attributes: {
                exclude: ['password']
              }
            }
          },
        ],
        order: [['createdAt', 'DESC']]
      });
      const { rows, count } = result;
      res.status(200).json({
        data: {
          readArticles: rows,
          count,
          timeline: `${timeline} days`
        }
      });
    } catch (error) {
      return next(error);
    }
  }
}
