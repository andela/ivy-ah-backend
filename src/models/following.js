module.exports = (sequelize, DataTypes) => {
  const followings = sequelize.define('followings', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    authorId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    followerId: {
      allowNull: false,
      type: DataTypes.UUID
    },
  }, {});
  followings.associate = (models) => {
    followings.belongsTo(models.users, {
      foreignKey: 'authorId',
      as: 'author',
      onDelete: 'CASCADE'
    });

    followings.belongsTo(models.users, {
      foreignKey: 'followerId',
      as: 'follower',
      onDelete: 'CASCADE'
    });
  };
  return followings;
};
