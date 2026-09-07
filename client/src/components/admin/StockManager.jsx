import React, { useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { CATEGORIES } from '../../data/defaultMenu';

export default function StockManager({ menu }) {
  const { toggleStock } = useSocket();
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = menu.filter(item => {
    const matchesCat = selectedCat === 'All' || item.category === selectedCat;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const outOfStockCount = menu.filter(i => i.isAvailable === false).length;

  return (
    <div style={{
      backgroundColor: '#141a18',
      border: '1px solid rgba(212, 175, 55, 0.2)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '32px'
    }}>
      <div style={{
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#fff', marginBottom: '4px' }}>
            Live Inventory & Out-of-Stock Controller
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            Toggle any dish "Out of Stock" when ingredients run out. Changes instantly lock ordering on all customer screens.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {outOfStockCount > 0 && (
            <span style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: '700'
            }}>
              ⚠️ {outOfStockCount} {outOfStockCount === 1 ? 'Item' : 'Items'} Out of Stock
            </span>
          )}

          <div style={{
            padding: '4px 12px',
            borderRadius: '8px',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid var(--border-card-admin)',
            fontSize: '0.75rem',
            color: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            ⚡ Live Sync Active
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              style={{
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                border: selectedCat === cat ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.08)',
                backgroundColor: selectedCat === cat ? 'var(--color-accent)' : 'rgba(255,255,255,0.03)',
                color: selectedCat === cat ? '#0a0f0d' : 'var(--color-text-muted)',
                transition: 'all 0.15s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <input
          type="text"
          placeholder="Filter dish by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            fontSize: '0.8rem',
            outline: 'none',
            minWidth: '200px'
          }}
        />
      </div>

      {/* Menu Item Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '14px',
        maxHeight: '520px',
        overflowY: 'auto',
        paddingRight: '6px'
      }}>
        {filtered.map((item) => {
          const isAvailable = item.isAvailable !== false;

          return (
            <div
              key={item.id}
              style={{
                backgroundColor: '#0a0f0d',
                border: isAvailable ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '10px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease',
                boxShadow: isAvailable ? 'none' : '0 0 10px rgba(239, 68, 68, 0.12)'
              }}
            >
              {/* Thumbnail */}
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '8px',
                overflow: 'hidden',
                flexShrink: 0,
                position: 'relative'
              }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: isAvailable ? 'none' : 'grayscale(100%)'
                  }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&fit=crop&q=80';
                  }}
                />
              </div>

              {/* Info */}
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 style={{
                    fontSize: '0.85rem',
                    color: isAvailable ? '#fff' : '#94a3b8',
                    textDecoration: isAvailable ? 'none' : 'line-through',
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontWeight: '600'
                  }}>
                    {item.name}
                  </h4>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    {item.category}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-accent)', fontWeight: '700' }}>
                    ₹{item.price}
                  </span>
                </div>
              </div>

              {/* Stock Toggle Switch */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                <label className="stock-toggle-switch" title={`Toggle availability for ${item.name}`}>
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={() => toggleStock(item.id)}
                  />
                  <span className="stock-slider"></span>
                </label>
                <span style={{
                  fontSize: '0.62rem',
                  fontWeight: '700',
                  color: isAvailable ? '#10b981' : '#ef4444',
                  textTransform: 'uppercase'
                }}>
                  {isAvailable ? 'In Stock' : 'Out'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
