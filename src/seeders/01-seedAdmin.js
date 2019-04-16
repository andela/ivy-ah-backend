import uuid from 'uuid';
import { config } from 'dotenv';
import passwordHash from '../helpers/PasswordHasher';

config();
const hashedPassword = passwordHash.hashPassword(process.env.PASSWORD);
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [{
      id: uuid(),
      user_name: 'ivyadmin',
      first_name: 'Kayode',
      isVerified: true,
      role: 'admin',
      last_name: 'Okunlade',
      email: 'ivyadmin@gmail.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuid(),
      user_name: 'ivymoderator',
      first_name: 'Joyce',
      isVerified: true,
      role: 'moderator',
      last_name: 'obi',
      email: 'ivymoderator@gmail.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: uuid(),
      user_name: 'ivyuser',
      first_name: 'Jesse',
      isVerified: true,
      role: 'user',
      last_name: 'Omoefe',
      email: 'ivyuser@gmail.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
