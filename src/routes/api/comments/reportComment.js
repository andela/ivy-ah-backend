
import db from '../../../models/index';

const {
  reportedComments, sequelize
} = db;

/**
 * handles comment reporting
 * @class ReportArticles
 */
class ReportComments {
  /**
   * middleware to report a comment
   * @static
   * @param {Request} req request object
   * @param {Response} res response object
   * @param {Function} next called on server errors
   * @returns {void} void
   * @memberof ReportedComments
   */
  static async report(req, res, next) {
    try {
      const report = await reportedComments.create({
        commentid: req.params.commentId,
        reason: req.body.reason,
        userid: req.user.id,
      });

      res.status(201).send({ status: 200, report });
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(404).send({ status: 404, error: 'comment does not exist' });
      }
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).send({ status: 409, error: 'comment already reported by user' });
      }
      next(error);
    }
  }

  /**
   * middleware to get all reported comments
   * @static
   * @param {Request} req request object
   * @param {Response} res response object
   * @param {Function} next called on server errors
   * @returns {void} void
   * @memberof ReportedComments
   */
  static async getAllReported(req, res, next) {
    try {
      let comments = await sequelize.query(`WITH allcomments AS (SELECT id as tracker, author, "articleId", body, "parentTracker", "createdAt" FROM comments WHERE id IN (SELECT commentid FROM "reportedComments")
        UNION ALL SELECT tracker, author, "articleId", body, "parentTracker", "createdAt" FROM "archivedComments" WHERE tracker IN (SELECT commentid FROM "reportedComments") ORDER BY "createdAt")
        SELECT id, userid, reason, allcomments.* FROM "reportedComments" LEFT JOIN allcomments ON "reportedComments".commentid = allcomments.tracker`, {
        type: sequelize.QueryTypes.SELECT
      });

      comments = comments.reduce((commentArray, current, Si, array) => {
        if (current.id) {
          let reportReason;
          let user;
          let reportId;
          const reported = array.filter(arr => arr.id === current.id)
            .map((comment) => {
              reportId = comment.id;
              reportReason = comment.reason;
              user = comment.userid;
              delete comment.reason;
              delete comment.userid;
              delete comment.id;
              return comment;
            });
          commentArray.push({
            id: reportId, reason: reportReason, user, comments: reported
          });
        }
        return commentArray;
      }, []);

      res.status(200).send({
        status: 200,
        data: comments
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * middleware to clear a reported comment
   * @static
   * @param {Request} req request object
   * @param {Response} res response object
   * @param {Function} next called on server errors
   * @returns {void} void
   * @memberof ReportedComments
   */
  static async clearReported(req, res, next) {
    try {
      const deletedReport = await reportedComments.destroy({
        where: { commentid: req.params.reportId }
      });

      if (deletedReport > 0) return res.status(200).send({ status: 200, message: 'delete request successful' });
      res.status(404).send({ status: 404, message: 'comment has not been reported' });
    } catch (error) {
      next(error);
    }
  }
}

export default ReportComments;
