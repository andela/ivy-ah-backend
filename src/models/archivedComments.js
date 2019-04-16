module.exports = (sequelize, DataTypes) => {
  const archivedComments = sequelize.define('archivedComments', {
    id: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      allowNull: false
    },
    tracker: {
      type: DataTypes.UUID,
      allowNull: false
    },
    author: {
      type: DataTypes.UUID,
      allowNull: true
    },
    articleId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    highlight: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    parentTracker: {
      type: DataTypes.UUID,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, { timestamps: false });
  archivedComments.associate = (models) => {
    archivedComments.belongsTo(models.users, { foreignKey: 'author' });
    archivedComments.belongsTo(models.articles, { foreignKey: 'articleId' });
  };
  return archivedComments;
};
