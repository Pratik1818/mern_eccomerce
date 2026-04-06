import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, setQuantity, selectCartItems, selectCartTotal } from '../redux/slices/cartSlice';

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Your cart is empty.</p>
        <Link to="/">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1>Cart</h1>
      {items.map((item) => (
        <div key={item.product._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
          <img src={item.product.image || '/placeholder.png'} alt={item.product.name} style={{ width: 80, height: 80, objectFit: 'cover' }} />
          <div style={{ flex: 1 }}>
            <Link to={`/product/${item.product._id}`}>{item.product.name}</Link>
            <p>₹{item.product.price}</p>
          </div>
          <input type="number" min={1} value={item.quantity} onChange={(e) => dispatch(setQuantity({ productId: item.product._id, quantity: e.target.value }))} style={{ width: 50 }} />
          <button type="button" onClick={() => dispatch(removeFromCart({ productId: item.product._id }))}>Remove</button>
        </div>
      ))}
      <p><strong>Total: ₹{total}</strong></p>
      <Link to="/checkout/shipping"><button>Proceed to Checkout</button></Link>
    </div>
  );
}
