import models from '../../../models';
import { sendCommentLikeNotification } from '../../../socket/sendNotification';
/**
 * handles functionality for toggling like and
 * dislike of an article
 * @static
 * @param {Request} request
 * @param {Response} response
 * @param {next} next
 * @memberof Comment
 * @returns {void}
 */
export default async (request, response, next) => {
  try {
    const [likeResult] = await models.sequelize.query('SELECT * FROM like_comment($1::uuid, $2::uuid, $3::boolean)', {
      bind: [request.user.id, request.params.commentId, request.params.option === 'like'],
      type: models.sequelize.QueryTypes.SELECT
    });

    likeResult.likes = likeResult.likes ? Number(likeResult.likes) : 0;
    likeResult.dislikes = likeResult.dislikes ? Number(likeResult.dislikes) : 0;

    response.status(200).send({ status: 200, data: likeResult });
    sendCommentLikeNotification(likeResult);
  } catch (err) {
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return response.status(404).json({ status: 404, error: 'Comment does not exist' });
    }
    return next(err);
  }
};
