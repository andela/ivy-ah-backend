import { Router } from 'express';
import authenticator from '../../../middlewares/authorization';
import bookmarkController from './bookmarkController';

const { addBookmark, getBookmarks, removeBookmark } = bookmarkController;

const bookmarkRoute = Router();

bookmarkRoute.get('/', authenticator, getBookmarks);
bookmarkRoute.post('/', authenticator, addBookmark);
bookmarkRoute.delete('/', authenticator, removeBookmark);


export default bookmarkRoute;
