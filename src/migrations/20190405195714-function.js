'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createFunction

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
