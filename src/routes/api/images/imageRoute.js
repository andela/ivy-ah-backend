import { Router } from 'express';
import authenticator from '../../../middlewares/authorization';
import imageController from './imageController';

const imageRoute = Router();
const { uploadImage, deleteImage } = imageController;

imageRoute.post('/', authenticator, uploadImage);
imageRoute.delete('/', authenticator, deleteImage);

export default imageRoute;
