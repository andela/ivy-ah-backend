module.exports = (sequelize, DataTypes) => {
  const followings = sequelize.define('followings', {
    author: DataTypes.INTEGER,
    followerId: DataTypes.INTEGER
  }, {});
  followings.associate = (models) => {
    followings.belongsTo(models.users, { foreignKey: 'author' });
    followings.belongsTo(models.users, { foreignKey: 'followerId' });
  };
  return followings;
};
