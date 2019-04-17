module.exports = (sequelize, DataTypes) => {
  const ratings = sequelize.define('ratings', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    articleId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },

  }, {});
  ratings.associate = (models) => {
    ratings.belongsTo(models.users, { foreignKey: 'userId' });
    ratings.belongsTo(models.articles, { foreignKey: 'articleId', onDelete: 'CASCADE' });
  };
  return ratings;
};
