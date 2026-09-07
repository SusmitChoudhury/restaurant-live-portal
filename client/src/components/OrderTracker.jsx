import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { IconChef, IconCheck, IconUtensils, IconParty, IconClose } from './Icons';

const steps = [
  { key: 'pending', label: 'Order Received', icon: <IconUtensils s={22} />, description: 'Your order has been transmitted to the kitchen. Waiting for chef to accept...' },
  { key: 'preparing', label: 'Cooking', icon: <IconChef s={22} />, description: 'Chef accepted your order! Your delicious dishes are being prepared.' },
  { key: 'served', label: 'Served', icon: <IconCheck s={22} />, description: 'Dishes are plated and served hot at your table. Enjoy your meal!' },
];

export default function OrderTracker() {
  const { orderStatus, placedOrder, resetOrder } = useCart();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  // Timer solely counting how long ago the order was placed (NO auto-advance)
  useEffect(() => {
    if (!orderStatus || orderStatus === 'served' || orderStatus === 'completed') return;
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [orderStatus]);

  // Lock body scroll ONLY when modal is full screen (not minimized)
  useEffect(() => {
    if (orderStatus && placedOrder && !isMinimized) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [orderStatus, placedOrder, isMinimized]);

  if (!orderStatus || !placedOrder) return null;

  // Determine current step index safely
  let currentIdx = 0;
  if (orderStatus === 'preparing') currentIdx = 1;
  if (orderStatus === 'served' || orderStatus === 'completed') currentIdx = 2;

  const activeStep = steps[currentIdx] || steps[0];

  const formatElapsed = () => {
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s ago`;
  };

  const handleDone = () => {
    document.body.style.overflow = '';
    resetOrder();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Safe property extraction
  const tableNum = placedOrder.table || placedOrder.tableNumber || '1';
  const orderTime = placedOrder.time || (placedOrder.createdAt ? new Date(placedOrder.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Just now');
  const items = Array.isArray(placedOrder.items) ? placedOrder.items : [];
  const extras = Array.isArray(placedOrder.extras) ? placedOrder.extras : [];
  const totalAmount = Number(placedOrder.grandTotal || placedOrder.total || 0);
  const note = placedOrder.chefNote || placedOrder.customerNotes || '';

  // 1. Minimized Floating Status Bar (allows customer to continue browsing)
  if (isMinimized) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 600,
          backgroundColor: '#141a18',
          border: '1px solid var(--color-accent)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(212, 175, 55, 0.25)',
          borderRadius: '50px',
          padding: '8px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'fadeIn 0.3s ease',
          transition: 'transform 0.2s ease',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          onClick={() => setIsMinimized(false)}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          title="Click to expand live order tracker"
        >
          <span className="live-dot" style={{ backgroundColor: activeStep.key === 'served' ? '#10b981' : '#f59e0b' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>
            Table T{tableNum}: <span style={{ color: 'var(--color-accent)' }}>{activeStep.label}</span>
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-accent)', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '10px' }}>
            View Order ↗
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Do you want to close this order tracker and return to normal menu view?')) {
              handleDone();
            }
          }}
          title="Dismiss Tracker"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            marginLeft: '4px'
          }}
        >
          <IconClose s={14} />
        </button>
      </div>
    );
  }

  // 2. Full Modal View
  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsMinimized(true);
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.3s ease',
        overflowY: 'auto',
        padding: '20px',
      }}
    >
      <div style={{
        background: '#141a18',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '16px',
        padding: 'clamp(1.5rem, 3vw, 2.5rem)',
        maxWidth: '560px',
        width: '100%',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(212, 175, 55, 0.15)',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {/* Close / Exit Button in Top-Right Corner */}
        <button
          onClick={() => setIsMinimized(true)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.3)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
          }}
          title="Exit to menu (keeps tracking in background)"
          aria-label="Close modal and return to menu"
        >
          <IconClose s={20} />
        </button>

        {/* Header */}
        <div className="text-center" style={{ marginBottom: '1.5rem' }}>
          <span style={{
            color: 'var(--color-accent)',
            fontSize: '0.75rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontWeight: '700'
          }}>
            Live Dining Order
          </span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', margin: '4px 0 6px', color: '#fff' }}>
            Tracking Your Order
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
            Table <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>T{tableNum}</span> &bull;
            Placed at <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>{orderTime}</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          margin: '2rem 1rem'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '15%',
            right: '15%',
            height: '2px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            zIndex: 1,
            transform: 'translateY(-50%)'
          }} />

          <div style={{
            position: 'absolute',
            top: '50%',
            left: '15%',
            width: currentIdx === 0 ? '0%' : currentIdx === 1 ? '50%' : '70%',
            height: '2px',
            backgroundColor: 'var(--color-accent)',
            zIndex: 2,
            transition: 'width 0.4s ease',
            transform: 'translateY(-50%)'
          }} />

          {steps.map((step, i) => {
            const isDone = i < currentIdx;
            const isActive = i === currentIdx;

            return (
              <div key={step.key} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: 3,
                gap: '8px'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isActive ? 'var(--color-accent)' : isDone ? '#10b981' : 'rgba(255,255,255,0.06)',
                  color: isActive ? '#0a0f0d' : isDone ? '#fff' : 'var(--color-text-muted)',
                  border: isActive ? '2px solid #fff' : isDone ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.15)',
                  boxShadow: isActive ? '0 0 15px rgba(212, 175, 55, 0.5)' : 'none',
                  transition: 'all 0.3s'
                }}>
                  {step.icon}
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: isActive || isDone ? '700' : '500',
                  color: isActive ? 'var(--color-accent)' : isDone ? '#10b981' : 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Current Live Status Box */}
        <div style={{
          textAlign: 'center',
          padding: '1.25rem',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '10px',
          border: '1px solid rgba(212, 175, 55, 0.15)',
          marginBottom: '1.25rem',
        }}>
          <div style={{
            fontSize: '1.8rem',
            marginBottom: '0.4rem',
            color: 'var(--color-accent)',
            display: 'inline-block'
          }}>
            {activeStep.icon}
          </div>
          <h3 style={{ margin: '0 0 0.3rem', fontFamily: 'var(--font-heading)', color: 'var(--color-accent)', fontSize: '1.15rem' }}>
            {activeStep.label}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.85rem' }}>
            {activeStep.description}
          </p>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Placed: {formatElapsed()}
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-accent)', marginBottom: '0.5rem', fontFamily: 'var(--font-body)', fontWeight: '600' }}>
            Ordered Items
          </h4>
          {items.map((item, idx) => {
            const qty = item.qty || item.quantity || 1;
            const price = Number(item.price) || 0;
            return (
              <div key={item.id || idx} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.35rem 0',
                fontSize: '0.85rem',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
              }}>
                <span>{item.name} × {qty}</span>
                <span style={{ color: 'var(--color-accent)', fontWeight: '600' }}>
                  ₹{(price * qty).toLocaleString('en-IN')}
                </span>
              </div>
            );
          })}

          {extras.length > 0 && (
            <>
              <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-text-muted)', marginTop: '0.75rem', marginBottom: '0.4rem', fontFamily: 'var(--font-body)', fontWeight: '500' }}>
                Extras
              </h4>
              {extras.map((e, idx) => {
                const qty = e.qty || e.quantity || 1;
                const price = Number(e.price) || 0;
                return (
                  <div key={e.id || idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.25rem 0',
                    fontSize: '0.82rem',
                    color: 'var(--color-text-muted)',
                  }}>
                    <span>{e.name} × {qty}</span>
                    <span>₹{(price * qty).toLocaleString('en-IN')}</span>
                  </div>
                );
              })}
            </>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontWeight: '700',
            fontSize: '1rem',
          }}>
            <span>Total Amount</span>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-heading)', fontSize: '1.15rem' }}>
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Note for Chef display */}
        {note && (
          <div style={{
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.15)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
          }}>
            <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-accent)', marginBottom: '0.25rem', fontFamily: 'var(--font-body)', fontWeight: '600' }}>
              Special Request for Chef:
            </h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', margin: 0, fontStyle: 'italic' }}>
              "{note}"
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '1.25rem' }}>
          {(orderStatus === 'served' || orderStatus === 'completed') ? (
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem', justifyContent: 'center' }}
              onClick={handleDone}
            >
              <IconParty s={18} /> Order Served — Finish & Back to Menu
            </button>
          ) : (
            <>
              <button
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.88rem',
                  justifyContent: 'center',
                  fontWeight: '600',
                  border: '1px solid var(--color-accent)',
                  color: 'var(--color-accent)',
                  background: 'rgba(212, 175, 55, 0.08)'
                }}
                onClick={() => setIsMinimized(true)}
              >
                ← Back to Menu (Minimize Tracker)
              </button>
              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Click anywhere outside or the top-right ✕ to return to menu. Live status stays visible in the bottom corner.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
