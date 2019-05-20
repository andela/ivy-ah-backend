import dotenv from 'dotenv';
import supertest from 'supertest';
import { expect } from 'chai';
import app from '../src/index';
import models from '../src/models';

dotenv.config();
const api = supertest.agent(app);

let resetToken;

describe('Test for password reset functionality', () => {
  before(async () => {
    await models.sequelize.sync({ force: true });
  });

  it('should create a new user', (done) => {
    api.post('/api/v1/users/signup').send({
      username: 'supremedev',
      email: 'test@test.com',
      password: '12345678'
    })
      .end((err, res) => {
        expect(res.status).to.eql(201);
        done();
      });
  });

  it('should send an email with password reset link', (done) => {
    api.post('/api/v1/users/forgotpassword').send({
      email: 'test@test.com',
      url: 'http://localhost:3000/api/v1'
    })
      .end((err, res) => {
        resetToken = res.body.passwordResetToken;
        expect(res).to.have.property('status');
        expect(res.status).to.eql(200);
        expect(res.body.message).to.eql('A password reset link has been sent to your email');
        done();
      });
  });

  it('should return an error if email is not in the database', (done) => {
    api.post('/api/v1/users/forgotpassword').send({
      email: 'tester@test.com',
      url: 'http://localhost:3000/api/v1'
    })
      .end((err, res) => {
        expect(res).to.have.property('status');
        expect(res.status).to.eql(404);
        expect(res.body.error).to.eql('user does not exists');
        done();
      });
  });

  it('should successfully reset a user password', (done) => {
    api.patch(`/api/v1/users/resetpassword?resetToken=${resetToken}`).send({
      password: '11111111'
    })
      .end((err, res) => {
        expect(res).to.have.property('status');
        expect(res.status).to.eql(200);
        expect(res.body.message).to.eql('Your password was successfully changed');
        done();
      });
  });

  it('should return an error if the reset link is used twice', (done) => {
    api.patch(`/api/v1/users/resetpassword?resetToken=${resetToken}`).send({
      password: '11111111'
    })
      .end((err, res) => {
        expect(res).to.have.property('status');
        expect(res.status).to.eql(401);
        expect(res.body.error).to.eql('The password reset link has expired, kindly request for a new reset link');
        done();
      });
  });

  it('should return an error if the token is not the right format', (done) => {
    api.patch('/api/v1/users/resetpassword?resetToken=hsjsskskksksks').send({
      password: '11111111',
    })
      .end((err, res) => {
        expect(res.status).to.eql(422);
        expect(res).to.have.property('status')
          .to.be.equals(422);
      });
    done();
  });
});
