import React from 'react';
import { useSocket } from '../context/SocketContext';

export default function Navbar({ currentView, setCurrentView, cartCount, onOpenCart }) {
  const { connected, orders } = useSocket();

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(10, 13, 20, 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '14px 24px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Logo & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-gold) 0%, #785a14 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
          }}>
            👑
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: '700',
                letterSpacing: '0.5px'
              }} className="gold-gradient-text">
                Aura Royale Bistro
              </span>
              <span style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: connected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: connected ? '#10b981' : '#ef4444',
                border: `1px solid ${connected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span className="live-dot" style={{
                  backgroundColor: connected ? '#10b981' : '#ef4444',
                  animation: connected ? 'pulse-green 2s infinite' : 'none'
                }}></span>
                {connected ? 'LIVE SYNC' : 'OFFLINE'}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Real-Time Smart Dining & Kitchen Management
            </p>
          </div>
        </div>

        {/* View Switcher & Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* View Toggle Tabs */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-secondary)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => setCurrentView('customer')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: currentView === 'customer' ? 'var(--accent-gold)' : 'transparent',
                color: currentView === 'customer' ? '#0a0d14' : 'var(--text-secondary)',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🍽️ Customer Menu
            </button>

            <button
              onClick={() => setCurrentView('admin')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: currentView === 'admin' ? 'var(--accent-gold)' : 'transparent',
                color: currentView === 'admin' ? '#0a0d14' : 'var(--text-secondary)',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                position: 'relative'
              }}
            >
              ⚡ Admin Portal
              {pendingCount > 0 && (
                <span style={{
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  borderRadius: '10px',
                  fontSize: '0.65rem',
                  padding: '1px 6px',
                  fontWeight: '800'
                }}>
                  {pendingCount}
                </span>
              )}
            </button>
          </div>

          {/* Customer Cart Trigger */}
          {currentView === 'customer' && (
            <button
              className="btn-primary"
              onClick={onOpenCart}
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              🛒 Cart
              {cartCount > 0 && (
                <span style={{
                  backgroundColor: '#0a0d14',
                  color: 'var(--accent-gold)',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: '800'
                }}>
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
