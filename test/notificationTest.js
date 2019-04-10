import dotenv from 'dotenv';
import supertest from 'supertest';
import { expect } from 'chai';
import io from 'socket.io-client';
import app from '../src/index';
import models from '../src/models';

dotenv.config();
let token1;
let token2;
let articleId;

describe('Tests for real time notifications using websocket', () => {
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
    token1 = result.body.user.token;
    expect(result.status).to.be.equal(201);
  });

  it('should create a new user', async () => {
    const result = await supertest(app)
      .post('/api/v1/users/signup')
      .send({
        username: 'kisses',
        email: 'cosssy@coos1.com',
        password: 'aapppplee',
      });
    token2 = result.body.user.token;
    expect(result.status).to.be.equal(201);
  });

  it('should create an article', async () => {
    const result = await supertest(app)
      .post('/api/v1/articles')
      .set('authorization', token1)
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
      .set('authorization', token2)
      .send({
        body: 'this is a test comment this is a test comment this is a test comment this is a test comment',
      });
    expect(result.status).to.be.equal(201);
    expect(result.body.comment.body).to.equal('this is a test comment this is a test comment this is a test comment this is a test comment');
  });


  it('should comment on an article', async () => {
    const result = await supertest(app)
      .post(`/api/v1/comments/${articleId}`)
      .set('authorization', token2)
      .send({
        body: 'testing for what',
        highlightedText: 'this is a test comment',
        textPosition: 11
      });
    expect(result.status).to.be.equal(201);
    expect(result.body.comment.body).to.deep.equal('testing for what');
  });

  it('should get comment notifications', async () => {
    const result = await supertest(app)
      .get('/api/v1/notifications/comments')
      .set('authorization', token1)
      .expect(200);
    expect(result.status).to.be.equal(200);
    expect(result.body.data).to.be.an('array');
  });

  it('should clear notifications', async () => {
    const result = await supertest(app)
      .patch('/api/v1/notifications/comments/clear')
      .set('authorization', token1)
      .expect(200);
    expect(result.status).to.be.equal(200);
    expect(result.body.message).to.equal('notifications cleared');
  });

  it('should get no comment notifications', async () => {
    const result = await supertest(app)
      .get('/api/v1/notifications/comments')
      .set('authorization', token1)
      .expect(200);
    expect(result.status).to.be.equal(200);
    expect(result.body.data).to.deep.equal([]);
  });
});

let socket;
let socket2;
let commentId;
describe('real time notifications', () => {
  it('should get connection error "not authorized"', async () => {
    const error = await new Promise((res) => {
      socket = io('http://localhost:3000', {
        path: '/api/v1/socket/notifications',
        transports: ['false', 'websocket'],
        query: {
          authorization: 'wrong token'
        },
        transportOptions: {
          polling: {
            extraHeaders: {}
          }
        }
      });

      socket.on('error', data => res(data));
    });
    expect(error).to.equal('Not authorized');
  });

  it('should connect successfully', async () => {
    const response = await new Promise((res) => {
      socket = io('http://localhost:3000', {
        path: '/api/v1/socket/notifications',
        transports: ['false', 'websocket'],
        query: {
          authorization: token1
        },
        transportOptions: {
          polling: {
            extraHeaders: {}
          }
        }
      });

      socket2 = io('http://localhost:3000', {
        path: '/api/v1/socket/notifications',
        transports: ['false', 'websocket'],
        query: {
          authorization: token2
        },
        transportOptions: {
          polling: {
            extraHeaders: {}
          }
        }
      });

      socket.on('connect', () => res('connection successful'));
    });

    expect(response).to.equal('connection successful');
  });

  it('should create an article', async () => {
    const result = await supertest(app)
      .post('/api/v1/articles')
      .set('authorization', token1)
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

  it('should should get notification on new comment', async () => {
    const result = await supertest(app)
      .post(`/api/v1/comments/${articleId}`)
      .set('authorization', token2)
      .send({
        body: 'this is a test comment this is a test comment this is a test comment this is a test comment',
      });

    commentId = result.body.comment.id;

    const notif = await new Promise((res) => {
      socket.on('comment', data => res(data));
    });

    expect(result.status).to.be.equal(201);
    expect(result.body.comment.body).to.equal('this is a test comment this is a test comment this is a test comment this is a test comment');
    expect(notif.comment).to.deep.equal(result.body.comment);
  });

  it('should should get notification on reply to a comment', async () => {
    const result = await supertest(app)
      .post(`/api/v1/comments/reply/${commentId}`)
      .set('authorization', token1)
      .send({
        body: 'this is a test comment this is a test comment this is a test comment this is a test comment',
      });

    const notif = await new Promise((res) => {
      socket2.on('comment reply', data => res(data));
    });

    expect(result.status).to.be.equal(201);
    expect(result.body.comment.body).to.equal('this is a test comment this is a test comment this is a test comment this is a test comment');
    expect(notif.reply).to.deep.equal(result.body.comment);
  });

  it('should clear notification on a particular article', async () => {
    socket.emit('clear notifications', articleId);

    const notif = await new Promise((res) => {
      socket.on('clear notifications', data => res(data));
    });

    expect(notif).to.deep.equal('notifications cleared');
  });

  it('should clear notification on all articles', async () => {
    socket.emit('clear notifications', '');

    const notif = await new Promise((res) => {
      socket.on('clear notifications', data => res(data));
    });

    expect(notif).to.deep.equal('notifications cleared');
  });

  it('should notify on wrong article id format', async () => {
    socket.emit('clear notifications', 'wrong-uuid-2019');

    const notif = await new Promise((res) => {
      socket.on('clear notifications', data => res(data));
    });

    expect(notif).to.deep.equal('uuid format incorrect');
  });


  it('should comment on an article', async () => {
    const result = await supertest(app)
      .post(`/api/v1/comments/${articleId}`)
      .set('authorization', token2)
      .send({
        body: 'testing for what',
        highlightedText: 'this is a test comment',
        textPosition: 11
      });
    expect(result.status).to.be.equal(201);
    expect(result.body.comment.body).to.deep.equal('testing for what');
  });
});
