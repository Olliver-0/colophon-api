import express from 'express';
import cors from 'cors';
import apiRoutes from './api/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.use(errorHandler);

export default app;
