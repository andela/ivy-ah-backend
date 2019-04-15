import db from '../models';

module.exports = {
  up: queryInterface => queryInterface.createTable(db.reportedArticles.tableName,
    db.reportedArticles.rawAttributes).then(() => queryInterface.addConstraint('reportedArticles', ['articleid', 'userid'], {
    type: 'unique'
  })),
  down: queryInterface => queryInterface.dropTable('reportArticles')
};
