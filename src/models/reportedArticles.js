
module.exports = (sequelize, DataTypes) => {
  const reportArticles = sequelize.define('reportedArticles', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userid: {
      type: DataTypes.UUID,
      unique: 'compositeIndex'
    },
    articleid: {
      type: DataTypes.UUID,
      unique: 'compositeIndex'
    }
  }, { primaryKey: false });
  reportArticles.associate = (models) => {
    reportArticles.belongsTo(models.users, { foreignKey: 'userid' });
    reportArticles.belongsTo(models.articles, { foreignKey: 'articleid', as: 'article' });
  };
  return reportArticles;
};
