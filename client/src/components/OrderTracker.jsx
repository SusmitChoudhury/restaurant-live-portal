import React from 'react';

export default function OrderTracker({ order, onClose }) {
  if (!order) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return { text: '⏳ Order Received — In Queue', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
      case 'preparing':
        return { text: '👨‍🍳 Cooking in Kitchen', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' };
      case 'served':
        return { text: '🍽️ Served at Table — Enjoy!', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' };
      case 'completed':
        return { text: '✅ Meal Completed', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' };
      case 'cancelled':
        return { text: '❌ Order Cancelled', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' };
      default:
        return { text: status, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' };
    }
  };

  const badge = getStatusBadge(order.status);

  // Status progress steps
  const steps = [
    { key: 'pending', label: 'Received', icon: '📝' },
    { key: 'preparing', label: 'Kitchen Preparing', icon: '🍳' },
    { key: 'served', label: 'Served', icon: '🍽️' }
  ];

  const currentStepIndex = order.status === 'served' || order.status === 'completed'
    ? 2
    : order.status === 'preparing'
    ? 1
    : 0;

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-gold)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '28px',
      boxShadow: 'var(--shadow-gold)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Live Order #{order.id}
            </span>
            <span style={{
              backgroundColor: 'var(--accent-gold)',
              color: '#0a0d14',
              fontSize: '0.75rem',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              Table #{order.tableNumber}
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            padding: '6px 14px',
            borderRadius: '20px',
            backgroundColor: badge.bg,
            color: badge.color,
            border: `1px solid ${badge.color}`,
            fontSize: '0.85rem',
            fontWeight: '700'
          }}>
            {badge.text}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
              title="Dismiss tracking card"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        margin: '24px 0 16px',
        padding: '0 12px'
      }}>
        {steps.map((step, idx) => {
          const isDone = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          return (
            <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: isCurrent ? 'var(--accent-gold)' : isDone ? '#10b981' : 'var(--bg-secondary)',
                border: `2px solid ${isDone ? '#10b981' : 'var(--border-color)'}`,
                color: isCurrent ? '#0a0d14' : isDone ? '#fff' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '700',
                transition: 'all 0.3s ease'
              }}>
                {step.icon}
              </div>
              <span style={{
                fontSize: '0.75rem',
                marginTop: '6px',
                color: isDone ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: isCurrent ? '700' : '500'
              }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Items Summary */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontWeight: '600', color: 'var(--text-primary)' }}>
          <span>Items Ordered ({order.items.length}):</span>
          <span className="gold-gradient-text">${order.total}</span>
        </div>
        <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {order.items.map((it, i) => (
            <li key={i} style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.78rem'
            }}>
              {it.quantity}x {it.name}
            </li>
          ))}
        </ul>
        {order.customerNotes && (
          <p style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--accent-gold)' }}>
            Note: "{order.customerNotes}"
          </p>
        )}
      </div>
    </div>
  );
}
