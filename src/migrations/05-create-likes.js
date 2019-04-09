import db from '../models';

module.exports = {
  up: queryInterface => queryInterface.createTable(db.likes.tableName,
    db.likes.rawAttributes).then(() => {
    queryInterface.addConstraint('likes', ['articleId', 'userId'], { type: 'unique', name: 'likes_articleId_userId_key' });
  }),
  down: queryInterface => queryInterface.dropTable('likes')
};
