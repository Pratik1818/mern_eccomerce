import express from 'express';
import cors from 'cors';
import product from './routes/productRoute.js';
import user from './routes/userRoute.js';
import order from './routes/orderRoute.js';
import cookieParser from 'cookie-parser';
import errorHandleMiddleware from './middleware/error.js';

const app = express();

// CORS: allow frontend origin and credentials (cookies)
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);

app.use(errorHandleMiddleware);

export default app;