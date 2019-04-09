import { expect } from 'chai';
import supertest from 'supertest';
import app from '../src/index';
import models from '../src/models';

const server = supertest.agent(app);
let testToken;
let articleId;
const fakeToken = 'notoken';

describe('Test for bookmarking articles', () => {
  before(async () => {
    await models.sequelize.sync({ force: true });
  });


  it('should signup a user', async () => {
    const result = await server
      .post('/api/v1/users/signup')
      .send({
        email: 'pascal@mail.com',
        password: '12344557',
        username: 'pascall'
      });
    testToken = result.body.user.token;
  });

  it('should create a new article', async () => {
    const result = await server
      .post('/api/v1/articles')
      .set('authorization', testToken)
      .send({
        description: 'the beginning',
        title: 'the very beginning of all things',
        body: 'let us take it back to how it all began',
        tagList: ['history'],
        plainText: 'historyhowbegan'
      });
    articleId = result.body.article.id;
  });

  it('should add a bookmark to an article', async () => {
    const result = await server
      .post('/api/v1/bookmarks')
      .set('authorization', testToken)
      .send({
        article: articleId,
      });
    expect(result.body.status).to.equal(201);
    expect(result.body).to.have.property('bookmarks');
    expect(result.body.bookmarks).to.have.property('user');
    expect(result.body.bookmarks).to.have.property('article');
  });

  it('should retun all articles a user has bookmarked', async () => {
    const result = await server
      .get('/api/v1/bookmarks')
      .set('authorization', testToken);
    expect(result.body.status).to.equal(200);
    expect(result.body.bookmarks).to.be.an('array');
    expect(result.body.bookmarks[0]).to.have.property('article');
  });

  it('should return an error if you bookmark an article multiple times', async () => {
    const result = await server
      .post('/api/v1/bookmarks')
      .set('authorization', testToken)
      .send({
        article: articleId,
      });
    expect(result.body.status).to.equal(409);
  });

  it('should remove a book mark', async () => {
    const result = await server
      .delete('/api/v1/bookmarks')
      .set('authorization', testToken)
      .send({
        article: articleId,
      });
    expect(result.body.status).to.equal(200);
    expect(result.body.message).to.deep.equal('Bookmark removed');
  });

  it('should return an empty array', async () => {
    const result = await server
      .get('/api/v1/bookmarks')
      .set('authorization', testToken);
    expect(result.status).to.equal(200);
    expect(result.body.bookmarks).to.be.an('array');
    expect(result.body.bookmarks).to.deep.equal([]);
  });

  it('should return an error if article does not exist', async () => {
    const result = await server
      .post('/api/v1/bookmarks')
      .set('authorization', testToken)
      .send({
        article: 'bb62f9f2-7492-4886-b626-44067f8d674e',
      });
    expect(result.body.status).to.equal(404);
    expect(result.body.error).to.deep.equal('Article not found');
  });

  it('shold throw an error if an unauthenticated user tries to bookmark', async () => {
    const result = await server
      .post('/api/v1/bookmarks')
      .set('authorization', fakeToken)
      .send({
        article: articleId,
      });
    expect(result.status).to.equal(401);
  });
});
