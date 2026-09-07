import React from 'react';

export default function OrderCard({ order, onUpdateStatus }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return { label: 'PENDING', bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '#f59e0b' };
      case 'preparing':
        return { label: 'COOKING', bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '#3b82f6' };
      case 'served':
        return { label: 'SERVED', bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '#10b981' };
      case 'completed':
        return { label: 'COMPLETED', bg: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', border: '#94a3b8' };
      case 'cancelled':
        return { label: 'CANCELLED', bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '#ef4444' };
      default:
        return { label: status, bg: 'rgba(255,255,255,0.05)', color: '#fff', border: 'transparent' };
    }
  };

  const statusStyle = getStatusStyle(order.status);
  const timeFormatted = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: order.status === 'pending' ? '1px solid #f59e0b' : '1px solid var(--border-color)',
      borderRadius: '14px',
      padding: '18px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: order.status === 'pending' ? '0 0 15px rgba(245, 158, 11, 0.15)' : 'none',
      transition: 'all 0.25s ease'
    }}>
      <div>
        {/* Header: Table # & Status Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              backgroundColor: 'var(--accent-gold)',
              color: '#0a0d14',
              padding: '4px 10px',
              borderRadius: '6px',
              fontWeight: '800',
              fontSize: '0.9rem'
            }}>
              TABLE #{order.tableNumber}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {order.id}
            </span>
          </div>

          <span style={{
            backgroundColor: statusStyle.bg,
            color: statusStyle.color,
            border: `1px solid ${statusStyle.border}`,
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.72rem',
            fontWeight: '700'
          }}>
            {statusStyle.label}
          </span>
        </div>

        {/* Time Stamp */}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
          Ordered at: {timeFormatted}
        </div>

        {/* Items List */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '14px'
        }}>
          <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {order.items.map((item, idx) => (
              <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                  <span style={{ color: 'var(--accent-gold)', marginRight: '6px' }}>{item.quantity}x</span>
                  {item.name}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          {order.customerNotes && (
            <div style={{
              marginTop: '10px',
              padding: '6px 8px',
              borderRadius: '4px',
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              borderLeft: '3px solid var(--accent-gold)',
              fontSize: '0.75rem',
              color: 'var(--text-primary)'
            }}>
              <strong>Note:</strong> {order.customerNotes}
            </div>
          )}
        </div>

        {/* Total Price */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Order Total:</span>
          <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent-gold)' }}>
            ${order.total}
          </span>
        </div>
      </div>

      {/* Action Buttons depending on status */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {order.status === 'pending' && (
          <>
            <button
              onClick={() => onUpdateStatus(order.id, 'preparing')}
              className="btn-primary"
              style={{ flexGrow: 1, justifyContent: 'center', padding: '8px', fontSize: '0.82rem' }}
            >
              👨‍🍳 Start Preparing
            </button>
            <button
              onClick={() => onUpdateStatus(order.id, 'cancelled')}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: '600'
              }}
            >
              Cancel
            </button>
          </>
        )}

        {order.status === 'preparing' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'served')}
            style={{
              flexGrow: 1,
              padding: '9px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#10b981',
              color: '#0a0d14',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            🍽️ Mark as Served at Table
          </button>
        )}

        {order.status === 'served' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'completed')}
            className="btn-secondary"
            style={{ flexGrow: 1, justifyContent: 'center', padding: '8px', fontSize: '0.82rem' }}
          >
            ✅ Complete & Archive
          </button>
        )}
      </div>
    </div>
  );
}
