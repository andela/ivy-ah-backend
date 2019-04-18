import models from '../../../models';

const { users, comment } = models;

/**
 *
 *
 * @export
 * @class Comment
 */
class Comment {
/**
 *
 * this method creates comments
 * @static
 * @param {request} req
 * @param {response} res
 * @param {function} next
 * @memberof comment
 * @returns {void}
 */
  static async postComment(req, res, next) {
    const {
      body, highlightedText,
      textPosition
    } = req.body;
    let articleId, parentCommentId;
    if (!req.params.articlesId) {
      parentCommentId = req.params.parentCommentsId;
    } else {
      articleId = req.params.articlesId;
    }
    try {
      const highlight = {
        highlightedText,
        textPosition
      };
      const newComment = await comment.create({
        articleId,
        parentCommentId,
        body,
        highlight,
        author: req.user.id
      });
      if (newComment) {
        return res.status(201).json({
          comment: {
            id: newComment.id,
            body: newComment.body,
            highlight: newComment.highlight,
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
 * this method gets comments
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
      whereClause = { parentCommentId: req.params.parentCommentsId };
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
        highlight: oneComment.highlight,
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
}

export const { postComment, getComment } = Comment;
