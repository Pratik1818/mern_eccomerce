import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  createRazorpayOrder,
  verifyPayment,
} from '../controller/orderController.js';
import { verifyUserAuth, roleBasedAccess } from '../middleware/userAuth.js';

const router = express.Router();

// User routes (auth required)
router.post('/order/create', verifyUserAuth, createOrder);
router.get('/orders/me', verifyUserAuth, getMyOrders);
router.post('/order/payment/create', verifyUserAuth, createRazorpayOrder);
router.post('/order/payment/verify', verifyUserAuth, verifyPayment);

// Admin routes
router.get('/admin/orders', verifyUserAuth, roleBasedAccess('admin'), getAllOrders);
router.put('/admin/order/:id', verifyUserAuth, roleBasedAccess('admin'), updateOrderStatus);

export default router;
