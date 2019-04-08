import db from '../models';

module.exports = {
  up: queryInterface => queryInterface.createTable(db.followings.tableName,
    db.followings.rawAttributes),
  down: queryInterface => queryInterface.dropTable('followings'),
};
