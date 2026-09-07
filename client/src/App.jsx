import React, { useState } from 'react';
import { useSocket } from './context/SocketContext';
import Navbar from './components/Navbar';
import TableSelector from './components/TableSelector';
import MenuCard from './components/MenuCard';
import CartDrawer from './components/CartDrawer';
import OrderTracker from './components/OrderTracker';
import AdminDashboard from './components/admin/AdminDashboard';

export default function App() {
  const { menu, activeCustomerOrder, setActiveCustomerOrder, notification } = useSocket();
  const [currentView, setCurrentView] = useState('customer'); // 'customer' | 'admin'
  const [selectedTable, setSelectedTable] = useState(4);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cart operations
  const handleAddToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
    } else {
      setCartItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: newQuantity } : i));
    }
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(prev => prev.filter(i => i.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Real-time Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 300,
          backgroundColor: 'var(--accent-gold)',
          color: '#0a0d14',
          padding: '12px 20px',
          borderRadius: '10px',
          fontWeight: '800',
          boxShadow: '0 10px 25px rgba(212, 175, 55, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'bounceIn 0.3s ease'
        }}>
          {notification}
        </div>
      )}

      {/* Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Dynamic Views */}
      {currentView === 'customer' ? (
        <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', width: '100%', flexGrow: 1 }}>
          {/* Hero Section */}
          <div style={{
            textAlign: 'center',
            marginBottom: '36px',
            padding: '36px 20px',
            background: 'linear-gradient(180deg, rgba(22, 31, 51, 0.7) 0%, rgba(10, 13, 20, 0.4) 100%)',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            position: 'relative'
          }}>
            <span style={{
              fontSize: '0.8rem',
              color: 'var(--accent-gold)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontWeight: '700'
            }}>
              Fine Dining & Artisan Cafe
            </span>
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: '700',
              margin: '8px 0 12px',
              lineHeight: 1.2
            }} className="gold-gradient-text">
              Curated Table Menu
            </h1>
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              maxWidth: '650px',
              margin: '0 auto'
            }}>
              Select your favorite dishes right from your seat. Orders and table requests are instantly dispatched to our head chef via real-time kitchen sync.
            </p>
          </div>

          {/* Table Selector */}
          <TableSelector
            selectedTable={selectedTable}
            onSelectTable={setSelectedTable}
          />

          {/* Active Live Order Tracker (if customer placed an order) */}
          {activeCustomerOrder && (
            <OrderTracker
              order={activeCustomerOrder}
              onClose={() => setActiveCustomerOrder(null)}
            />
          )}

          {/* Menu Items Grid */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: 'var(--text-primary)' }}>
                  Chef's Signature Selections
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Availability is updated dynamically by the kitchen in real-time.
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {menu.map(item => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        </main>
      ) : (
        <AdminDashboard />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        selectedTable={selectedTable}
        onOrderPlaced={(order) => {
          setActiveCustomerOrder(order);
        }}
      />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '24px',
        textAlign: 'center',
        backgroundColor: 'var(--bg-secondary)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <p>© 2026 Aura Royale Bistro. Real-Time Table Management & Kitchen Sync.</p>
      </footer>
    </div>
  );
}
