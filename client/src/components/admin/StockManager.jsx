import React from 'react';
import { useSocket } from '../../context/SocketContext';
import burgerImg from '../../assets/images/burger.png';
import pizzaImg from '../../assets/images/pizza.png';
import kashmiriImg from '../../assets/images/kashmiri_pulao.jpg';
import pastaImg from '../../assets/images/pasta.png';
import dessertImg from '../../assets/images/dessert.png';

const imageMap = {
  'burger.png': burgerImg,
  'pizza.png': pizzaImg,
  'kashmiri_pulao.jpg': kashmiriImg,
  'pasta.png': pastaImg,
  'dessert.png': dessertImg
};

export default function StockManager({ menu }) {
  const { toggleStock } = useSocket();

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '32px'
    }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Live Inventory & Out-of-Stock Controller
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Switch any dish to "Out of Stock" whenever ingredients run out. It will instantly lock and disable ordering on all customer screens.
          </p>
        </div>

        <div style={{
          padding: '6px 14px',
          borderRadius: '8px',
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          border: '1px solid var(--border-gold)',
          fontSize: '0.78rem',
          color: 'var(--accent-gold)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          ⚡ Real-Time Instant Broadcast Active
        </div>
      </div>

      {/* Menu Item Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {menu.map((item) => {
          const isAvailable = item.isAvailable !== false;
          const imgSrc = imageMap[item.image] || burgerImg;

          return (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: isAvailable ? '1px solid var(--border-color)' : '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                transition: 'all 0.2s ease',
                boxShadow: isAvailable ? 'none' : '0 0 12px rgba(239, 68, 68, 0.15)'
              }}
            >
              {/* Thumbnail */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '8px',
                overflow: 'hidden',
                flexShrink: 0,
                position: 'relative'
              }}>
                <img
                  src={imgSrc}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: isAvailable ? 'none' : 'grayscale(100%)'
                  }}
                />
              </div>

              {/* Info */}
              <div style={{ flexGrow: 1 }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>
                  {item.name}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: '700' }}>
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                {/* Stock Toggle Button */}
                <button
                  onClick={() => toggleStock(item.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: isAvailable ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.25)',
                    color: isAvailable ? '#10b981' : '#f87171',
                    border: `1px solid ${isAvailable ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.5)'}`,
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                  title={isAvailable ? 'Click to mark Out of Stock' : 'Click to restore Availability'}
                >
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: isAvailable ? '#10b981' : '#ef4444'
                  }} />
                  {isAvailable ? 'In Stock (Active)' : 'Out of Stock (Locked)'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
