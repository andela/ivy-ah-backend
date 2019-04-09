import express from 'express';
import Profile from './Profile';


const profileRoute = express.Router();

profileRoute.get('/:email', Profile.getAProfile);
export default profileRoute;
