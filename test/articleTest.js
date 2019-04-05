import { expect } from 'chai';
import supertest from 'supertest';
import app from '../src/index';
import models from '../src/models';

const server = supertest.agent(app);

const user = {
  email: 'edosa@gmail.com',
  password: 'this is my password',
  username: 'edosa',
};

let testToken;
before(async () => {
  await models.sequelize.sync({ force: true });
  const result = await server
    .post('/api/v1/users/signup')
    .send(user);
  testToken = result.body.user.token;
});

describe('Article', () => {
  it('SHOULD CREATE AN ARTICLE', async () => {
    const result = await server
      .post('/api/v1/articles')
      .set('authorization', testToken)
      .send({
        description: 'this is the new description',
        title: 'this is the true new title of the article',
        body: 'this is the new body of the body',
        tagList: ['thoisfd'],
        plainText: 'jsjfosdf'
      })
      .expect(201);
    expect(result.status).to.equal(201);
    expect(result.body).to.be.an('object');
    expect(result.body).to.have.property('article');
    expect(result.body.article).to.have.property('slug');
    expect(result.body.article).to.have.property('title');
    expect(result.body.article).to.have.property('author');
    expect(result.body.article).to.have.property('description');
    expect(result.body.article).to.have.property('tagList');
  });

  it('SHOULD THROW AN ERROR IS REQUIRED REQUEST FIELD ARE NOT PROVIDED', async () => {
    const result = await server
      .post('/api/v1/articles')
      .set('authorization', testToken)
      .send({
        tagList: ['thoisfd'],
        plainText: 'jsjfosdf'
      })
      .expect(422);
    expect(result.status).to.equal(422);
    expect(result.body).to.be.an('object');
    expect(result.body).to.have.property('error');
  });
});

describe('Test for rating articles', () => {
  before(async () => {
    await models.sequelize.sync({ force: true });
    await server
      .post('/api/v1/articles')
      .send({
        description: 'the begining',
        title: 'the dawn of civilization',
        body: 'this is how civilization began',
        tagList: ['history'],
        rawtext: 'howcivilizations',
        author: 'jake@gmail.com',
      });
  });
  it('should return 200 if rating is successful ', async () => {
    const result = await server
      .post('/api/v1/articles/rating')
      .send({
        user,

      });
    expect(result.status).to.be.equal(201);
  });
  it('');
});
