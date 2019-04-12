import db from '../models';

module.exports = {
  up: queryInterface => queryInterface.createTable(db.bookmark.tableName,
    db.bookmark.rawAttributes).then(() => {
    queryInterface.addConstraint('bookmarks', ['article', 'user'], {
      type: 'unique'
    });
  }),
  down: queryInterface => queryInterface.dropTable('bookmarks')
};
