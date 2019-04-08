import 'dotenv/config';
import { readdirSync } from 'fs';
import { basename as _basename, join } from 'path';
import Sequelize from 'sequelize';
import User from './users';

const basename = _basename(__filename);
const db = {};


const sequelize = new Sequelize({ config: process.env.DATABASE_URL, dialect: 'postgres' });

readdirSync(__dirname)
  .filter((file) => {
    const isBasename = (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    return isBasename;
  })
  .forEach((file) => {
    const model = sequelize.import(join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.models = User;

export default db;
