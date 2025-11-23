import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import apiRoutes from './api/index.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import config from './config/index.js';

const app = express();

const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 1000 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

app.use(globalRateLimiter)

app.use(cors({
  origin: config.app.frontend,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api', apiRoutes);

app.use(errorHandler);

export default app;
