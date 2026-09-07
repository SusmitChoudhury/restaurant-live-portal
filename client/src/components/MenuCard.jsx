import React from 'react';
import burgerImg from '../assets/images/burger.png';
import pizzaImg from '../assets/images/pizza.png';
import kashmiriImg from '../assets/images/kashmiri_pulao.jpg';
import pastaImg from '../assets/images/pasta.png';
import dessertImg from '../assets/images/dessert.png';

const imageMap = {
  'burger.png': burgerImg,
  'pizza.png': pizzaImg,
  'kashmiri_pulao.jpg': kashmiriImg,
  'pasta.png': pastaImg,
  'dessert.png': dessertImg
};

export default function MenuCard({ item, onAddToCart }) {
  const isAvailable = item.isAvailable !== false;
  const imgSrc = imageMap[item.image] || burgerImg;

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      border: isAvailable ? '1px solid var(--border-color)' : '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '16px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      position: 'relative',
      opacity: isAvailable ? 1 : 0.65,
      boxShadow: isAvailable ? '0 10px 25px -5px rgba(0,0,0,0.3)' : 'none'
    }}>
      {/* Image Container with Out of Stock Badge */}
      <div style={{ position: 'relative', height: '210px', overflow: 'hidden', backgroundColor: '#0e1422' }}>
        <img
          src={imgSrc}
          alt={item.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: isAvailable ? 'none' : 'grayscale(80%) brightness(0.6)',
            transition: 'transform 0.4s ease'
          }}
        />

        {/* Category Pill */}
        <span style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: 'rgba(10, 13, 20, 0.75)',
          backdropFilter: 'blur(8px)',
          color: 'var(--accent-gold)',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.72rem',
          fontWeight: '600',
          border: '1px solid var(--border-gold)'
        }}>
          {item.category}
        </span>

        {/* Live Out of Stock Ribbon / Overlay */}
        {!isAvailable && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(2px)'
          }}>
            <span style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              padding: '6px 16px',
              borderRadius: '6px',
              fontWeight: '800',
              fontSize: '0.85rem',
              letterSpacing: '1px',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.5)',
              textTransform: 'uppercase'
            }}>
              🚫 Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.15rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            lineHeight: 1.3
          }}>
            {item.name}
          </h3>
          <span style={{
            fontSize: '1.2rem',
            fontWeight: '800',
            color: 'var(--accent-gold)',
            whiteSpace: 'nowrap',
            marginLeft: '8px'
          }}>
            ${item.price.toFixed(2)}
          </span>
        </div>

        <p style={{
          fontSize: '0.83rem',
          color: 'var(--text-secondary)',
          marginBottom: '20px',
          flexGrow: 1,
          lineHeight: 1.5
        }}>
          {item.description}
        </p>

        {/* Action Button */}
        <div>
          {isAvailable ? (
            <button
              className="btn-primary"
              onClick={() => onAddToCart(item)}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>+</span> Add to Table Order
            </button>
          ) : (
            <button
              disabled
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              Temporarily Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
