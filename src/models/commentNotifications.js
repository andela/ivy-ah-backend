module.exports = (sequelize, DataTypes) => {
  const notifications = sequelize.define('notifications', {
    articleid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    userid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false
    },
    lastSeen: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
      allowNull: false,
    }
  }, {});

  notifications.associate = (models) => {
    notifications.belongsTo(models.articles, {
      foreignKey: 'articleid',
    });

    notifications.belongsTo(models.users, {
      foreignKey: 'userid'
    });
  };
  return notifications;
};
