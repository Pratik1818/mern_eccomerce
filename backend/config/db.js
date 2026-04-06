import mongoose from 'mongoose';

// Use DB_URI from env; default to local Ecommerce DB if not set
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/Ecommerce';

export const ConnectMongoDatabase = () => {
  mongoose
    .connect(DB_URI)
    .then((data) => {
      console.log(`MongoDB connected: ${data.connection.host} / DB: ${data.connection.name}`);
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
    });
};