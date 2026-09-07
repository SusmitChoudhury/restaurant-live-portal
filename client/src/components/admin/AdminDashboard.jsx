import React, { useState } from 'react';
import { useSocket, playOrderChime } from '../../context/SocketContext';
import AdminLogin from './AdminLogin';
import AdminStats from './AdminStats';
import StockManager from './StockManager';
import OrderCard from './OrderCard';
import { IconChef } from '../Icons';

export default function AdminDashboard({ onNavigate }) {
  const { orders, menu, connected } = useSocket();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_auth_token') === 'true';
  });
  const [filterStatus, setFilterStatus] = useState('all');

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth_token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={() => setIsAuthenticated(true)}
        onReturnHome={() => onNavigate('/')}
      />
    );
  }

  const filteredOrders = orders.filter(o => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return o.status === 'pending' || o.status === 'preparing';
    return o.status === filterStatus;
  });

  return (
    <div className="admin-layout">
      {/* Admin Top Header */}
      <header className="admin-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            color: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <IconChef s={22} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', margin: 0, color: '#fff' }}>
              Kitchen & Order Portal
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
              <span className="live-dot" style={{ backgroundColor: connected ? '#10b981' : '#f87171' }} />
              {connected ? 'Real-Time Server Connected' : 'Connecting to Server...'}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={playOrderChime}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            title="Test notification sound chime"
          >
            🔔 Test Chime
          </button>

          <button
            onClick={() => onNavigate('/')}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
          >
            🌐 Customer Website
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#f87171',
              fontSize: '0.78rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🔒 Lock / Logout
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 24px' }}>
        {/* Metrics Row */}
        <AdminStats orders={orders} menu={menu} />

        {/* Real-Time Out-of-Stock Controller */}
        <StockManager menu={menu} />

        {/* Live Orders Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                Live Dining Orders
              </h2>
              <span style={{
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                color: 'var(--color-accent)',
                fontSize: '0.75rem',
                fontWeight: '800',
                padding: '2px 10px',
                borderRadius: '12px',
                border: '1px solid rgba(212, 175, 55, 0.3)'
              }}>
                {filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}
              </span>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'active', label: '🔥 Active (Kitchen)' },
                { id: 'pending', label: '⏳ Pending' },
                { id: 'preparing', label: '👨‍🍳 Cooking' },
                { id: 'served', label: '🍽️ Served' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterStatus(f.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    border: filterStatus === f.id ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.08)',
                    backgroundColor: filterStatus === f.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.03)',
                    color: filterStatus === f.id ? '#0a0f0d' : 'var(--color-text-muted)',
                    transition: 'all 0.15s'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Grid */}
          {filteredOrders.length === 0 ? (
            <div style={{
              backgroundColor: '#141a18',
              borderRadius: '16px',
              padding: '48px 24px',
              textAlign: 'center',
              border: '1px solid rgba(212, 175, 55, 0.15)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🛎️</div>
              <h3 style={{ color: '#fff', marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
                No {filterStatus !== 'all' ? filterStatus : ''} orders right now
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                When customers place an order from table menus, it will immediately appear here with a real-time chime!
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
