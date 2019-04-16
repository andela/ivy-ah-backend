import db from '../models';

module.exports = {
  up: queryInterface => queryInterface.createTable(db.archivedComments.tableName,
    db.archivedComments.rawAttributes),
  down: queryInterface => queryInterface.dropTable('archivedComments')
};
