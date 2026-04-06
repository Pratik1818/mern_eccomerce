import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../redux/slices/orderSlice';
import { selectCartItems, selectCartTotal } from '../redux/slices/cartSlice';

export default function Shipping() {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const itemsPrice = useSelector(selectCartTotal);
  const { loading, error, currentOrder } = useSelector((state) => state.order);

  const shippingPrice = 50;
  const taxPrice = Math.round(itemsPrice * 0.18);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const orderItems = cartItems.map((i) => ({
    name: i.product.name,
    price: i.product.price,
    quantity: i.quantity,
    image: i.product.image,
    product: i.product._id,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createOrder({
      orderItems,
      shippingInfo: { address, city, state, country, pinCode, phoneNo },
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })).then((result) => {
      if (result.meta?.requestStatus === 'fulfilled') navigate('/checkout/payment');
    });
  };

  if (cartItems.length === 0 && !currentOrder) {
    return (
      <div>
        <p>Cart is empty.</p>
        <button type="button" onClick={() => navigate('/')}>Go to shop</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h1>Shipping Address</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.75rem' }}>
          <label>Address</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <label>City</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <label>State</label>
          <input value={state} onChange={(e) => setState(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <label>Country</label>
          <input value={country} onChange={(e) => setCountry(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <label>Pin Code</label>
          <input value={pinCode} onChange={(e) => setPinCode(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <label>Phone</label>
          <input value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        <p>Items: ₹{itemsPrice} | Shipping: ₹{shippingPrice} | Tax: ₹{taxPrice} | Total: ₹{totalPrice}</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Creating order...' : 'Continue to Payment'}</button>
      </form>
    </div>
  );
}
