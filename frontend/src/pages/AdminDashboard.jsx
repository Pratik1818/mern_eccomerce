import { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [tab, setTab] = useState('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (tab === 'users') {
          const { data } = await api.get('/admin/users');
          setUsers(data.users || []);
        } else if (tab === 'orders') {
          const { data } = await api.get('/admin/orders');
          setOrders(data.orders || []);
        } else {
          const { data } = await api.get('/admin/products');
          setProducts(data.product || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetch();
  }, [tab]);

  const handleOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/admin/order/${orderId}`, { status });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, orderStatus: status } : o)));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button type="button" onClick={() => setTab('orders')}>Orders</button>
        <button type="button" onClick={() => setTab('users')}>Users</button>
        <button type="button" onClick={() => setTab('products')}>Products</button>
      </div>
      {loading && <p>Loading...</p>}
      {tab === 'orders' && (
        <div>
          {orders.map((o) => (
            <div key={o._id} style={{ border: '1px solid #ddd', padding: '0.75rem', marginBottom: '0.5rem' }}>
              <p>{o._id} | {o.orderStatus} | ₹{o.totalPrice}</p>
              <select value={o.orderStatus} onChange={(e) => handleOrderStatus(o._id, e.target.value)}>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      )}
      {tab === 'users' && (
        <ul>
          {users.map((u) => (
            <li key={u._id}>{u.name} - {u.email} ({u.role})</li>
          ))}
        </ul>
      )}
      {tab === 'products' && (
        <ul>
          {products.map((p) => (
            <li key={p._id}>{p.name} - ₹{p.price}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
