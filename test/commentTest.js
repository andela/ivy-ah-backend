import dotenv from 'dotenv';
import supertest from 'supertest';
import { expect } from 'chai';
import app from '../src/index';
import models from '../src/models';

dotenv.config();
let currentToken = 'token';
let articleId;
let testCommentId = 9999;

const wrongCommentId = 'd6e3119c-9b4f-46ca-8395-2ee2d43c2dd3';

describe('Test for user should be able to make comments', () => {
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
    currentToken = result.body.user.token;
    expect(result.status).to.be.equal(201);
  });

  it('should create an article', async () => {
    const result = await supertest(app)
      .post('/api/v1/articles')
      .set('authorization', currentToken)
      .send({
        description: 'this is the new description',
        title: 'this is the true new title of the article',
        body: 'this is the new body of the body',
        tagList: ['thoisfd'],
        plainText: 'jsjfosdf'
      });
    articleId = result.body.article.id;
    expect(result.status).to.equal(201);
  });

  it('should not create comment for unauthenticated users', async () => {
    const result = await supertest(app)
      .post(`/api/v1/comments/${articleId}`)
      .send({
        body: 'this is a test comment this is a test comment this is a test comment this is a test comment',
      });
    expect(result.status).to.be.equal(401);
  });

  it('should comment on an article', async () => {
    const result = await supertest(app)
      .post(`/api/v1/comments/${articleId}`)
      .set('authorization', currentToken)
      .send({
        body: 'this is a test comment this is a test comment this is a test comment this is a test comment',
      });
    testCommentId = result.body.comment.id;
    expect(result.status).to.be.equal(201);
    expect(result.body.comment.body).to.deep.equal('this is a test comment this is a test comment this is a test comment this is a test comment');
  });

  it('should comment on a comment', async () => {
    const result = await supertest(app)
      .post(`/api/v1/comments/reply/${testCommentId}`)
      .set('authorization', currentToken)
      .send({
        body: 'this is commenting to a another comment .... this is commenting to a another comment',
      });
    expect(result.status).to.be.equal(201);
    expect(result.body.comment.body).to.deep.equal('this is commenting to a another comment .... this is commenting to a another comment');
  });
  it('should comment on an article', async () => {
    const result = await supertest(app)
      .post(`/api/v1/comments/${articleId}`)
      .set('authorization', currentToken)
      .send({
        body: 'testing for what',
        highlightedText: 'this is a test comment',
        textPosition: 11
      });
    expect(result.status).to.be.equal(201);
    expect(result.body.comment.body).to.deep.equal('testing for what');
  });
  it('should get a comment to an article', async () => {
    const result = await supertest(app)
      .get(`/api/v1/comments/${articleId}`);
    expect(result.status).to.be.equal(200);
    expect(result.body.comments[0].body).to.deep.equal('this is a test comment this is a test comment this is a test comment this is a test comment');
  });

  it('should get a reply to a comment', async () => {
    const result = await supertest(app)
      .get(`/api/v1/comments/reply/${testCommentId}`);
    expect(result.status).to.be.equal(200);
    expect(result.body.comments[0].body).to.deep.equal('this is commenting to a another comment .... this is commenting to a another comment');
  });

  it('should not post comment on unknown resource', async () => {
    const result = await supertest(app)
      .post('/api/v1/comments/reply/43c756bf-d6cc-4804-a4fe-9d9413c8e033')
      .set('authorization', currentToken)
      .send({
        body: 'this is a test comment this is a test comment',
      });
    expect(result.status).to.be.equal(404);
    expect(result.body.error).to.deep.equal('article does not exist');
  });

  it('should not get comment on unknown resource', async () => {
    const result = await supertest(app)
      .get('/api/v1/comments/reply/43c754bf-d6cc-6804-a4fe-9d9413c8e033');
    expect(result.status).to.be.equal(200);
    expect(result.body.comments).to.deep.equal([]);
  });

  it('it should like a comment', async () => {
    const result = await supertest(app)
      .put(`/api/v1/comments/likes/${testCommentId}/like`)
      .set('authorization', currentToken)
      .expect(200);
    expect(result.status).to.equal(200);
    expect(result.body).to.be.an('object');
    expect(result.body).to.have.property('data');
    expect(result.body.data.option).to.equal(true);
    expect(result.body.data.likes).to.equal(1);
    expect(result.body.data.dislikes).to.equal(0);
  });

  it('it should remove a previous like an comment', async () => {
    const result = await supertest(app)
      .put(`/api/v1/comments/likes/${testCommentId}/like`)
      .set('authorization', currentToken)
      .expect(200);
    expect(result.status).to.equal(200);
    expect(result.body).to.be.an('object');
    expect(result.body).to.have.property('data');
    expect(result.body.data.option).to.equal(null);
    expect(result.body.data.likes).to.equal(0);
    expect(result.body.data.dislikes).to.equal(0);
  });

  it('it should dislike a comment', async () => {
    const result = await supertest(app)
      .put(`/api/v1/comments/likes/${testCommentId}/dislike`)
      .set('authorization', currentToken)
      .expect(200);
    expect(result.status).to.equal(200);
    expect(result.body).to.be.an('object');
    expect(result.body).to.have.property('data');
    expect(result.body.data.option).to.equal(false);
    expect(result.body.data.likes).to.equal(0);
    expect(result.body.data.dislikes).to.equal(1);
  });

  it('it should remove a previous dislike an comment', async () => {
    const result = await supertest(app)
      .put(`/api/v1/comments/likes/${testCommentId}/dislike`)
      .set('authorization', currentToken)
      .expect(200);
    expect(result.status).to.equal(200);
    expect(result.body).to.be.an('object');
    expect(result.body).to.have.property('data');
    expect(result.body.data.option).to.equal(null);
    expect(result.body.data.likes).to.equal(0);
    expect(result.body.data.dislikes).to.equal(0);
  });
  it('should edit a comment', async () => {
    const result = await supertest(app)
      .patch(`/api/v1/comments/${testCommentId}`)
      .set('authorization', currentToken)
      .send({
        body: 'First edit'
      });
    expect(result.status).to.be.equal(200);
    expect(result.body.comment).to.be.an('object');
    expect(result.body.comment).to.have.property('id');
    expect(result.body.comment).to.have.property('body');
    expect(result.body.comment.body).to.deep.equal('First edit');
  });

  it('should return an error if editing a comment that does not exist', async () => {
    const result = await supertest(app)
      .patch(`/api/v1/comments/${wrongCommentId}`)
      .set('authorization', currentToken)
      .send({
        body: 'First edit'
      });
    expect(result.status).to.be.equal(404);
    expect(result.body.error).to.deep.equal('comment does not exist');
  });

  it('should delete a comment', async () => {
    const result = await supertest(app)
      .delete(`/api/v1/comments/${testCommentId}`)
      .set('authorization', currentToken);
    expect(result.status).to.be.equal(200);
    expect(result.body.message).to.deep.equal('comment deleted');
  });

  it('should return an error if deletind a comment that has already been deleted', async () => {
    const result = await supertest(app)
      .delete(`/api/v1/comments/${wrongCommentId}`)
      .set('authorization', currentToken);
    expect(result.status).to.be.equal(404);
    expect(result.body.error).to.deep.equal('comment does not exist');
  });
});


