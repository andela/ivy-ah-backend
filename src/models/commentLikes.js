const likeComment = `IF EXISTS(SELECT id FROM public.commentlikes WHERE commentlikes."userId" = userid AND commentlikes."commentId" = commentid AND commentlikes."like" = likes_option) IS NOT TRUE THEN
INSERT INTO public.commentlikes ("userId", "commentId", "like") VALUES (userid, commentid, likes_option)
ON CONFLICT ON CONSTRAINT "commentlikes_commentId_userId_key"
DO UPDATE SET "like" = likes_option WHERE commentlikes."userId" = userid AND commentlikes."commentId" = commentid;
ELSE
DELETE FROM public.commentlikes WHERE commentlikes."userId" = userid AND commentlikes."commentId" = commentid;
END IF;
RETURN QUERY
WITH likes_count_total AS (SELECT commentlikes."like", COUNT(commentlikes."like") as l_count FROM public.commentlikes WHERE commentlikes."commentId" = commentid GROUP BY commentlikes."like"),
parameters AS (SELECT userid AS uid, commentid AS aid)
SELECT uid, aid, like_option.like, likes_count.l_count, dislikes_count.l_count FROM parameters
LEFT JOIN public.commentlikes AS like_option ON like_option."userId" = userid AND like_option."commentId" = commentid AND like_option."like" = likes_option
LEFT JOIN likes_count_total AS likes_count ON likes_count."like" = true
LEFT JOIN likes_count_total AS dislikes_count ON dislikes_count."like" = false;`;

module.exports = (sequelize, DataTypes) => {
  const commentlikes = sequelize.define('commentlikes', {
    like: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    commentId: {
      type: DataTypes.UUID,
      unique: 'compositeIndex'
    },
    userId: {
      type: DataTypes.UUID,
      unique: 'compositeIndex'
    },
  }, { timestamps: false });

  commentlikes.associate = (models) => {
    commentlikes.belongsTo(models.comment, { foreignKey: 'commentId' });
    commentlikes.belongsTo(models.users, { foreignKey: 'userId' });
  };
  // sequelize.query('drop function like_comment');
  sequelize.queryInterface.createFunction('like_comment',
    [
      { type: 'UUID', name: 'userid', direction: 'IN' },
      { type: 'UUID', name: 'commentid', direction: 'IN' },
      { type: 'BOOLEAN', name: 'likes_option', direction: 'IN' }
    ],
    'TABLE ("userId" uuid, "commentId" uuid, "option" boolean, "likes" bigint, "dislikes" bigint)',
    'plpgsql',
    likeComment,
    [
      'VOLATILE'
    ]).catch(() => 0);

  return commentlikes;
};
