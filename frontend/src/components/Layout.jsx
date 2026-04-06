import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh', padding: '1rem' }}>
        <Outlet />
      </main>
    </>
  );
}
