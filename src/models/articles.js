module.exports = (sequelize, DataTypes) => {
  const articles = sequelize.define('articles', {
    slug: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    description: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    body: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    readtime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tagList: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    }
  }, {});
  articles.associate = (models) => {
    articles.belongsTo(models.user, { foreignKey: 'author', as: 'userId' });
  };
  return articles;
};
