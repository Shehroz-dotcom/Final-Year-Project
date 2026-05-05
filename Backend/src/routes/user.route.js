import { Router } from 'express';
import {
  registerUser,
  userLogin,
  userLogout,
  userOrder,
  ForgetPassword,
  ResetPassword,
  updateUserProfile,
  saveNutrition,
  userHealthProfile,
  Recommendation,
  DownloadPersonalProfile
} from '../controllers/userControllers/index.js';

const userRouter = Router();

userRouter.route('/register').post(registerUser);
userRouter.route('/login').post(userLogin);
userRouter.route('/logout').post(userLogout);
userRouter.route('/order').post(userOrder);
userRouter.route('/forget-password').post(ForgetPassword);
userRouter.route('/reset-password/:token').post(ResetPassword);
userRouter.route('/updateUserProfile/:id').post(updateUserProfile);
userRouter.route('/saveNutritions').post(saveNutrition);
userRouter.route('/healthProfile').post(userHealthProfile);
userRouter.route('/personalizedRecommendation').get(Recommendation);
userRouter.route('/downloadPersonalProfile').get(DownloadPersonalProfile)

export { userRouter };
