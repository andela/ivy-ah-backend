import dotenv from 'dotenv';
import supertest from 'supertest';
import { expect } from 'chai';
import app from '../src/index';
import models from '../src/models';

dotenv.config();
const api = supertest.agent(app);

let user1Token;
let user2Token;
let user1Id;
let user2Id;
let user3Id;

describe('Tests for user should be able to follow user functionality', () => {
  before(async () => {
    await models.sequelize.sync({ force: true });
  });

  it('should create a new user', (done) => {
    api.post('/api/v1/users/signup').send({
      username: 'supremed',
      email: 'testings@test.com',
      password: '12345678'
    })
      .end((err, res) => {
        expect(res.status).to.eql(201);
        user1Token = res.body.user.token;
        user1Id = res.body.user.userid;
        done();
      });
  });

  it('should create a new user', (done) => {
    api.post('/api/v1/users/signup').send({
      username: 'supremeds',
      email: 'testinxbcs@test.com',
      password: '12345678'
    })
      .end((err, res) => {
        expect(res.status).to.eql(201);
        user2Token = res.body.user.token;
        user2Id = res.body.user.userid;
        done();
      });
  });

  it('should create a new user', (done) => {
    api.post('/api/v1/users/signup').send({
      username: 'supremedsg',
      email: 'testingxbcs@test.com',
      password: '12345678'
    })
      .end((err, res) => {
        expect(res.status).to.eql(201);
        user3Id = res.body.user.userid;
        done();
      });
  });

  it('should follow a user', (done) => {
    api.post(`/api/v1/profiles/${user1Id}/follow`)
      .set('authorization', user2Token)
      .end((err, res) => {
        expect(res.body.status).to.equal(201);
        expect(res.body.message).to.eql('You have successfully followed the author');
        done();
      });
  });

  it('should return an error if user and follower are the same', (done) => {
    api.post(`/api/v1/profiles/${user1Id}/follow`)
      .set('authorization', user1Token)
      .end((err, res) => {
        expect(res.body.status).to.equal(409);
        expect(res.body.error).to.eql('You cannot follow yourself');
        done();
      });
  });

  it('should return an error if the user is already following the author', (done) => {
    api.post(`/api/v1/profiles/${user1Id}/follow`)
      .set('authorization', user2Token)
      .end((err, res) => {
        expect(res.body.status).to.equal(409);
        expect(res.body.error).to.eql('You are already following the author');
        done();
      });
  });

  it('should return an error if the user does not exist', (done) => {
    api.post('/api/v1/profiles/cdab0652-c16c-413d-8ab7-af1f173b0889/follow')
      .set('authorization', user2Token)
      .end((err, res) => {
        expect(res.body.status).to.equal(404);
        expect(res.body.error).to.eql('The Author does not exist');
        done();
      });
  });

  it('should return the followers of a user', (done) => {
    api.get(`/api/v1/profiles/${user1Id}/followers`)
      .set('authorization', user2Token)
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        done();
      });
  });

  it('should return the people following a user', (done) => {
    api.get(`/api/v1/profiles/${user2Id}/following`)
      .set('authorization', user1Token)
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        done();
      });
  });

  it('should unfollow a user', (done) => {
    api.delete(`/api/v1/profiles/${user1Id}/follow`)
      .set('authorization', user2Token)
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        expect(res.body.message).to.eql('You have successfully unfollowed the author');
        done();
      });
  });

  it('should return an error if you are not following the user', (done) => {
    api.delete(`/api/v1/profiles/${user3Id}/follow`)
      .set('authorization', user2Token)
      .end((err, res) => {
        expect(res.body.status).to.equal(404);
        expect(res.body.error).to.eql('You are not following this author');
        done();
      });
  });
});
