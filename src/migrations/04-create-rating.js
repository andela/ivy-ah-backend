import db from '../models';

module.exports = {
  up: queryInterface => queryInterface.createTable(db.ratings.tableName,
    db.ratings.rawAttributes),
  down: queryInterface => queryInterface.dropTable('ratings')
};
