import { expect } from 'chai';
import supertest from 'supertest';
import app from '../src/index';

const server = supertest.agent(app);

let firstToken;
let secondToken;
let myArticle;
let myArticleComment;

const firstUser = {
  email: 'vladmir@gmail.com',
  password: 'this is my password',
  username: 'vladmir',
};

const secondUser = {
  email: 'smicer@gmail.com',
  password: 'this is my password',
  username: 'smicer',
};

describe('READING STATISTICS', () => {
  it('should create a user', async () => {
    const firstUserResult = await server
      .post('/api/v1/users/signup')
      .send(firstUser);
    firstToken = firstUserResult.body.user.token;
  });

  it('should create another user', async () => {
    const secondUserResult = await server
      .post('/api/v1/users/signup')
      .send(secondUser);
    secondToken = secondUserResult.body.user.token;
  });

  it('should create an article', async () => {
    const result = await server
      .post('/api/v1/articles')
      .set('authorization', firstToken)
      .send({
        description: 'this is the new description',
        title: 'this is the true new title of the article',
        body: 'this is the new body of the body',
        tagList: ['thoisfd'],
        plainText: 'jsjfosdf'
      })
      .expect(201);
    myArticle = result.body.article.id;
  });

  it('should comment on an article', async () => {
    const result = await supertest(app)
      .post(`/api/v1/comments/${myArticle}`)
      .set('authorization', secondToken)
      .send({
        body: 'this is a test comment',
      });
    myArticleComment = result.body.comment.id;
    expect(result.status).to.be.equal(201);
  });

  it('should rate an article', async () => {
    const result = await server
      .post('/api/v1/articles/rating')
      .set('authorization', secondToken)
      .send({
        articleId: `${myArticle}`,
        rating: 5
      })
      .expect(200);
    expect(result.status).to.equal(200);
  });

  it('it should like an article', async () => {
    const result = await server
      .put(`/api/v1/articles/likes/${myArticle}/like`)
      .set('authorization', secondToken)
      .expect(200);
    expect(result.status).to.equal(200);
  });

  it('should add a bookmark to an article', async () => {
    const result = await server
      .post('/api/v1/bookmarks')
      .set('authorization', secondToken)
      .send({
        article: myArticle,
      });
    expect(result.body.status).to.equal(201);
  });

  it('it should like a comment', async () => {
    const result = await supertest(app)
      .put(`/api/v1/comments/likes/${myArticleComment}/like`)
      .set('authorization', secondToken)
      .expect(200);
    expect(result.status).to.equal(200);
  });

  it('it should dislike a comment', async () => {
    const result = await supertest(app)
      .put(`/api/v1/comments/likes/${myArticleComment}/dislike`)
      .set('authorization', firstToken)
      .expect(200);
    expect(result.status).to.equal(200);
  });

  it('should return a single article for a verified user', async () => {
    const result = await server
      .get(`/api/v1/articles/${myArticle}`)
      .set('authorization', secondToken)
      .expect(200);
    expect(result.status).to.equal(200);
  });

  it('should return the reading stats of a user', async () => {
    const timeline = 30;
    const result = await server
      .get(`/api/v1/reading-statistics/${timeline}`)
      .set('authorization', secondToken)
      .expect(200);
    expect(result.body.data).to.be.an('object');
    expect(result.body.data).to.have.property('readArticles');
    expect(result.body.data).to.have.property('count');
    expect(result.body.data).to.have.property('timeline');
  });
});
