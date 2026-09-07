import React from 'react';

export default function AdminStats({ orders, menu }) {
  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing');
  const servedOrders = orders.filter(o => o.status === 'served' || o.status === 'completed');
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
  const outOfStockCount = menu.filter(m => m.isAvailable === false).length;

  const statCards = [
    { label: 'Active Kitchen', value: activeOrders.length, icon: '🔥', color: '#f59e0b', subtext: 'In queue & cooking' },
    { label: 'Served / Done', value: servedOrders.length, icon: '✅', color: '#10b981', subtext: 'Successfully delivered' },
    { label: "Today's Sales", value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: '💰', color: 'var(--color-accent)', subtext: 'Across all tables' },
    { label: 'Out of Stock', value: outOfStockCount, icon: '🚫', color: outOfStockCount > 0 ? '#ef4444' : '#10b981', subtext: outOfStockCount > 0 ? 'Unavailable items' : 'All items in stock' }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
      gap: '12px',
      marginBottom: '24px'
    }}>
      {statCards.map((st, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: '#141a18',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '14px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}
        >
          <div style={{ minWidth: 0, flexGrow: 1 }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
              {st.label}
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: st.color, margin: '2px 0', fontFamily: 'var(--font-heading)' }}>
              {st.value}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
              {st.subtext}
            </span>
          </div>
          <div style={{
            fontSize: '1.6rem',
            backgroundColor: 'rgba(255,255,255,0.04)',
            padding: '8px',
            borderRadius: '10px',
            flexShrink: 0
          }}>
            {st.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
