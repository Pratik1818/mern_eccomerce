import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, updateProfile } from '../redux/slices/authSlice';

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ name, email })).then(() => setEdit(false));
  };

  if (loading && !user) return <p>Loading...</p>;
  if (error && !user) return <p style={{ color: 'red' }}>{error}</p>;
  if (!user) return null;

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h1>Profile</h1>
      {!edit ? (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <button type="button" onClick={() => setEdit(true)}>Edit</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '0.75rem' }}>
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <button type="submit" disabled={loading}>Save</button>
          <button type="button" onClick={() => setEdit(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
}
