import React, { useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { CATEGORIES } from '../../data/defaultMenu';

export default function StockManager({ menu }) {
  const { toggleStock } = useSocket();
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyOutOfStock, setShowOnlyOutOfStock] = useState(false);

  const outOfStockCount = menu.filter(i => i.isAvailable === false).length;

  const filtered = menu.filter(item => {
    const isOut = item.isAvailable === false;
    if (showOnlyOutOfStock && !isOut) return false;
    const matchesCat = selectedCat === 'All' || item.category === selectedCat;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{
      backgroundColor: '#141a18',
      border: '1px solid rgba(212, 175, 55, 0.2)',
      borderRadius: '16px',
      padding: 'clamp(14px, 3vw, 24px)',
      marginBottom: '32px'
    }}>
      {/* Top Title & Status Header */}
      <div style={{
        marginBottom: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', color: '#fff', margin: '0 0 4px' }}>
            Live Inventory & Stock Controller
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.4' }}>
            Toggle dishes "Out of Stock" when sold out. Changes are permanently saved and sync to all customer devices instantly.
          </p>
        </div>

        {/* Quick Stock Filters & Live Sync Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowOnlyOutOfStock(!showOnlyOutOfStock)}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.76rem',
              fontWeight: '700',
              cursor: 'pointer',
              border: showOnlyOutOfStock
                ? '1px solid #ef4444'
                : '1px solid rgba(239, 68, 68, 0.35)',
              backgroundColor: showOnlyOutOfStock
                ? 'rgba(239, 68, 68, 0.3)'
                : 'rgba(239, 68, 68, 0.1)',
              color: '#f87171',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              touchAction: 'manipulation'
            }}
          >
            <span>⚠️</span>
            <span>{outOfStockCount} {outOfStockCount === 1 ? 'Dish' : 'Dishes'} Out of Stock</span>
            {showOnlyOutOfStock && <span style={{ fontSize: '0.65rem' }}>✕ (Clear)</span>}
          </button>

          <div style={{
            padding: '5px 10px',
            borderRadius: '8px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            fontSize: '0.72rem',
            color: '#10b981',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontWeight: '600'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            Permanent Sync
          </div>
        </div>
      </div>

      {/* Search Bar: Full width for mobile */}
      <div style={{ marginBottom: '14px' }}>
        <input
          type="text"
          placeholder="🔍 Search dish name (e.g. Biryani, Butter Chicken, Naan)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            color: '#fff',
            fontSize: '16px', // Prevents iOS Safari automatic zoom on focus
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Category Pills: Horizontally swipeable on mobile */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        paddingBottom: '8px',
        marginBottom: '16px'
      }}>
        {CATEGORIES.map(cat => {
          const isSelected = selectedCat === cat;
          const catCount = cat === 'All' ? menu.length : menu.filter(i => i.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.76rem',
                fontWeight: isSelected ? '700' : '500',
                cursor: 'pointer',
                flexShrink: 0,
                border: isSelected ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.08)',
                backgroundColor: isSelected ? 'var(--color-accent)' : 'rgba(255,255,255,0.04)',
                color: isSelected ? '#0a0f0d' : 'var(--color-text-muted)',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                touchAction: 'manipulation'
              }}
            >
              {cat} <span style={{ opacity: 0.7, fontSize: '0.7rem' }}>({catCount})</span>
            </button>
          );
        })}
      </div>

      {/* Menu Item Grid */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '36px 16px',
          color: 'var(--color-text-muted)',
          backgroundColor: '#0a0f0d',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🍽️</div>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>No menu dishes found matching your criteria</p>
          {showOnlyOutOfStock && (
            <button
              onClick={() => setShowOnlyOutOfStock(false)}
              style={{
                marginTop: '10px',
                background: 'none',
                border: 'none',
                color: 'var(--color-accent)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                textDecoration: 'underline'
              }}
            >
              Show all dishes
            </button>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
          gap: '12px',
          maxHeight: '560px',
          overflowY: 'auto',
          paddingRight: '4px'
        }}>
          {filtered.map((item) => {
            const isAvailable = item.isAvailable !== false;

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#0a0f0d',
                  border: isAvailable ? '1px solid rgba(255,255,255,0.07)' : '1.5px solid rgba(239, 68, 68, 0.45)',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s ease',
                  boxShadow: isAvailable ? 'none' : '0 0 12px rgba(239, 68, 68, 0.15)'
                }}
              >
                {/* Thumbnail Image */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  position: 'relative'
                }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: isAvailable ? 'none' : 'grayscale(100%) opacity(0.6)'
                    }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&fit=crop&q=80';
                    }}
                  />
                  {!isAvailable && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ef4444',
                      fontWeight: '900',
                      fontSize: '0.85rem'
                    }}>
                      ✕
                    </div>
                  )}
                </div>

                {/* Dish Info */}
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <h4 style={{
                    fontSize: '0.88rem',
                    color: isAvailable ? '#fff' : '#94a3b8',
                    textDecoration: isAvailable ? 'none' : 'line-through',
                    margin: '0 0 4px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontWeight: '700'
                  }}>
                    {item.name}
                  </h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: '0.84rem', color: 'var(--color-accent)', fontWeight: '800' }}>
                      ₹{item.price}
                    </span>
                  </div>
                </div>

                {/* Stock Toggle Switch & Status Pill */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  flexShrink: 0
                }}>
                  <label
                    className="stock-toggle-switch"
                    title={`Toggle ${item.name} in/out of stock`}
                    style={{ cursor: 'pointer', touchAction: 'manipulation' }}
                  >
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={() => toggleStock(item.id)}
                    />
                    <span className="stock-slider" />
                  </label>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: '800',
                    color: isAvailable ? '#10b981' : '#ef4444',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}>
                    {isAvailable ? 'In Stock' : 'Out'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
