import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRoutes from './api/index.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api', apiRoutes);

app.use(errorHandler);

export default app;
