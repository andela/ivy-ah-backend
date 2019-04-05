import db from '../models';

module.exports = {
  up: queryInterface => queryInterface.createTable(
    db.ratings.tableName,
    db.ratings.rawAttributes,
  ).then(() => {
    queryInterface.addConstraint('ratings', ['article', 'user'], {
      type: 'primary key',
      name: 'ratings_pkey'
    });
  }),
  down: queryInterface => queryInterface.dropTable('ratings')
};
