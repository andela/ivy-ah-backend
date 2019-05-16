
module.exports = (sequelize, DataTypes) => {
  const bookmark = sequelize.define('bookmark', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: 'compositeIndex'
    },
    article: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: 'compositeIndex'
    }
  }, {});
  bookmark.associate = (models) => {
    bookmark.belongsTo(models.articles, { foreignKey: 'article', as: 'articleDetail' });
    bookmark.belongsTo(models.users, { foreignKey: 'user', as: 'userid' });
  };
  return bookmark;
};
