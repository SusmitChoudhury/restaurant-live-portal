import React from 'react';

export default function AdminStats({ orders, menu }) {
  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing');
  const servedOrders = orders.filter(o => o.status === 'served' || o.status === 'completed');
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
  const outOfStockCount = menu.filter(m => m.isAvailable === false).length;

  const statCards = [
    { label: 'Active Kitchen Orders', value: activeOrders.length, icon: '🔥', color: '#f59e0b', subtext: 'In queue & cooking' },
    { label: 'Served & Completed', value: servedOrders.length, icon: '✅', color: '#10b981', subtext: 'Successfully delivered' },
    { label: "Today's Gross Sales", value: `$${totalRevenue.toFixed(2)}`, icon: '💰', color: 'var(--accent-gold)', subtext: 'Across all tables' },
    { label: 'Out of Stock Items', value: outOfStockCount, icon: '🚫', color: outOfStockCount > 0 ? '#ef4444' : '#10b981', subtext: outOfStockCount > 0 ? 'Unavailable on menu' : 'All items in stock' }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      marginBottom: '28px'
    }}>
      {statCards.map((st, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {st.label}
            </span>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: st.color, margin: '4px 0' }}>
              {st.value}
            </div>
            <span style={{ fontSize: '0.73rem', color: 'var(--text-secondary)' }}>
              {st.subtext}
            </span>
          </div>
          <div style={{
            fontSize: '2rem',
            backgroundColor: 'rgba(255,255,255,0.03)',
            padding: '10px',
            borderRadius: '12px'
          }}>
            {st.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
