import { Router } from 'express';
import {
  registerUser,
  userLogin,
  userLogout,
  userOrder,
  ForgetPassword,
  ResetPassword,
  updateUserProfile
} from '../controllers/userControllers/index.js';

const userRouter = Router();

userRouter.route('/register').post(registerUser);
userRouter.route('/login').post(userLogin);
userRouter.route('/logout').post(userLogout);
userRouter.route('/order').post(userOrder);
userRouter.route('/forget-password').post(ForgetPassword);
userRouter.route('/reset-password/:token').post(ResetPassword)
userRouter.route('/updateUserProfile/:id').post(updateUserProfile)

export { userRouter };
