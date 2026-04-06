import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMyOrders } from '../redux/slices/orderSlice';

export default function MyOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { myOrders, loading, error } = useSelector((state) => state.order);
  const message = location.state?.message;

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  if (!useSelector((state) => state.auth.isAuthenticated)) {
    navigate('/login');
    return null;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1>My Orders</h1>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {myOrders?.length === 0 && !loading && <p>No orders yet.</p>}
      {myOrders?.map((order) => (
        <div key={order._id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: 8 }}>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.orderStatus} | <strong>Total:</strong> ₹{order.totalPrice}</p>
          <p><strong>Placed:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
