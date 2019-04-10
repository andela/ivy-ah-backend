import Sequelize from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  const articles = sequelize.define('articles', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    bannerImage: {
      type: DataTypes.TEXT,
      defaultValue: 'https://res.cloudinary.com/ivy-league/image/upload/v1556012036/quill-teal.jpg',
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    description: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    body: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    plainText: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tagList: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    readTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    authorLastSeen: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('NOW'),
      allowNull: false,
    }
  }, {});
  articles.associate = (models) => {
    articles.belongsTo(models.users, { foreignKey: 'author' });
    articles.hasMany(models.comment, { foreignKey: 'articleId' });
    articles.hasMany(models.likes, { foreignKey: 'articleId' });
    articles.hasMany(models.ratings, { foreignKey: 'articleId' });
    articles.hasMany(models.bookmark, { foreignKey: 'articleId' });
  };
  return articles;
};
