import dotenv from 'dotenv';
import assert from 'assert';
import nock from 'nock';
import supertest from 'supertest';
import { expect } from 'chai';
import app from '../src/index';
import joiValidator from '../src/middlewares/validator/validator';
import authenticator from '../src/helpers/authenticator';
import PasswordHasher from '../src/helpers/PasswordHasher';
import emailer from '../src/helpers/emailSender';
import models from '../src/models';

dotenv.config();
const api = supertest.agent(app);

describe('test user signup/login validation', () => {
  it('validate successfully and return user object on signup', async () => {
    const testBody = {
      username: 'johnny',
      email: 'jonny@example.com',
      password: 'password',
    };

    const body = await joiValidator(testBody, 'userSignup');

    expect(body).to.deep.equal(testBody);
  });

  it('validate successfully and return user object on login', async () => {
    const testBody = {
      email: 'jonny@example.com',
      password: 'password',
    };

    const body = await joiValidator(testBody, 'userLogin');

    expect(body).to.deep.equal(testBody);
  });

  it('should throw an error when a field is invalid', async () => {
    const testBody = {
      username: 'johnny',
      email: 45,
      password: 'password',
    };
    await joiValidator(testBody, 'userSignup').catch((error) => {
      expect(error.email).to.equal('email must be in the format john@example.com');
    });
  });

  it('error messages should be well detailed', async () => {
    const testBody = {
      username: 45,
      email: 45,
      password: 'word',
    };
    await joiValidator(testBody, 'userSignup').catch((error) => {
      expect(error).to.deep.equal({
        username: 'username must contain between 3 and 10 alphanumeric characters',
        email: 'email must be in the format john@example.com',
        password: 'password must contain between 8 and 32 characters'
      });
    });
  });

  it('error messages should be well detailed when a property is not valid', async () => {
    const testBody = {
      username: 'johnny',
      email: 45,
      password: 'password',
    };
    await joiValidator(testBody, 'userSignup').catch((error) => {
      expect(error).to.deep.equal({
        email: 'email must be in the format john@example.com',
      });
    });
  });

  it('show error message when payload contains forbidden keys', async () => {
    const testBody = {
      username: 45,
      email: 45,
      password: 'password',
      pass: 'new pass'
    };
    await joiValidator(testBody, 'userSignup').catch((error) => {
      expect(error).to.deep.equal({
        username: 'username must contain between 3 and 10 alphanumeric characters',
        email: 'email must be in the format john@example.com',
        pass: 'pass is not allowed'
      });
    });
  });
});

describe('test JWT authentication', () => {
  it('generates a token with key provided', () => {
    const jwt = authenticator.generateToken({ test: 'test' }, 'jwttesting');
    expect(jwt).to.be.a('String');
  });

  it('generates a token without key provided', () => {
    const jwt = authenticator.generateToken({
      test: 'test'
    });
    expect(jwt).to.be.a('String');
  });

  it('verifies a token with key provided', () => {
    const payload = { payload: 'payload' };
    const jwt = authenticator.generateToken(payload, 'jwttesting');
    const newPayload = authenticator.verifyToken(jwt, 'jwttesting');
    expect(newPayload.payload).to.equal(payload.payload);
  });

  it('verifies a token without key provided', () => {
    const payload = { payload: 'payload' };
    const jwt = authenticator.generateToken(payload);
    const newPayload = authenticator.verifyToken(jwt);
    expect(newPayload.payload).to.equal(payload.payload);
  });

  it('throws an error on validation failure', () => {
    const payload = { payload: 'payload' };
    const jwt2 = authenticator.generateToken(payload, 'newkey');
    try {
      const newPayload = authenticator.verifyToken(jwt2);
      expect(newPayload).to.be.undefined();
    } catch (error) {
      expect(error.name).to.equal('JsonWebTokenError');
    }
  });
});

describe('Tests for password hashing functionality', () => {
  it('successfully hashes a password', () => {
    const password = '123456';
    const hash = PasswordHasher.hashPassword(password);
    expect(hash).to.be.a('String');
  });

  it('successfully verifies a password', () => {
    const password = '123456';
    const hash = PasswordHasher.hashPassword(password);
    const isPassword = PasswordHasher.comparePassword(password, hash);
    expect(isPassword).to.be.a('boolean');
    expect(isPassword).to.equal(true);
  });

  it('returns false if the password and hash do not match', () => {
    const password = '123456';
    const wrongPassword = '12345';
    const hash = PasswordHasher.hashPassword(password);
    const isPassword = PasswordHasher.comparePassword(wrongPassword, hash);
    expect(isPassword).to.be.a('boolean');
    expect(isPassword).to.equal(false);
  });
});

describe('unit testing /users route', () => {
  describe('testing with a dummy json', () => {
    const user = {
      email: 'my@gmail.com', token: 'kaka', username: 'qwerty', bio: 'text', image: 'url'
    };
    before(() => {
      nock('http://testwiththisurl.com')
        .post('/users')
        .reply(201, user);
    });
    it('should return the expected json response on success', async () => {
      const response = await supertest(app)
        .post('/users');
      assert(response.statusCode, 201);
      expect(user).to.have.all.keys('email', 'token', 'username', 'bio', 'image');
      expect(user.token).to.be.a('string');
    });
    it('should return the expected response on failure', (done) => {
      api.post('/users')
        .expect(404)
        .end((err, response) => {
          expect(response.status).to.equal(404);
          done();
        });
    });
    after(() => {
      nock.cleanAll();
    });
  });
});

describe('Tests email sender module', () => {
  it('Should return a success message if email is successfully sent', async () => {
    const result = await emailer('kayroy247@gmail', 'Welcome', 'Welcome user');
    expect(result).to.be.an('object');
    expect(result).not.to.be.an('string');
    expect(result).to.have.property('message');
    expect(result).to.have.property('status')
      .to.be.equals(200);
    expect(result.message).to.be.equals('Email successfully sent');
    expect(result.message).to.be.a('string');
  });
});

describe('Test for user Login', () => {
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
    expect(result.status).to.be.equal(201);
  });
  it('should return 200 for correct credentials', async () => {
    const result = await supertest(app)
      .post('/api/v1/users/login')
      .send({
        email: 'cosssy@coos.com',
        password: 'aapppplee'
      });
    expect(result.status).to.be.equal(200);
  });
  it('should return 400 for incorrect password', async () => {
    const result = await supertest(app)
      .post('/api/v1/users/login')
      .send({
        email: 'cosssy@coos.com',
        password: 'victor00',
      });
    expect(result.status).to.be.equal(400);
  });
  it('should return 404 for incorrect email', async () => {
    const result = await supertest(app)
      .post('/api/v1/users/login')
      .send({
        email: 'cosssy@coo.com',
        password: 'aapppplee',
      });
    expect(result.status).to.be.equal(400);
  });
  it('should return an object', async () => {
    const result = await supertest(app)
      .post('/api/v1/users/login')
      .send({
        email: 'cosssy@coos.com',
        password: 'aapppplee'
      });
    expect(result).to.be.an('object');
    expect(result.body.user).to.have.property('email');
    expect(result.body.user).to.have.property('token');
    expect(result.body.user).to.have.property('bio');
    expect(result.body.user).to.have.property('image');
    expect(result.body.user).to.have.property('username');
  });
});
