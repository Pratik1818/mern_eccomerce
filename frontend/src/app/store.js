import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice.js';
import productReducer from '../redux/slices/productSlice.js';
import cartReducer from '../redux/slices/cartSlice.js';
import orderReducer from '../redux/slices/orderSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});
