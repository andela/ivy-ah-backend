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
let articleId;

before(async () => {
  await models.sequelize.sync({ force: true });
  const result = await server
    .post('/api/v1/users/signup')
    .send(user);
  testToken = result.body.user.token;
});

describe('Article', () => {
  it('should create an article', async () => {
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
    articleId = result.body.article.id;
  });

  it('should throw an error is required request field are not provided', async () => {
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

describe('artilce search', () => {
  it('return a result after the search', async () => {
    await server
      .post('/api/v1/articles')
      .set('authorization', testToken)
      .send({
        description: 'this is the new description',
        title: 'this is the true new title of the article',
        body: 'this is the new body of the body',
        tagList: ['thoisfd'],
        plainText: 'jsjfosdf',
      })
      .expect(201);

    await server
      .post('/api/v1/articles')
      .set('authorization', testToken)
      .send({
        description: 'this is the new description',
        title: 'this is the true new title of the article',
        body: 'this is the new body of the body',
        tagList: ['article', 'article', 'another tag'],
        plainText: 'jsjfosdf',
      })
      .expect(201);

    const result = await server.get('/api/v1/articles/search').send({
      tags: ['thoisfd']
    }).expect(200);
    expect(result.status).to.equal(200);
    expect(result.body.parameters.tags).to.deep.equal(['thoisfd']);
    expect(result.body.data[0].title).to.deep.equal('this is the true new title of the article');
    expect(result.body.data[0].description).to.equal('this is the new description');
  });

  it('return an error on failed validation', async () => {
    const result = await server.get('/api/v1/articles/search').send({
      keyword: 15
    }).expect(422);
    expect(result.status).to.equal(422);
    expect(result.body.error.keyword).to.deep.equal('keyword must be a string');
  });
  it('should return paginated list of all articles', async () => {
    const articles = await server.get('/api/v1/articles/?page=1&limit=4');
    expect(articles.status).to.equal(200);
    expect(articles.body).to.be.an('object');
    expect(articles.body).to.have.property('status');
    expect(articles.body).to.have.property('numberOfArticles');
    expect(articles.body).to.have.property('numberOfPages');
    expect(articles.body).to.have.property('articles');
  });
  it('should return all articles', async () => {
    const articles = await server.get('/api/v1/articles/');
    expect(articles.status).to.equal(200);
    expect(articles.body).to.be.an('object');
    expect(articles.body).to.have.property('status');
    expect(articles.body).to.have.property('articles');
    expect(articles.body).to.have.property('numberOfArticles');
  });
});

describe('Article rating', () => {
  it('should rate an article', async () => {
    const result = await server
      .post('/api/v1/articles/rating')
      .set('authorization', testToken)
      .send({
        articleId: `${articleId}`,
        rating: 4
      })
      .expect(201);
    expect(result.status).to.equal(201);
    expect(result.body).to.be.an('object');
    expect(result.body).to.have.property('data');
    expect(result.body.data).to.have.property('rating');
    expect(result.body.data).to.have.property('articleId');
    expect(result.body.data).to.have.property('id');
  });

  it('should return the same rating of an article', async () => {
    const result = await server
      .post('/api/v1/articles/rating')
      .set('authorization', testToken)
      .send({
        articleId: `${articleId}`,
        rating: 4
      })
      .expect(200);
    expect(result.status).to.equal(200);
    expect(result.body).to.be.an('object');
    expect(result.body).to.have.property('data');
    expect(result.body.data).to.have.property('rating');
    expect(result.body.data).to.have.property('articleId');
  });

  it('should update the rating of an article', async () => {
    const result = await server
      .post('/api/v1/articles/rating')
      .set('authorization', testToken)
      .send({
        articleId: `${articleId}`,
        rating: 3
      });
    expect(result.status).to.equal(200);
    expect(result.body).to.be.an('object');
    expect(result.body).to.have.property('data');
    expect(result.body.data).to.have.property('rating');
    expect(result.body.data).to.have.property('articleId');
    expect(result.body.data).to.have.property('id');
  });

  it('should update the rating of an article', async () => {
    const result = await server
      .post('/api/v1/articles/rating')
      .set('authorization', testToken)
      .send({
        articleId: 'd14077b9-1432-49c8-9f73-699d2c9796c3',
        rating: 3
      });
    expect(result.status).to.equal(404);
    expect(result.body).to.be.an('object');
    expect(result.body).to.have.property('error');
  });

  it('should get the total rating of an article', async () => {
    const result = await server
      .get(`/api/v1/articles/rating/${articleId}`)
      .set('authorization', testToken)
      .expect(200);
    expect(result.status).to.equal(200);
    expect(result.body.data).to.be.an('object');
    expect(result.body.data).to.have.property('totalRating');
    expect(result.body.data).to.have.property('articleId');
  });
});

describe('article like', () => {
  it('it should like an article', async () => {
    const result = await server
      .put(`/api/v1/articles/likes/${articleId}/like`)
      .set('authorization', testToken)
      .expect(200);
    expect(result.status).to.equal(200);
    expect(result.body).to.be.an('object');
    expect(result.body).to.have.property('data');
    expect(result.body.data.option).to.equal(true);
    expect(result.body.data.likes).to.equal('1');
    expect(result.body.data.dislikes).to.equal(null);
  });

  it('it should remove a previous like an article', async () => {
    const result = await server
      .put(`/api/v1/articles/likes/${articleId}/like`)
      .set('authorization', testToken)
      .expect(200);
    expect(result.status).to.equal(200);
    expect(result.body).to.be.an('object');
    expect(result.body).to.have.property('data');
    expect(result.body.data.option).to.equal(null);
    expect(result.body.data.likes).to.equal(null);
    expect(result.body.data.dislikes).to.equal(null);
  });

  it('it should dislike an article', async () => {
    const result = await server
      .put(`/api/v1/articles/likes/${articleId}/dislike`)
      .set('authorization', testToken)
      .expect(200);
    expect(result.status).to.equal(200);
    expect(result.body).to.be.an('object');
    expect(result.body).to.have.property('data');
    expect(result.body.data.option).to.equal(false);
    expect(result.body.data.likes).to.equal(null);
    expect(result.body.data.dislikes).to.equal('1');
  });

  it('it should remove a previous dislike an article', async () => {
    const result = await server
      .put(`/api/v1/articles/likes/${articleId}/dislike`)
      .set('authorization', testToken)
      .expect(200);
    expect(result.status).to.equal(200);
    expect(result.body).to.be.an('object');
    expect(result.body).to.have.property('data');
    expect(result.body.data.option).to.equal(null);
    expect(result.body.data.likes).to.equal(null);
    expect(result.body.data.dislikes).to.equal(null);
  });
});
