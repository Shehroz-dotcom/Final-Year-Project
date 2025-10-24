import { Router } from 'express';
import { checkAuth } from '../controllers/AuthController/AuthController.js';
const AuthRouter = Router();

AuthRouter.route('/checkAuth').get(checkAuth);

export { AuthRouter };
