import connectDB from './db/index.js';
import dotenv from 'dotenv';
import { app } from './app.js';

// dotenv.config({
//   path: './.env',
// });
dotenv.config({});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`server is listning at  port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(' mongoo db error  connection failed !!! ', err);
  });
