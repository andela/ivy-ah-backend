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
    parentCommentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  }, {});
  comment.associate = (models) => {
    comment.belongsTo(models.users, { foreignKey: 'author' });
    comment.belongsTo(models.articles, { foreignKey: 'articleId', onDelete: 'CASCADE', });
    comment.hasMany(comment, { foreignKey: 'parentCommentId', as: 'childComment' });
  };
  return comment;
};
