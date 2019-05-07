import db from '../models';

module.exports = {
  up: queryInterface => queryInterface.createTable(db.users.tableName,
    db.users.rawAttributes).then(() => {
    queryInterface.addConstraint('users', ['email'], {
      type: 'unique'
    });
  }),
  down: queryInterface => queryInterface.dropTable('users')
};
