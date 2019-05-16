import express from 'express';
import passport from 'passport';
import {
  userSignup,
  userLogin
} from './auth';
import { sendPasswordResetToken, resetPassword, } from './passwordReset';
import validate from '../../../middlewares/validator';
import Users from './userController';
import checkToken from '../../../middlewares/authorization';
import authorizeAdmin from '../../../middlewares/authorizeAdmin';

const usersRoute = express.Router();
const { getUserArticles } = Users;

usersRoute.post('/signup', validate.userSignup, userSignup);
usersRoute.get('/confirmation/:token', Users.confirmEmail);
usersRoute.post('/resendconfirmation', validate.resendMail, Users.resendMail);
usersRoute.post('/login', validate.userLogin, userLogin);
usersRoute.post('/forgotpassword', validate.forgotPassword, sendPasswordResetToken);
usersRoute.patch('/resetpassword', validate.resetPassword, resetPassword);
usersRoute.get('/', checkToken, authorizeAdmin, Users.getAllUsers);
usersRoute.patch('/', validate.validateUpdateUser, checkToken, Users.updateUser);
usersRoute.get('/articles/:userId', checkToken, getUserArticles);
usersRoute.get('/home', (req, res) => {
  res.send('every damn thing is working fine');
});
usersRoute.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
usersRoute.get('/twitter', passport.authenticate('twitter'));
usersRoute.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));
usersRoute.get('/facebookRedirect', passport.authenticate('facebook'), (req, res) => {
  res.redirect(`/api/v1/home?token=${req.user.token}`);
});
usersRoute.get('/twitterRedirect', passport.authenticate('twitter'), (req, res) => {
  res.redirect(`/api/v1/users/home?token=${req.user.token}`);
});
usersRoute.get('/googleRedirect', passport.authenticate('google'), (req, res) => {
  res.redirect(`/api/v1/home?token=${req.user.token}`);
});

export default usersRoute;
