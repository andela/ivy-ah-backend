import models from '../../../models';

/**
 * handles functionality for toggling like and
 * dislike of an article
 * @static
 * @param {Request} request
 * @param {Response} response
 * @param {next} next
 * @memberof Articles
 * @returns {void}
 */
export default async (request, response, next) => {
  try {
    const [likeResult] = await models.sequelize.query('SELECT * FROM like_comment($1::uuid, $2::uuid, $3::boolean)', {
      bind: [request.user.id, request.params.commentId, request.params.option === 'like'],
      type: models.sequelize.QueryTypes.SELECT
    });
    response.status(200).send({ status: 200, data: likeResult });
  } catch (err) {
    if (err.parent.code === '23503') {
      response.status(404).status({ status: 404, error: 'comment does not exist' });
    }
    err.message = null;
    return next(err);
  }
};
