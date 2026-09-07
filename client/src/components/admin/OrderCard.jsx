import React from 'react';

export default function OrderCard({ order, onUpdateStatus }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return { label: 'PENDING', bg: 'rgba(245, 158, 11, 0.18)', color: '#f59e0b', border: '#f59e0b' };
      case 'preparing':
        return { label: 'COOKING', bg: 'rgba(59, 130, 246, 0.18)', color: '#3b82f6', border: '#3b82f6' };
      case 'served':
        return { label: 'SERVED', bg: 'rgba(16, 185, 129, 0.18)', color: '#10b981', border: '#10b981' };
      case 'completed':
        return { label: 'COMPLETED', bg: 'rgba(148, 163, 184, 0.18)', color: '#94a3b8', border: '#94a3b8' };
      case 'cancelled':
        return { label: 'CANCELLED', bg: 'rgba(239, 68, 68, 0.18)', color: '#ef4444', border: '#ef4444' };
      default:
        return { label: status, bg: 'rgba(255,255,255,0.05)', color: '#fff', border: 'transparent' };
    }
  };

  const statusStyle = getStatusStyle(order.status);
  const timeFormatted = order.createdAt
    ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Just now';

  return (
    <div style={{
      backgroundColor: '#141a18',
      border: order.status === 'pending'
        ? '1.5px solid #f59e0b'
        : order.status === 'preparing'
          ? '1.5px solid #3b82f6'
          : '1px solid rgba(212, 175, 55, 0.2)',
      borderRadius: '16px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: order.status === 'pending'
        ? '0 6px 25px rgba(245, 158, 11, 0.2)'
        : '0 4px 15px rgba(0,0,0,0.4)',
      transition: 'all 0.25s ease'
    }}>
      <div>
        {/* Header: Table # & Status Badge */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              backgroundColor: 'var(--color-accent)',
              color: '#0a0f0d',
              padding: '6px 12px',
              borderRadius: '8px',
              fontWeight: '900',
              fontSize: '0.95rem',
              letterSpacing: '0.5px'
            }}>
              TABLE #{order.tableNumber}
            </span>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              fontFamily: 'monospace',
              fontWeight: '600'
            }}>
              {order.id}
            </span>
          </div>

          <span style={{
            backgroundColor: statusStyle.bg,
            color: statusStyle.color,
            border: `1px solid ${statusStyle.border}`,
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.72rem',
            fontWeight: '800',
            letterSpacing: '0.5px'
          }}>
            {statusStyle.label}
          </span>
        </div>

        {/* Timestamp */}
        <div style={{
          fontSize: '0.74rem',
          color: 'var(--color-text-muted)',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <span>🕒 Ordered:</span>
          <strong style={{ color: '#fff' }}>{timeFormatted}</strong>
        </div>

        {/* Ordered Items List */}
        <div style={{
          backgroundColor: '#0a0f0d',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '10px',
          padding: '12px',
          marginBottom: '14px'
        }}>
          <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(order.items || []).map((item, idx) => (
              <li key={idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                fontSize: '0.86rem',
                borderBottom: idx < order.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                paddingBottom: idx < order.items.length - 1 ? '6px' : '0'
              }}>
                <span style={{ color: '#fff', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    color: '#0a0f0d',
                    backgroundColor: 'var(--color-accent)',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '800'
                  }}>
                    {item.quantity || item.qty}×
                  </span>
                  {item.name}
                </span>
                <span style={{ color: 'var(--color-accent)', fontSize: '0.82rem', fontWeight: '700' }}>
                  ₹{Number((item.price * (item.quantity || item.qty || 1))).toLocaleString('en-IN')}
                </span>
              </li>
            ))}
          </ul>

          {/* Customer Allergy / Special Notes */}
          {order.customerNotes && (
            <div style={{
              marginTop: '10px',
              padding: '8px 10px',
              borderRadius: '6px',
              backgroundColor: 'rgba(212, 175, 55, 0.12)',
              borderLeft: '3px solid var(--color-accent)',
              fontSize: '0.78rem',
              color: '#f0f5f2',
              lineHeight: '1.4'
            }}>
              <strong style={{ color: 'var(--color-accent)' }}>Chef Note:</strong> {order.customerNotes}
            </div>
          )}
        </div>

        {/* Order Total Price */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
          padding: '0 4px'
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Order Total:</span>
          <span style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--color-accent)', fontFamily: 'var(--font-heading)' }}>
            ₹{Number(order.total).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Action Buttons: Super Touch Ergonomic (Min 48px height) */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {order.status === 'pending' && (
          <>
            <button
              onClick={() => onUpdateStatus(order.id, 'preparing')}
              style={{
                flex: '2 1 140px',
                minHeight: '48px',
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'var(--color-accent)',
                color: '#0a0f0d',
                fontWeight: '800',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                touchAction: 'manipulation'
              }}
            >
              👨‍🍳 Start Cooking
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Cancel order ${order.id} for Table ${order.tableNumber}?`)) {
                  onUpdateStatus(order.id, 'cancelled');
                }
              }}
              style={{
                flex: '1 1 80px',
                minHeight: '48px',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                color: '#f87171',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                touchAction: 'manipulation'
              }}
            >
              ✕ Cancel
            </button>
          </>
        )}

        {order.status === 'preparing' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'served')}
            style={{
              width: '100%',
              minHeight: '48px',
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#10b981',
              color: '#0a0f0d',
              fontWeight: '900',
              cursor: 'pointer',
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)',
              touchAction: 'manipulation'
            }}
          >
            🍽️ Mark as Served at Table
          </button>
        )}

        {order.status === 'served' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'completed')}
            style={{
              width: '100%',
              minHeight: '44px',
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.15)',
              backgroundColor: 'rgba(255,255,255,0.05)',
              color: '#e2e8f0',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              touchAction: 'manipulation'
            }}
          >
            ✅ Complete & Archive Order
          </button>
        )}
      </div>
    </div>
  );
}
