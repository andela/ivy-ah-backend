import uuid from 'uuid/v4';
import models from '../../../models';

const { users, comment } = models;

/**
 *
 *
 * @export
 * @class Articles
 */
class Comment {
/**
 *
 *
 * @static
 * @param {Request} req object
 * @param {Response} res object
 * @param {Function} next object
 * @memberof Comment
 * @returns {void}
 */
  static async postComment(req, res, next) {
    const { body } = req.body;
    let articleId, parentTracker;
    if (!req.params.articlesId) {
      parentTracker = req.params.parentCommentsId;
    } else {
      articleId = req.params.articlesId;
    }
    try {
      const newComment = await comment.create({
        articleId,
        parentTracker,
        body,
        author: req.user.id
      });
      if (newComment) {
        return res.status(201).json({
          comment: {
            id: newComment.id,
            body: newComment.body
          },
        });
      }
    } catch (err) {
      return next(err);
    }
  }

  /**
 *
 *
 * @static
 * @param {request} req
 * @param {response} res
 * @param {function} next
 * @memberof comment
 * @returns {void}
 */
  static async getComment(req, res, next) {
    let whereClause;
    if (!req.params.articlesId) {
      whereClause = { parentTracker: req.params.parentCommentsId };
    } else {
      whereClause = { articleId: req.params.articlesId };
    }
    try {
      const comments = await comment.findAll({
        include: [
          {
            model: users,
          },
          {
            model: comment,
            as: 'childComment',
            include: [
              {
                model: users
              }
            ]
          }
        ],
        where: whereClause
      });
      const allComments = comments.map(oneComment => ({
        id: oneComment.id,
        createdAt: oneComment.createdAt,
        updatedAt: oneComment.updatedAt,
        body: oneComment.body,
        author: {
          username: oneComment.user.username,
          bio: oneComment.user.bio,
          image: oneComment.user.image,
        },
        replies: oneComment.childComment.map(reply => ({
          id: reply.id,
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
          body: reply.body,
          author: {
            username: reply.user.username,
            bio: reply.user.bio,
            image: reply.user.image,
          },
        })),
        repliesCount: oneComment.childComment.length
      }));
      if (allComments.length === 0) {
        return res.status(404).json({
          status: 404,
          error: 'there are no comments for the resource requested'
        });
      }
      return res.status(200).json({
        comments: allComments,
        commentsCount: allComments.length
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
 *methond to handle editing a comment
 *
 * @static
 * @param {Request} req object
 * @param {Response} res object
 * @param {Function} next function
 * @returns {void} void
 * @memberof Comment
 */
  static async updateComment(req, res, next) {
    try {
      const [updatedComment] = await models.sequelize.query(`WITH archived as (SELECT id, author, "articleId", body, highlight, "parentTracker", "createdAt" FROM comments WHERE id = $2 AND author = $4),
        inserted as (INSERT INTO "archivedComments" SELECT $1, * FROM archived WHERE id = $2 ON CONFLICT (body) DO NOTHING),
        update as (UPDATE comments SET body = $3, "createdAt" = $5 WHERE id = $2 AND author = $4 RETURNING *) SELECT * FROM update;`, {
        bind: [uuid(), req.params.commentId, req.body.body, req.user.id, new Date().toISOString()],
        type: models.sequelize.QueryTypes.SELECT
      });

      if (updatedComment) {
        const { id, body } = updatedComment;
        res.status(200).json({ status: 200, comment: { id, body } });
      } else {
        res.status(404).json({ status: 404, error: 'comment does not exist' });
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   *method to handle deleting a comment
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {void} void
   * @memberof Comment
   */
  static async deleteComment(req, res, next) {
    try {
      const userid = req.user.role !== 'user' ? [] : [req.user.id];
      const [deleted] = await models.sequelize.query(`WITH archived as (SELECT id, author, "articleId", body, highlight, "parentTracker", "createdAt" FROM comments WHERE id = $2 ${req.user.role !== 'user' ? '' : 'AND author = $3'}),
        inserted as (INSERT INTO "archivedComments" SELECT $1, * FROM archived WHERE id = $2 ON CONFLICT (body) DO NOTHING),
        deleted as (DELETE FROM comments WHERE id = $2 ${req.user.role !== 'user' ? '' : 'AND author = $3'} RETURNING *) SELECT * FROM deleted;`, {
        bind: [uuid(), req.params.commentId, ...userid],
        type: models.sequelize.QueryTypes.SELECT
      });

      if (deleted) {
        res.status(200).json({ status: 200, message: 'comment deleted' });
      } else {
        res.status(404).json({ status: 404, error: 'comment does not exist' });
      }
    } catch (err) {
      next(err);
    }
  }
}

export default Comment;
