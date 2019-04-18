import db from '../models';

module.exports = {
  up: queryInterface => queryInterface.createTable(db.reportedComments.tableName,
    db.reportedComments.rawAttributes).then(() => queryInterface.addConstraint('reportedComments', ['commentid', 'userid'], {
    type: 'unique'
  })),
  down: queryInterface => queryInterface.dropTable('reportedComments')
};
