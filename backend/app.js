//const express = require('express');
import express from 'express';
import product from './routes/productRoute.js';
import user from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import errorHandleMiddleware from './middleware/error.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

//route
app.use('/api/v1',product);
app.use('/api/v1',user);

app.use(errorHandleMiddleware);

export default app;