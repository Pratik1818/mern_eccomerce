import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createRazorpayOrder, verifyPayment, clearCurrentOrder } from '../redux/slices/orderSlice';
import { clearCart } from '../redux/slices/cartSlice';

const loadScript = (src) =>
  new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Payment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentOrder, loading, error } = useSelector((state) => state.order);
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    if (!currentOrder) {
      navigate('/cart');
    }
  }, [currentOrder, navigate]);

  const handlePayment = async () => {
    if (!currentOrder) return;
    setPayLoading(true);
    const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!RAZORPAY_KEY) {
      alert('Razorpay key not configured. Set VITE_RAZORPAY_KEY_ID in .env');
      setPayLoading(false);
      return;
    }
    const loaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!loaded) {
      alert('Razorpay script failed to load');
      setPayLoading(false);
      return;
    }
    const { orderId } = await dispatch(createRazorpayOrder({ amount: currentOrder.totalPrice, orderId: currentOrder._id })).unwrap();
    const options = {
      key: RAZORPAY_KEY,
      amount: currentOrder.totalPrice * 100,
      currency: 'INR',
      name: 'MERN Shop',
      order_id: orderId,
      handler: async (res) => {
        await dispatch(verifyPayment({
          razorpay_order_id: res.razorpay_order_id,
          razorpay_payment_id: res.razorpay_payment_id,
          razorpay_signature: res.razorpay_signature,
          orderId: currentOrder._id,
        })).unwrap();
        dispatch(clearCart());
        dispatch(clearCurrentOrder());
        navigate('/orders', { state: { message: 'Order placed successfully!' } });
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => {
      setPayLoading(false);
      alert('Payment failed');
    });
    rzp.open();
    setPayLoading(false);
  };

  if (!currentOrder) return null;

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h1>Payment</h1>
      <p>Order total: ₹{currentOrder.totalPrice}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="button" onClick={handlePayment} disabled={payLoading || loading}>
        {payLoading || loading ? '...' : 'Pay with Razorpay'}
      </button>
    </div>
  );
}
