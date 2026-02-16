import { Router } from 'express';
import addReview from '../controllers/foodControllers/addReview.controller.js';

const reviewRouter = Router()
reviewRouter.route("/addReview").post(addReview);
export {reviewRouter}