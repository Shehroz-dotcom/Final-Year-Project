import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import {
  foodRouter,
  userRouter,
  AuthRouter,
  orderRouter,
  reviewRouter,
  cloudRouter,
  sendContactEmailrouter,
  AdminRouter,
  nlpRouter,
  paymentRouter,
  chatBotRouter,
} from './routes/index.js';

const app = express();

// ✅ CORS
// ✅ CORS
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : [];

console.log('Allowed Origins:', allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests from Postman / curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('CORS Blocked:', origin);
        callback(null, false); // do NOT throw error
      }
    },
    credentials: true,
  })
);

// ✅ JSON / URL Encoded (only for non-multipart routes)
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// ✅ Static + cookies
app.use(express.static('Public'));
app.use(cookieParser());

// ✅ Routes (AFTER parsers)
//geting address cordinatess api
//nlp routes
app.use('/api/v1/nlp', nlpRouter);

// Contact Routes
app.use('/api/v1/contact', sendContactEmailrouter);

app.get('/test', (req, res) => {
  res.send('Backend working');
});

//payment routes
app.use('/api/v1/payment', paymentRouter);
//food routes
app.use('/api/v1/food', foodRouter);
//user routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/review', reviewRouter);
//cloud kitchen routes
app.use('/api/v1/cloud', cloudRouter);
//admin routes
app.use('/api/v1/admin', AdminRouter);
app.use('/api/v1/chatbot', chatBotRouter);

//payment Routes
// app.use('/api/v1/payment',paymentRouter);

app.get('/', (req, res) => {
  res.send('Api working');
});

export { app };
