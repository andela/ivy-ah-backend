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
let userId;

before(async () => {
  await models.sequelize.sync({ force: true });
  const result = await server
    .post('/api/v1/users/signup')
    .send(user);
  expect(result.body.user).to.be.an('object');
  testToken = result.body.user.token;
  userId = result.body.user.userid;
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

describe('article update', () => {
  it('should not update an article if it doesnt belong to user', async () => {
    const result = await server.patch('/api/v1/articles/04040f11-c6e9-426c-bce7-75e7f6dad14c')
      .set('authorization', testToken)
      .send({
        body: 'it is not good',
        plainText: 'jsjfosdf'
      }).expect(404);
    expect(result.status).to.equal(404);
    expect(result.body.error).to.equal('did not find this article in the list of articles you authored');
  });
  it('should update an article', async () => {
    const result = await server.patch(`/api/v1/articles/${articleId}`)
      .set('authorization', testToken)
      .send({
        body: 'it is not good',
        plainText: 'jsjfosdf'
      }).expect(201);
    expect(result.status).to.equal(201);
  });
  it('should generate a new slog if title was updated', async () => {
    const result = await server.patch(`/api/v1/articles/${articleId}`)
      .set('authorization', testToken)
      .send({
        title: 'the new title',
        body: 'it is not good',
        plainText: 'jsjfosdf'
      }).expect(201);
    expect(result.status).to.equal(201);
    expect(result.body.article).to.have.property('slug');
    expect(result.body.article.body).to.equal('it is not good');
    expect(result.body.article.plainText).to.equal('jsjfosdf');
  });
  it('should calculate the readtime if body was updated', async () => {
    const result = await server.patch(`/api/v1/articles/${articleId}`)
      .set('authorization', testToken)
      .send({
        title: 'the new title',
        body: 'it is not good',
        plainText: 'jsjfosdf'
      }).expect(201);
    expect(result.status).to.equal(201);
    expect(result.body.article).to.have.property('readTime');
    expect(result.body.article.body).to.equal('it is not good');
    expect(result.body.article.plainText).to.equal('jsjfosdf');
  });
});

describe('GET Article', () => {
  it('should return a single article for a verified user', async () => {
    const result = await server
      .get(`/api/v1/articles/${articleId}`)
      .set('authorization', testToken)
      .expect(200);
    expect(result.status).to.equal(200);
    expect(result.body.data).to.be.an('object');
    expect(result.body.data).to.have.property('id');
    expect(result.body.data).to.have.property('slug');
    expect(result.body.data).to.have.property('comments');
    expect(result.body.data).to.have.property('likes');
    expect(result.body.data).to.have.property('ratings');
  });

  it('should return a single article for an unverified user', async () => {
    const result = await server
      .get(`/api/v1/articles/${articleId}`)
      .expect(200);
    expect(result.status).to.equal(200);
    expect(result.body.data).to.be.an('object');
    expect(result.body.data).to.have.property('id');
    expect(result.body.data).to.have.property('slug');
    expect(result.body.data).to.have.property('comments');
    expect(result.body.data).to.have.property('likes');
    expect(result.body.data.likes).to.be.a('number');
    expect(result.body.data).to.have.property('dislikes');
    expect(result.body.data).to.have.property('ratings');
  });

  it('should return an error if the article does not exist', async () => {
    const result = await server
      .get('/api/v1/articles/73d5e6d2-c329-4771-b084-4ee4a20fab67')
      .expect(404);
    expect(result.status).to.equal(404);
    expect(result.body).to.have.property('error');
    expect(result.body.error).to.have.equal('Article not found');
  });

  it('should return an error if the article id is malformed', async () => {
    const result = await server
      .get('/api/v1/articles/73d5e6d2-c329-4771-b084')
      .expect(422);
    expect(result.status).to.equal(422);
    expect(result.body).to.have.property('error');
  });
});

describe('article reporting', () => {
  let articleid;

  it('report an article', async () => {
    const article1 = await server
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
        tagList: ['thoisfd'],
        plainText: 'jsjfosdf',
      })
      .expect(201);

    articleid = article1.body.article.id;

    const result = await server.post('/api/v1/articles/report')
      .set('authorization', testToken).send({
        article: articleid,
        reason: 'it is not good'
      }).expect(201);
    expect(result.status).to.equal(201);
    expect(result.body.message).to.deep.equal('article reported');
  });

  it('report an article', async () => {
    const result = await server.post('/api/v1/articles/report')
      .set('authorization', 'returnerrror').send({
        article: articleid,
        reason: 'it is not good'
      }).expect(401);
    expect(result.status).to.equal(401);
  });

  it('return an error on failed validation', async () => {
    const result = await server.post('/api/v1/articles/report').set('authorization', testToken).send({
      article: 15
    }).expect(422);
    expect(result.status).to.equal(422);
    expect(result.body.error.article).to.deep.equal('article must be a string');
  });

  it('get all reported articles', async () => {
    const result = await server.get('/api/v1/articles/report').set('authorization', testToken).expect(200);
    expect(result.status).to.equal(200);
    expect(result.body.data[0]).to.be.an('object');
    expect(result.body.data[0].article.description).to.equal('this is the new description');
    expect(result.body.data[0].reason).to.equal('it is not good');
  });

  it('remove an article from the reported table', async () => {
    const result = await server.delete(`/api/v1/articles/report/${articleid}`).set('authorization', testToken).expect(200);
    expect(result.status).to.equal(200);
    expect(result.body.message).to.deep.equal('delete request successful');
  });

  it('remove an article that has not been reported', async () => {
    const result = await server.delete(`/api/v1/articles/report/${articleid}`).set('authorization', testToken).expect(404);
    expect(result.status).to.equal(404);
    expect(result.body.message).to.deep.equal('article has not been reported');
  });

  it('report an article twice', async () => {
    await server.post('/api/v1/articles/report')
      .set('authorization', testToken).send({
        article: articleid,
        reason: 'it is not good again'
      }).expect(201);

    const result = await server.post('/api/v1/articles/report')
      .set('authorization', testToken).send({
        article: articleid,
        reason: 'it is not good again'
      }).expect(409);

    expect(result.status).to.equal(409);
    expect(result.body.error).to.deep.equal('article already reported by user');
  });

  it('report a non-existent article', async () => {
    const result = await server.post('/api/v1/articles/report')
      .set('authorization', testToken).send({
        article: '1b9e5ac0-45e5-44b2-bbd1-c330f76f9998',
        reason: 'it is not good again'
      }).expect(404);
    expect(result.status).to.equal(404);
    expect(result.body.error).to.deep.equal('article does not exist');
  });

  it('it should throw a 422 error if given a wrong articleId', async () => {
    const result = await server
      .delete('/api/v1/articles/345353535535353533433')
      .set('authorization', testToken)
      .expect(422);
    expect(result.status).to.equal(422);
  });

  it('it should return the articles created by a specific user', async () => {
    const result = await server
      .get(`/api/v1/users/articles/${userId}`)
      .set('authorization', testToken)
      .expect(200);
    expect(result.status).to.equal(200);
    expect(result.body).to.be.an('object');
    expect(result.body).to.have.property('pageCount');
    expect(result.body).to.have.property('articleCount');
    expect(result.body).to.have.property('currentPage');
    expect(result.body).to.have.property('articles');
  });
  // please note that this test must run last because it deletes the test article
  it('it should delete an article', async () => {
    const result = await server
      .delete(`/api/v1/articles/${articleId}`)
      .set('authorization', testToken)
      .expect(200);
    expect(result.status).to.equal(200);
  });

  it('it should not find a deleted article', async () => {
    const result = await server
      .delete(`/api/v1/articles/${articleId}`)
      .set('authorization', testToken)
      .expect(404);
    expect(result.status).to.equal(404);
  });
});