describe('Test for comment reporting', () => {
  it('should create an article', async () => {
    const result = await supertest(app)
      .post('/api/v1/articles')
      .set('authorization', currentToken)
      .send({
        description: 'this is the new description',
        title: 'this is the true new title of the article',
        body: 'this is the new body of the body',
        tagList: ['thoisfd'],
        plainText: 'jsjfosdf'
      });
    articleId = result.body.article.id;
    expect(result.status).to.equal(201);
  });

  it('should comment on an article', async () => {
    const result = await supertest(app)
      .post(`/api/v1/comments/${articleId}`)
      .set('authorization', currentToken)
      .send({
        body: 'Initial comment',
      });
    testCommentId = result.body.comment.id;
    expect(result.status).to.be.equal(201);
  });

  it('should edit a comment', async () => {
    const result = await supertest(app)
      .patch(`/api/v1/comments/${testCommentId}`)
      .set('authorization', currentToken)
      .send({
        body: 'First edit'
      });
    expect(result.status).to.be.equal(200);
    expect(result.body.comment).to.be.an('object');
    expect(result.body.comment).to.have.property('id');
    expect(result.body.comment).to.have.property('body');
    expect(result.body.comment.body).to.deep.equal('First edit');
  });

  it('should report a comment', async () => {
    const result = await supertest(app)
      .post(`/api/v1/comments/report/${testCommentId}`)
      .set('authorization', currentToken)
      .send({
        reason: 'comment is too short'
      });
    expect(result.status).to.be.equal(201);
    expect(result.body.report).to.deep.be.an('object');
    expect(result.body.report).to.have.property('commentid');
    expect(result.body.report).to.have.property('reason');
    expect(result.body.report).to.have.property('userid');
  });

  it('should return an error if the same comment is reported twice', async () => {
    const result = await supertest(app)
      .post(`/api/v1/comments/report/${testCommentId}`)
      .set('authorization', currentToken)
      .send({
        reason: 'comment is too short'
      });
    expect(result.status).to.be.equal(409);
    expect(result.body.error).to.deep.equal('comment already reported by user');
  });

  it('should get all reported comments', async () => {
    const result = await supertest(app)
      .get('/api/v1/comments/report')
      .set('authorization', currentToken);
    expect(result.status).to.be.equal(200);
    expect(result.body.data).to.be.an('array');
    expect(result.body.data[0]).to.be.an('object');
  });

  it('should delete reported comments', async () => {
    const result = await supertest(app)
      .delete(`/api/v1/comments/report/${testCommentId}`)
      .set('authorization', currentToken);
    expect(result.status).to.be.equal(200);
    expect(result.body.message).to.deep.equal('delete request successful');
  });

  it('should get all reported comments', async () => {
    const result = await supertest(app)
      .get('/api/v1/comments/report')
      .set('authorization', currentToken);
    expect(result.status).to.be.equal(200);
    expect(result.body.data).to.deep.equal([]);
  });
});
