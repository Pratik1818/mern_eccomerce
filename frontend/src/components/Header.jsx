import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { selectCartItems } from '../redux/slices/cartSlice';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartItems = useSelector(selectCartItems);
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logo}>MERN Shop</Link>
      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>Products</Link>
        <Link to="/cart" style={styles.link}>Cart {cartCount > 0 && `(${cartCount})`}</Link>
        {isAuthenticated ? (
          <>
            <Link to="/profile" style={styles.link}>Profile</Link>
            <Link to="/orders" style={styles.link}>Orders</Link>
            {user?.role === 'admin' && <Link to="/admin/dashboard" style={styles.link}>Admin</Link>}
            <button type="button" onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: '#1a1a2e',
    color: '#eee',
  },
  logo: { color: '#eee', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.25rem' },
  nav: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
  link: { color: '#eee', textDecoration: 'none' },
  btn: { background: '#e94560', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' },
};
