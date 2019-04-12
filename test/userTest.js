import dotenv from 'dotenv';
import supertest from 'supertest';
import { expect } from 'chai';
import app from '../src/index';
import models from '../src/models';

dotenv.config();
let currentToken = 'notoken';
let Userid;

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
    Userid = result.body.users[0].id;
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
  it('should return an object profile in the users table', async () => {
    const result = await supertest(app)
      .get(`/api/v1/profiles/${Userid}`);
    expect(result.body).to.be.an('object');
    expect(result).to.have.property('status')
      .to.be.equals(200);
    expect(result.body).to.have.property('profile')
      .to.be.an('object');
  });
  it('should return an error for profile not found ', async () => {
    const result = await supertest(app)
      .get('/api/v1/profiles/95a98249-6e45-49ef-a9a9-848505bdfe0e');
    expect(result.body).to.be.an('object');
    expect(result).to.have.property('status')
      .to.be.equals(404);
    expect(result.body).to.have.property('errors');
  });
});

describe('Test for update details', () => {
  before(async () => {
    await models.sequelize.sync({ force: true });
  });
  it('should create a new user', async () => {
    const result = await supertest(app)
      .post('/api/v1/users/signup')
      .send({
        username: 'kissess',
        email: 'cosssys@coos.com',
        password: 'aapppplee',
      });
    currentToken = result.body.user.token;
    expect(result.status).to.be.equal(201);
  });
  it('should update user details', async () => {
    const result = await supertest(app)
      .patch('/api/v1/users')
      .set('Authorization', currentToken)
      .send({
        username: 'mycheck',
        email: 'cosssy@coos.com',
      });
    expect(result.body).to.be.an('object');
    expect(result).to.have.property('status')
      .to.be.equals(200);
    expect(result.body).to.have.property('user');
    expect(result.body.user).to.have.property('username')
      .to.be.equals('mycheck');
  });
  it('should return error for empty request body', async () => {
    const result = await supertest(app)
      .patch('/api/v1/users')
      .set('Authorization', currentToken)
      .send({});
    expect(result.body).to.be.an('object');
    expect(result).to.have.property('status')
      .to.be.equals(422);
    expect(result.body).to.have.property('error')
      .to.be.equals('"value" must contain at least one of [username, email, firstname, lastname]');
  });
});
