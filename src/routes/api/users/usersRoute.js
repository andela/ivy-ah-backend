import express from 'express';
import {
  userSignup,
  userLogin
} from './auth';
import { sendPasswordResetToken, resetPassword, } from './passwordReset';
import validate from '../../../middlewares/validator';

const usersRoute = express.Router();

usersRoute.post('/signup', validate.userSignup, userSignup);
usersRoute.post('/login', validate.userLogin, userLogin);
usersRoute.post('/forgotpassword', validate.forgotPassword, sendPasswordResetToken);
usersRoute.patch('/resetpassword', validate.resetPassword, resetPassword);

export default usersRoute;
