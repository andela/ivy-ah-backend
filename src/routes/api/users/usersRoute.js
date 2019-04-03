import express from 'express';
import { userSignup, userLogin, } from './auth';
import validate from '../../../middlewares/validator';


const usersRoute = express.Router();

usersRoute.post('/signup', validate.userSignup, userSignup);
usersRoute.post('/login', validate.userLogin, userLogin);

export default usersRoute;
