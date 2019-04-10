import db from '../models';

module.exports = {
  up: queryInterface => queryInterface.createTable(db.users.tableName,
    db.users.rawAttributes),
  down: queryInterface => queryInterface.dropTable('users')
};
