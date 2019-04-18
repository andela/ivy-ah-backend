import db from '../models';

module.exports = {
  up: queryInterface => queryInterface.createTable(db.ReadArticles.tableName,
    db.ReadArticles.rawAttributes),
  down: queryInterface => queryInterface.dropTable('ReadArticles'),
};
