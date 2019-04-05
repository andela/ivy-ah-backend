module.exports = (sequelize, DataTypes) => {
  const ratings = sequelize.define('ratings', {
    article: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {});
  ratings.associate = (models) => {
    ratings.belongsTo(models.articles, { foreignKey: 'article', as: 'articleSlug' });
    ratings.belongsTo(models.user, { foreignKey: 'user', as: 'userEmail' });
  };
  return ratings;
};
