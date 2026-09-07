import React from 'react';

export default function TableSelector({ selectedTable, onSelectTable }) {
  const tables = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '16px 20px',
      marginBottom: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: 'var(--accent-gold-light)',
          border: '1px solid var(--border-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px'
        }}>
          🪑
        </div>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Dining At Table #{selectedTable}
          </h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Orders placed will be sent directly to the kitchen and delivered to this table.
          </p>
        </div>
      </div>

      {/* Table Selection Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginRight: '4px' }}>
          Change Table:
        </span>
        {tables.map(num => (
          <button
            key={num}
            onClick={() => onSelectTable(num)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: selectedTable === num ? '1px solid var(--accent-gold)' : '1px solid var(--border-color)',
              backgroundColor: selectedTable === num ? 'var(--accent-gold)' : 'rgba(255,255,255,0.03)',
              color: selectedTable === num ? '#0a0d14' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}
