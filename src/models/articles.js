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
    plainText: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tagList: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {});
  articles.associate = (models) => {
    articles.belongsTo(models.users, { foreignKey: 'author' });
  };
  return articles;
};
