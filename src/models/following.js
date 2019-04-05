module.exports = (sequelize, DataTypes) => {
  const following = sequelize.define('following', {
    author: DataTypes.INTEGER,
    followerId: DataTypes.INTEGER
  }, {});
  following.associate = (models) => {
    following.belongsTo(models.user, { foreignKey: 'author' });
    following.belongsTo(models.user, { foreignKey: 'followerId' });
  };
  return following;
};
