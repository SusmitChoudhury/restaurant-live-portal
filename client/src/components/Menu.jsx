import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useSocket } from '../context/SocketContext';
import { IconCart, IconCheck } from './Icons';
import { CATEGORIES } from '../data/defaultMenu';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [toast, setToast] = useState(null);
  const { addToCart, cart, updateQty } = useCart();
  const { menu } = useSocket();

  const filtered = activeCategory === 'All'
    ? menu
    : menu.filter(item => item.category === activeCategory);

  const handleAddToCart = (item) => {
    if (item.isAvailable === false) return;
    addToCart(item);
    setToast(item.name);
    setTimeout(() => setToast(null), 2500);
  };

  const getCartQty = (id) => {
    const found = cart.find(i => i.id === id);
    return found ? found.qty : 0;
  };

  return (
    <section id="menu" className="section" style={{ backgroundColor: 'var(--color-background-dark)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '2.5rem' }}>
          <span className="section-subtitle">Culinary Masterpieces</span>
          <h2 className="section-title">Our Curated Menu</h2>
          <p style={{ marginTop: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '650px', margin: '1.25rem auto 0', lineHeight: '1.8' }}>
            Explore artisanal delicacies crafted with love. Filter by category, add to cart, and order directly from your table with instant kitchen dispatch.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
              {cat !== 'All' && (
                <span style={{ marginLeft: '6px', opacity: 0.6, fontSize: '0.75rem' }}>
                  ({menu.filter(i => i.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          {filtered.map((item) => {
            const qty = getCartQty(item.id);
            const isAvailable = item.isAvailable !== false;

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'var(--color-background-card)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: isAvailable ? '0 6px 24px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.4)',
                  transition: 'all 0.35s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  border: isAvailable ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(239, 68, 68, 0.3)',
                  opacity: isAvailable ? 1 : 0.75,
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (isAvailable) {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.35)';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isAvailable) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.2)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }
                }}
              >
                {/* Image Container */}
                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                      filter: isAvailable ? 'none' : 'grayscale(80%)'
                    }}
                    onMouseEnter={(e) => {
                      if (isAvailable) e.currentTarget.style.transform = 'scale(1.06)';
                    }}
                    onMouseLeave={(e) => {
                      if (isAvailable) e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=80';
                    }}
                  />

                  {/* Category Pill */}
                  <div style={{
                    position: 'absolute',
                    top: '0.6rem',
                    left: '0.6rem',
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(8px)',
                    color: 'var(--color-accent)',
                    padding: '0.25rem 0.7rem',
                    borderRadius: '50px',
                    fontSize: '0.65rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    {item.category}
                  </div>

                  {/* Out of Stock Ribbon / Overlay */}
                  {!isAvailable && (
                    <div style={{
                      position: 'absolute',
                      top: '0.6rem',
                      right: '0.6rem',
                      backgroundColor: 'rgba(239, 68, 68, 0.9)',
                      color: '#fff',
                      padding: '0.25rem 0.7rem',
                      borderRadius: '50px',
                      fontSize: '0.65rem',
                      fontWeight: '800',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                    }}>
                      Out of Stock
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.05rem', margin: 0, lineHeight: '1.3' }}>{item.name}</h3>
                    <span style={{
                      color: isAvailable ? 'var(--color-accent)' : 'var(--color-text-muted)',
                      fontWeight: '700',
                      fontSize: '1.05rem',
                      fontFamily: 'var(--font-heading)',
                      whiteSpace: 'nowrap',
                    }}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', marginBottom: '1rem', flexGrow: 1, lineHeight: '1.5' }}>
                    {item.description}
                  </p>

                  {/* Add to Cart / Quantity / Unavailable Button */}
                  {!isAvailable ? (
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled
                      style={{
                        width: '100%',
                        opacity: 0.6,
                        cursor: 'not-allowed',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                        color: '#f87171',
                        border: '1px solid rgba(239, 68, 68, 0.25)'
                      }}
                    >
                      Currently Unavailable
                    </button>
                  ) : qty === 0 ? (
                    <button
                      className="btn btn-outline btn-sm"
                      style={{ width: '100%' }}
                      onClick={() => handleAddToCart(item)}
                    >
                      <IconCart s={14} /> Add to Cart
                    </button>
                  ) : (
                    <div className="qty-control" style={{ width: '100%', justifyContent: 'center' }}>
                      <button className="qty-btn" onClick={() => updateQty(item.id, qty - 1)}>−</button>
                      <span className="qty-value">{qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, qty + 1)}>+</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="toast" style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#19382c',
          border: '1px solid var(--color-accent)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 900,
          animation: 'fadeIn 0.3s ease'
        }}>
          <IconCheck s={16} style={{ color: 'var(--color-accent)' }} />
          <span><strong>{toast}</strong> added to order!</span>
        </div>
      )}
    </section>
  );
}
