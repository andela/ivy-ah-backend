import { Router } from 'express';
import admin from './adminController';
import validator from '../../../middlewares/validator';
import authorizeAdmin from '../../../middlewares/authorizeAdmin';
import authorizeModerator from '../../../middlewares/authorizeModerator';
import checkToken from '../../../middlewares/authorization';

const { getAllAdminAndModerators, assignRole } = admin;

const adminRoute = Router();

adminRoute.get('/', checkToken, authorizeModerator, getAllAdminAndModerators);

adminRoute.patch('/role/:id',
  checkToken,
  authorizeAdmin,
  validator.validateRoleUpdate,
  assignRole);

export default adminRoute;
