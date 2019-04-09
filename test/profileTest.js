import { expect } from 'chai';
import supertest from 'supertest';
import app from '../src/index';
import models from '../src/models';

const server = supertest.agent(app);

const user = {
  username: 'profy',
  email: 'profileowner@gmail.com',
  password: '12345',
};


before(async () => {
  await models.sequelize.sync({ force: true });
  await server
    .post('/api/v1/users/signup')
    .send(user);
});

describe('Profile', () => {
  it('SHOULD GET PROFILE', async () => {
    const result = await server
      .get('/api/v1/profiles/profileowner@gmail.com')
      .expect(200);
    expect(result.status).to.equal(200);
    expect(result.body).to.be.an('object');
  });
  it('should return 404 for profile not found', async () => {
    const result = await server
      .get('/api/v1/profiles/rofileowner@gmail.com')
      .expect(404);
    expect(result.status).to.equal(404);
  });
});
