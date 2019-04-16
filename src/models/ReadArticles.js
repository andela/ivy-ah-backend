module.exports = (sequelize, DataTypes) => {
  const ReadArticles = sequelize.define('ReadArticles', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    readerId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    articleId: {
      allowNull: false,
      type: DataTypes.UUID
    },
  }, {});
  ReadArticles.associate = (models) => {
    ReadArticles.belongsTo(models.articles, {
      foreignKey: 'articleId',
      as: 'article',
      onDelete: 'CASCADE'
    });

    ReadArticles.belongsTo(models.users, {
      foreignKey: 'readerId',
      as: 'reader',
      onDelete: 'CASCADE'
    });
  };
  return ReadArticles;
};
