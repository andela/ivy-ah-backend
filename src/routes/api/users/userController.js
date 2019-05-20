import 'dotenv/config';
import authenticator from '../../../helpers/authenticator';
import db from '../../../models/index';
import emailSender from '../../../helpers/emailSender';
import Templates from '../../../helpers/Templates';
import circularReplacer from '../../../helpers/circularReplacer';

const { articles, users, ratings } = db;
/**
 * @class Users
 */
class Users {
  /**
   * @static
   * @param {obj} req
   * @param {obj} res
   * @param {function} next
   * @returns {obj} res
   * @memberof Users
   */
  static async getAllUsers(req, res, next) {
    try {
      const limit = req.query.limit ? req.query.limit : 30;
      const offset = req.query.page ? limit * (req.query.page - 1) : 0;
      const currentPage = req.query.page ? req.query.page : 1;
      const { count, rows } = await db.users.findAndCountAll({
        offset,
        limit,
        attributes: { exclude: ['password'] }
      });
      const numberOfPages = limit ? Math.ceil(count / limit) : 1;
      return res.status(200).json({
        status: 200,
        numberOfPages,
        numberOfUsers: count,
        currentPage,
        users: rows
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * method for handling updating
   * @param {Request} req
   *  @param {Res} res
   * @param {Response} next sends the error to the global error handler
   * @returns {void} void
   * @memberof User
   */
  static async updateUser(req, res, next) {
    try {
      const { id } = req.user;
      const [, data] = await db.users.update(req.body, {
        where: { id },
        returning: true
      });
      const {
        isVerified,
        isSubscribed,
        role,
        email,
        bio,
        image,
        createdAt,
        updatedAt,
        username,
        firstname,
        lastname
      } = data[0].dataValues;
      return res.status(200).json({
        status: 200,
        user: {
          isVerified,
          isSubscribed,
          role,
          email,
          bio,
          image,
          createdAt,
          updatedAt,
          username,
          firstname,
          lastname
        }
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   *
   * this function gets all articles created by a specific
   * user
   * @static
   * @param {Request} req request object
   * @param {Response} res response object
   * @param {Next} next called if there is an error
   * @memberof Users
   * @return { void }
   */
  static async getUserArticles(req, res, next) {
    try {
      const limit = req.query.limit ? req.query.limit : 30;
      const offset = req.query.page ? limit * (req.query.page - 1) : 0;
      const currentPage = req.query.page ? req.query.page : 1;
      const { userId } = req.params;
      const { count, rows } = await articles.findAndCountAll({
        offset,
        limit,
        where: { author: userId },
        include: [
          {
            model: users,
            attributes: { exclude: ['password'] }
          },
          { model: ratings }
        ]
      });
      const removeCyclicStructure = JSON.stringify(rows, circularReplacer());
      const newRows = JSON.parse(removeCyclicStructure);
      const pageCount = limit ? Math.ceil(count / limit) : 1;
      const newArticleRows = newRows.map(article => ({
        ...article,
        ratings:
        article.ratings.reduce((ratingSum, currentRating) => ratingSum + currentRating.rating,
          0)
      }));
      return res.status(200).json({
        status: 200,
        pageCount,
        articleCount: count,
        currentPage,
        articles: newArticleRows
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * this method verifies user email
   *
   * @static
   * @param {obj} request
   * @param {obj} response
   * @param {function} next
   * @returns {void}
   * @memberof Users
   */
  static async confirmEmail(request, response, next) {
    try {
      const { token } = request.params;
      const { email } = authenticator.verifyToken(token);
      const user = await db.users.findOne({ where: { email } });
      if (user.isVerified) {
        response.status(400).json({
          status: 400,
          error: 'Email Already Verified'
        });
      }
      const [, updatedUser] = await db.users.update({ isVerified: true },
        {
          where: { email },
          returning: true
        });
      const {
        username,
        firstname,
        lastname,
        isVerified,
        isSubscribed,
        role,
        bio,
        image,
        createdAt,
        updatedAt
      } = updatedUser[0].dataValues;

      const loginPage = process.env.FRONTEND_URL;

      emailSender(email,
        'Email confirmation successful',
        Templates.emailConfirmed(loginPage, email));
      return response.status(200).json({
        status: 200,
        message: 'Email Confirmation Successful',
        user: {
          username,
          firstname,
          lastname,
          email,
          isVerified,
          isSubscribed,
          role,
          bio,
          image,
          createdAt,
          updatedAt
        }
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   *
   * This method resends verification mail
   * @static
   * @param {obj} request
   * @param {obj} response
   * @param {function} next
   * @returns {void}
   * @memberof Users
   */
  static async resendMail(request, response, next) {
    try {
      const { email } = request.body;
      const user = await db.users.findOne({ where: { email } });
      if (!user) {
        response.status(400).json({
          status: 400,
          error: 'Email Does not exist'
        });
      }
      const token = await authenticator.generateToken({ email });

      const confirmEmailPage = `${process.env.FRONTEND_URL}/confirmation?token=${token}`;

      await emailSender(email,
        'Please Confirm Your Email',
        Templates.confirmEmail(confirmEmailPage, email));
      return response.status(200).json({
        status: 200,
        message: 'Verification mail has been sent to user'
      });
    } catch (err) {
      return next(err);
    }
  }
}

export default Users;
