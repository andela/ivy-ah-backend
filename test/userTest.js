import dotenv from 'dotenv';
import supertest from 'supertest';
import { expect } from 'chai';
import app from '../src/index';
import models from '../src/models';

dotenv.config();
let currentToken = 'notoken';

describe('Test for user Login', () => {
  before(async () => {
    await models.sequelize.sync({ force: true });
  });
  it('should create a new user', async () => {
    const result = await supertest(app)
      .post('/api/v1/users/signup')
      .send({
        username: 'kisses',
        email: 'cosssy@coos.com',
        password: 'aapppplee',
      });
    expect(result.status).to.be.equal(201);
  });
  it('should return 200 for correct credentials', async () => {
    const result = await supertest(app)
      .post('/api/v1/users/login')
      .send({
        email: 'cosssy@coos.com',
        password: 'aapppplee'
      });
    currentToken = result.body.user.token;
    expect(result.status).to.be.equal(200);
  });
  it('should return 400 for incorrect password', async () => {
    const result = await supertest(app)
      .post('/api/v1/users/login')
      .send({
        email: 'cosssy@coos.com',
        password: 'victor00',
      });
    expect(result.status).to.be.equal(400);
  });
  it('should return 404 for incorrect email', async () => {
    const result = await supertest(app)
      .post('/api/v1/users/login')
      .send({
        email: 'cosssy@coo.com',
        password: 'aapppplee',
      });
    expect(result.status).to.be.equal(400);
  });
  it('should return an object', async () => {
    const result = await supertest(app)
      .post('/api/v1/users/login')
      .send({
        email: 'cosssy@coos.com',
        password: 'aapppplee'
      });
    expect(result).to.be.an('object');
    expect(result.body.user).to.have.property('email');
    expect(result.body.user).to.have.property('token');
    expect(result.body.user).to.have.property('bio');
    expect(result.body.user).to.have.property('image');
    expect(result.body.user).to.have.property('username');
  });
  it('should return an array of users in the table', async () => {
    const result = await supertest(app)
      .get('/api/v1/users')
      .set('Authorization', currentToken);
    expect(result.body).to.be.an('object');
    expect(result).to.have.property('status')
      .to.be.equals(200);
    expect(result.body).to.have.property('users')
      .to.be.an('array');
    expect(result.body.users[0]).to.have.property('email')
      .to.be.equals('cosssy@coos.com');
    expect(result.body.users[0]).to.have.property('bio');
    expect(result.body.users[0]).to.have.property('image');
    expect(result.body.users[0]).to.have.property('username')
      .to.be.equals('kisses');
  });
});
