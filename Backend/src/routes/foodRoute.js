import { Router } from 'express';
import {
  addFood,
  listFood,
  deleteFood,
  getFoodDetails,
  updateFood,
} from '../controllers/foodControllers/index.js';
import { upload } from '../middleware/multer.middleware.js';

const foodRouter = Router();

// When someone makes a POST request to /add with a form that includes a file named FoodPic,
// Multer (upload.fields) will first handle the file upload.
// Then, your controller function addFood will execute, probably saving the food info to the database.
//image feild name in the frontend is foodPic
foodRouter.route('/addFood').post(upload.single('foodPic'), addFood);
// in frontend  input feild name for the  get food image is foodPic

//list all foods in db
foodRouter.route('/listFood').get(listFood);
//deelte food from db
foodRouter.route('/deleteFood').post(deleteFood);
foodRouter.route('/getFoodDetails').get(getFoodDetails);
foodRouter.route('/updateFood').put(updateFood);

export  {foodRouter};
