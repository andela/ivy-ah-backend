module.exports = {
  up: (queryInterface, Sequelize) => Promise.resolve()
    .then(() => queryInterface.createTable('users', {
      username: {
        type: Sequelize.STRING(50),
        unique: false,
        field: 'user_name',
      },
      firstname: {
        type: Sequelize.STRING(255),
        field: 'first_name',
        allowNull: true
      },
      lastname: {
        type: Sequelize.STRING(255),
        field: 'last_name',
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {
          isEmail: true
        },
        unique: true
      },
      password: {
        type: Sequelize.TEXT
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true

      },
      image: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, { indexes: [{ unique: true, fields: ['email', 'username'] }] })),

  down(queryInterface) {
    queryInterface.sequelize.dropTable('users');
  },
};
