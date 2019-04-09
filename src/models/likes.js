const likeArticle = `IF EXISTS(SELECT id FROM public."likes" WHERE likes."userId" = userid AND likes."articleId" = articleid AND likes."like" = likes_option) IS NOT TRUE THEN
INSERT INTO public."likes" ("userId", "articleId", "like") VALUES (userid, articleid, likes_option)
ON CONFLICT ON CONSTRAINT "likes_articleId_userId_key"
DO UPDATE SET "like" = likes_option WHERE likes."userId" = userid AND likes."articleId" = articleid;
ELSE
DELETE FROM public."likes" WHERE likes."userId" = userid AND likes."articleId" = articleid;
END IF;
RETURN QUERY 
WITH likes_count_total AS (SELECT likes."like", COUNT(likes."like") as l_count FROM public."likes" WHERE likes."articleId" = articleid GROUP BY likes."like"),
parameters AS (SELECT userid AS uid, articleid AS aid)
SELECT uid, aid, like_option.like, likes_count.l_count, dislikes_count.l_count FROM parameters
LEFT JOIN public."likes" AS like_option ON like_option."userId" = userid AND like_option."articleId" = articleid AND like_option."like" = likes_option
LEFT JOIN likes_count_total AS likes_count ON likes_count."like" = true
LEFT JOIN likes_count_total AS dislikes_count ON dislikes_count."like" = false;`;

module.exports = (sequelize, DataTypes) => {
  const likes = sequelize.define('likes', {
    like: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    articleId: {
      type: DataTypes.UUID,
      unique: 'compositeIndex'
    },
    userId: {
      type: DataTypes.UUID,
      unique: 'compositeIndex'
    },
  }, { timestamps: false });

  likes.associate = (models) => {
    likes.belongsTo(models.articles, { foreignKey: 'articleId' });
    likes.belongsTo(models.users, { foreignKey: 'userId' });
  };

  sequelize.queryInterface.createFunction('like_article',
    [
      { type: 'UUID', name: 'userid', direction: 'IN' },
      { type: 'UUID', name: 'articleid', direction: 'IN' },
      { type: 'BOOLEAN', name: 'likes_option', direction: 'IN' }
    ],
    'TABLE ("userId" uuid, "articleId" uuid, "option" boolean, "likes" bigint, "dislikes" bigint)',
    'plpgsql',
    likeArticle,
    [
      'VOLATILE'
    ]).catch(() => 0);

  return likes;
};
