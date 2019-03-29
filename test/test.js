import dotenv from 'dotenv';
import { expect } from 'chai';
import joiValidator from '../src/middlewares/validator/validator';
import authenticator from '../src/helpers/authenticator';

dotenv.config();

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
