import db from '../models';

module.exports = {
  up: queryInterface => queryInterface.createTable(db.ratings.tableName,
    db.ratings.rawAttributes).then(() => {
    queryInterface.addConstraint('ratings', ['userId', 'articleId'], {
      type: 'unique'
    });
  }),
  down: queryInterface => queryInterface.dropTable('ratings')
};
