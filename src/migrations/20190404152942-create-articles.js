import db from '../models';

module.exports = {
  up: queryInterface => queryInterface.createTable(
    db.articles.tableName,
    db.articles.rawAttributes,
  ),
  down: queryInterface => queryInterface.dropTable('articles')
};
