import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearProduct } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.products);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearProduct());
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity: qty }));
    navigate('/cart');
  };

  if (loading) return <p>Loading...</p>;
  if (error || !product) return <p>{error || 'Product not found'}</p>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <img src={product.image?.[0]?.url || '/placeholder.png'} alt={product.name} style={{ width: 320, height: 320, objectFit: 'cover', borderRadius: 8 }} />
      <div>
        <h1>{product.name}</h1>
        <p>₹{product.price}</p>
        <p>{product.description}</p>
        <p>Category: {product.category} | Stock: {product.stock}</p>
        <div style={{ marginTop: '1rem' }}>
          <label>Qty: </label>
          <input type="number" min={1} max={product.stock} value={qty} onChange={(e) => setQty(Number(e.target.value))} style={{ width: 60 }} />
        </div>
        <button type="button" onClick={handleAddToCart} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Add to Cart</button>
      </div>
    </div>
  );
}
