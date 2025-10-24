import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { foodRouter, userRouter, AuthRouter } from './routes/index.js';

const app = express();

// ✅ CORS
const allowedOrigins = process.env.CORS_ORIGIN.split(',').map((o) => o.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('CORS Blocked:', origin);
        callback(new Error('CORS not allowed for: ' + origin));
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
//food routes
app.use('/api/v1/food', foodRouter);
//user routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', AuthRouter);

app.get('/', (req, res) => {
  res.send('Api working');
});

export { app };
