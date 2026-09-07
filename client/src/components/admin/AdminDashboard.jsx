import React, { useState } from 'react';
import { useSocket, playOrderChime } from '../../context/SocketContext';
import AdminStats from './AdminStats';
import StockManager from './StockManager';
import OrderCard from './OrderCard';

export default function AdminDashboard() {
  const { orders, menu, updateOrderStatus, connected } = useSocket();
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredOrders = orders.filter(o => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return o.status === 'pending' || o.status === 'preparing';
    return o.status === filterStatus;
  });

  return (
    <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Admin Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.85rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '4px'
          }}>
            Kitchen & Order Management Portal
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Real-time incoming orders from dining tables with instant kitchen dispatch.
          </p>
        </div>

        {/* Action / Test Chime */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={playOrderChime}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
            title="Test notification sound chime"
          >
            🔔 Test Sound Chime
          </button>
        </div>
      </div>

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
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-primary)' }}>
              Live Dining Orders
            </h2>
            <span style={{
              backgroundColor: 'var(--accent-gold-light)',
              color: 'var(--accent-gold)',
              fontSize: '0.75rem',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '10px',
              border: '1px solid var(--border-gold)'
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
                  border: filterStatus === f.id ? '1px solid var(--accent-gold)' : '1px solid var(--border-color)',
                  backgroundColor: filterStatus === f.id ? 'var(--accent-gold)' : 'rgba(255,255,255,0.03)',
                  color: filterStatus === f.id ? '#0a0d14' : 'var(--text-secondary)',
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
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛎️</div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '6px' }}>
              No {filterStatus !== 'all' ? filterStatus : ''} orders at this moment
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              When a guest places an order from the customer menu, it will appear here automatically with a sound chime!
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {filteredOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={updateOrderStatus}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
