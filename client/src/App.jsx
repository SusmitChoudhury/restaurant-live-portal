import React, { useState, useEffect } from 'react';
import { SocketProvider, useSocket } from './context/SocketContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import StatsCounter from './components/StatsCounter';
import ChefSpecial from './components/ChefSpecial';
import Menu from './components/Menu';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import TableSelector from './components/TableSelector';
import OrderTracker from './components/OrderTracker';
import AdminDashboard from './components/admin/AdminDashboard';

function MainApp() {
  const { notification } = useSocket();
  const [currentPath, setCurrentPath] = useState(() => {
    // Check pathname, search query (?view=admin), or hash (#admin)
    const path = window.location.pathname.toLowerCase();
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes('/admin') || search.includes('view=admin') || hash.includes('admin')) {
      return '/admin';
    }
    return '/';
  });

  // Handle browser back and forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/admin') || search.includes('view=admin') || hash.includes('admin')) {
        setCurrentPath('/admin');
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CartProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Real-time Order Notification Toast */}
        {notification && (
          <div style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            zIndex: 999,
            backgroundColor: 'var(--color-accent)',
            color: '#0a0d14',
            padding: '12px 20px',
            borderRadius: '10px',
            fontWeight: '800',
            boxShadow: '0 10px 30px rgba(212, 175, 55, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.3s ease'
          }}>
            {notification}
          </div>
        )}

        {/* Route Rendering */}
        {currentPath === '/admin' ? (
          <AdminDashboard onNavigate={navigateTo} />
        ) : (
          <>
            <Navbar onNavigate={navigateTo} />
            <Hero />
            <AboutSection />
            <StatsCounter />
            <ChefSpecial />
            <Menu />
            <Gallery />
            <Testimonials />
            <Footer />

            {/* Overlays */}
            <CartDrawer />
            <TableSelector />
            <OrderTracker />
          </>
        )}
      </div>
    </CartProvider>
  );
}

export default function App() {
  return (
    <SocketProvider>
      <MainApp />
    </SocketProvider>
  );
}
