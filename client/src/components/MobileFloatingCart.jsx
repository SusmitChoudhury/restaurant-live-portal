import React from 'react';
import { useCart } from '../context/CartContext';
import { IconCart } from './Icons';

export default function MobileFloatingCart() {
  const { totalItems, grandTotal, setIsCartOpen, isCartOpen, selectedTable, customerOrders } = useCart();

  // Only render on mobile if cart has items and cart drawer is not currently open
  if (totalItems === 0 || isCartOpen) return null;

  // If customer has an active order tracker minimized, adjust bottom so they don't collide
  const hasActiveCustomerOrders = Array.isArray(customerOrders) && customerOrders.length > 0;

  return (
    <div
      className="mobile-floating-cart"
      onClick={() => setIsCartOpen(true)}
      role="button"
      tabIndex={0}
      aria-label="View cart and proceed to order"
      style={{
        position: 'fixed',
        bottom: hasActiveCustomerOrders
          ? 'calc(max(16px, env(safe-area-inset-bottom)) + 58px)'
          : 'max(16px, env(safe-area-inset-bottom))',
        left: '12px',
        right: '12px',
        maxWidth: '520px',
        margin: '0 auto',
        zIndex: 550,
        backgroundColor: '#19382c',
        backgroundImage: 'linear-gradient(135deg, #19382c 0%, #0e241c 100%)',
        border: '1.5px solid var(--color-accent)',
        borderRadius: '50px',
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.75), 0 0 25px rgba(212, 175, 55, 0.35)',
        cursor: 'pointer',
        animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'bottom 0.3s ease, transform 0.2s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          position: 'relative',
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-accent)',
          color: '#0a0f0d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <IconCart s={19} />
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            backgroundColor: '#ef4444',
            color: '#fff',
            fontSize: '0.7rem',
            fontWeight: '800',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #0a0f0d'
          }}>
            {totalItems}
          </span>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#fff', fontWeight: '800', fontSize: '0.95rem' }}>
              ₹{grandTotal.toLocaleString('en-IN')}
            </span>
            {selectedTable && (
              <span style={{
                fontSize: '0.7rem',
                color: 'var(--color-accent)',
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                padding: '1px 6px',
                borderRadius: '10px',
                fontWeight: '600'
              }}>
                Table T{selectedTable}
              </span>
            )}
          </div>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.74rem' }}>
            {totalItems} {totalItems === 1 ? 'dish' : 'dishes'} in cart
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--color-accent)',
        fontWeight: '700',
        fontSize: '0.85rem',
        backgroundColor: 'rgba(212, 175, 55, 0.12)',
        padding: '6px 14px',
        borderRadius: '25px',
        border: '1px solid rgba(212, 175, 55, 0.3)'
      }}>
        <span>View Order</span>
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>➔</span>
      </div>
    </div>
  );
}
