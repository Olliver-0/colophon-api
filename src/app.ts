import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRoutes from './api/index.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import config from './config/index.js';

const app = express();

app.use(cors({
  origin: config.app.frontend,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api', apiRoutes);

app.use(errorHandler);

export default app;
