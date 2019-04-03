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


before(async () => {
  await models.sequelize.sync({ force: true });
  await server
    .post('/api/v1/users')
    .send(user);
});

describe('Article', () => {
  it('SHOULD CREATE AN ARTICLE', async () => {
    const result = await server
      .post('/api/v1/articles')
      .send({
        article: {
          description: 'this is the new description',
          title: 'this is the true new title of the article',
          body: 'this is the new body of the body',
          tagList: ['thoisfd'],
          rawtext: 'jsjfosdf',
          author: 'edosa@gmail.com',
        }
      })
      .expect(201);
    expect(result.status).to.equal(201);
    expect(result.body).to.be.an('object');
    expect(result.body).to.have.property('article');
    expect(result.body.article).to.have.property('slug');
  });
});
