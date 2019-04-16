module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    id: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    articleId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    parentTracker: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    highlight: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  }, {});
  comment.associate = (models) => {
    comment.belongsTo(models.users, { foreignKey: 'author' });
    comment.belongsTo(models.articles, { foreignKey: 'articleId' });
    comment.hasMany(comment, { foreignKey: 'parentTracker', as: 'childComment' });
    comment.hasMany(models.commentlikes, { foreignKey: 'commentId' });
  };
  return comment;
};
