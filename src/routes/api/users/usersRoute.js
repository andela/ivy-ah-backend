import express from 'express';
import {
  userSignup, userLogin, getAUser, updateUser
} from './auth';
import validate from '../../../middlewares/validator';


const usersRoute = express.Router();

usersRoute.post('/signup', validate.userSignup, userSignup);
usersRoute.post('/login', validate.userLogin, userLogin);
usersRoute.get('/profile/:email', getAUser);
usersRoute.put('/user', updateUser);


export default usersRoute;
