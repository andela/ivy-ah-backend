module.exports = (sequelize, DataTypes) => {
  const reportedComments = sequelize.define('reportedComments', {
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
    commentid: {
      type: DataTypes.UUID,
      unique: 'compositeIndex'
    }
  }, { timestamps: false });
  reportedComments.associate = (models) => {
    reportedComments.belongsTo(models.users, { foreignKey: 'userid' });
    reportedComments.belongsTo(models.comment, { foreignKey: 'commentid', as: 'comment' });
  };
  return reportedComments;
};
