import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  selectedTable,
  onOrderPlaced
}) {
  const { placeOrder } = useSocket();
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);

    const orderPayload = {
      tableNumber: selectedTable,
      items: cartItems.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity
      })),
      total: total.toFixed(2),
      customerNotes: customerNotes.trim()
    };

    const newOrder = await placeOrder(orderPayload);
    setIsSubmitting(false);

    if (newOrder) {
      onClearCart();
      setCustomerNotes('');
      onClose();
      if (onOrderPlaced) onOrderPlaced(newOrder);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      display: 'flex',
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(6px)'
    }}>
      {/* Backdrop click to close */}
      <div style={{ flexGrow: 1 }} onClick={onClose} />

      {/* Drawer Panel */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
        animation: 'slideLeft 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--text-primary)' }}>
              Table #{selectedTable} Order
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Items will be sent directly to the kitchen queue
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Cart Items List */}
        <div style={{
          padding: '20px',
          flexGrow: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🍽️</div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>Your table cart is empty</h4>
              <p style={{ fontSize: '0.82rem' }}>Select dishes from the menu to start your order.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '10px',
                  padding: '14px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {item.name}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: '700' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                {/* Inline Quantity Controls (+ and -) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    style={{
                      padding: '4px 10px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '1rem'
                    }}
                  >
                    −
                  </button>
                  <span style={{
                    padding: '0 8px',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)'
                  }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    style={{
                      padding: '4px 10px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '1rem'
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => onRemoveItem(item.id)}
                  title="Remove item"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    padding: '4px'
                  }}
                >
                  🗑️
                </button>
              </div>
            ))
          )}

          {cartItems.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                marginBottom: '6px',
                fontWeight: '600'
              }}>
                Special Kitchen Instructions (Optional):
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Less spicy, dressing on the side, extra napkins..."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  resize: 'none',
                  outline: 'none'
                }}
              />
            </div>
          )}
        </div>

        {/* Footer with Calculations & Submit */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '20px',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              <span>Taxes (8%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.15rem',
              fontWeight: '800',
              color: 'var(--text-primary)',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '10px',
              marginBottom: '16px'
            }}>
              <span>Total:</span>
              <span className="gold-gradient-text">${total.toFixed(2)}</span>
            </div>

            <button
              className="btn-primary"
              onClick={handleCheckout}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '12px',
                justifyContent: 'center',
                fontSize: '0.95rem'
              }}
            >
              {isSubmitting ? 'Sending to Kitchen...' : '🚀 Place Order for Table #' + selectedTable}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
