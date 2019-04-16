import db from '../models';

module.exports = {
  up: queryInterface => queryInterface.createTable(db.comment.tableName,
    db.comment.rawAttributes),
  down: queryInterface => queryInterface.dropTable('comment')
};
