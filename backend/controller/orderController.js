import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import HandleError from '../utils/handleError.js';
import handleAsyncError from '../middleware/handleAsyncError.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Lazy Razorpay instance so server starts without keys; payment routes will fail until env is set
function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new HandleError('Razorpay keys not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in env.', 503);
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

/**
 * Create order from cart (orderItems + shippingInfo). Payment is done separately via Razorpay.
 */
export const createOrder = handleAsyncError(async (req, res, next) => {
  const { orderItems, shippingInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  if (!orderItems || !orderItems.length) {
    return next(new HandleError('No order items', 400));
  }
  if (!shippingInfo?.address || !shippingInfo?.city || !shippingInfo?.state || !shippingInfo?.country || !shippingInfo?.pinCode || !shippingInfo?.phoneNo) {
    return next(new HandleError('Please provide complete shipping address', 400));
  }

  const order = await Order.create({
    user: req.user.id,
    orderItems,
    shippingInfo,
    itemsPrice: itemsPrice ?? 0,
    taxPrice: taxPrice ?? 0,
    shippingPrice: shippingPrice ?? 0,
    totalPrice: totalPrice ?? 0,
  });

  res.status(201).json({ success: true, order });
});

/**
 * Get orders for logged-in user
 */
export const getMyOrders = handleAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, orders });
});

/**
 * Admin: get all orders
 */
export const getAllOrders = handleAsyncError(async (req, res, next) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.status(200).json({ success: true, orders });
});

/**
 * Admin: update order status (e.g. Processing -> Shipped -> Delivered)
 */
export const updateOrderStatus = handleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new HandleError('Order not found', 404));

  order.orderStatus = req.body.status ?? order.orderStatus;
  if (req.body.status === 'Delivered') {
    order.deliveredAt = new Date();
  }
  await order.save();

  res.status(200).json({ success: true, order });
});

/**
 * Create Razorpay order (returns order id and amount for frontend to open checkout)
 */
export const createRazorpayOrder = handleAsyncError(async (req, res, next) => {
  const { amount, orderId: ourOrderId } = req.body; // amount in INR (paise not needed, Razorpay accepts rupees)
  if (!amount || amount <= 0) {
    return next(new HandleError('Invalid amount', 400));
  }

  const options = {
    amount: Math.round(Number(amount) * 100), // Razorpay expects amount in paise
    currency: 'INR',
    receipt: ourOrderId || `receipt_${Date.now()}`,
  };

  const razorpayOrder = await getRazorpay().orders.create(options);
  res.status(200).json({
    success: true,
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  });
});

/**
 * Verify Razorpay payment signature and update order payment info
 */
export const verifyPayment = handleAsyncError(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return next(new HandleError('Missing payment verification data', 400));
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return next(new HandleError('Payment verification failed', 400));
  }

  const order = await Order.findById(orderId);
  if (!order) return next(new HandleError('Order not found', 404));
  if (order.user.toString() !== req.user.id) {
    return next(new HandleError('Not authorized to update this order', 403));
  }

  order.paymentInfo = {
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    status: 'paid',
  };
  order.paidAt = new Date();
  order.orderStatus = 'Processing';
  await order.save();

  res.status(200).json({ success: true, message: 'Payment verified', order });
});
