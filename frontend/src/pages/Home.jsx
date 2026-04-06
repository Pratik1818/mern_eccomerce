import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { Link } from 'react-router-dom';

export default function Home() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const { products, loading, error, totalPages, currentPage } = useSelector((state) => state.products);

  useEffect(() => {
    const params = { page, limit: 8 };
    if (keyword) params.keyword = keyword;
    if (category) params.category = category;
    dispatch(fetchProducts(params));
  }, [dispatch, page, keyword, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    const p = {};
    if (keyword) p.keyword = keyword;
    if (category) p.category = category;
    p.page = 1;
    setSearchParams(p);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1>Products</h1>
      <form onSubmit={handleSearch} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ padding: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '0.5rem' }}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {products?.map((p) => (
          <Link key={p._id} to={`/product/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden', padding: '0.5rem' }}>
              <img src={p.image?.[0]?.url || '/placeholder.png'} alt={p.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
              <h3 style={{ margin: '0.5rem 0', fontSize: '1rem' }}>{p.name}</h3>
              <p style={{ margin: 0 }}>₹{p.price}</p>
            </div>
          </Link>
        ))}
      </div>
      {totalPages > 1 && (
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button disabled={currentPage <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
