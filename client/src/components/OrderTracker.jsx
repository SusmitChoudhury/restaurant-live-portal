import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { IconChef, IconCheck, IconUtensils, IconParty } from './Icons';

const steps = [
  { key: 'pending', label: 'Order Received', icon: <IconUtensils s={22} />, description: 'Your order has been transmitted to the kitchen. Waiting for head chef...' },
  { key: 'preparing', label: 'Cooking', icon: <IconChef s={22} />, description: 'Chef accepted your order! Your delicious dishes are being cooked.' },
  { key: 'served', label: 'Served', icon: <IconCheck s={22} />, description: 'Dishes are plated and served hot at your table. Enjoy your meal!' },
];

export default function OrderTracker() {
  const { orderStatus, placedOrder, resetOrder } = useCart();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer solely counting how long ago the order was placed (NO auto-advance)
  useEffect(() => {
    if (!orderStatus || orderStatus === 'served' || orderStatus === 'completed') return;
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [orderStatus]);

  // Lock body scroll when tracker is open
  useEffect(() => {
    if (orderStatus && placedOrder) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [orderStatus, placedOrder]);

  if (!orderStatus || !placedOrder) return null;

  // Determine current step index
  let currentIdx = 0;
  if (orderStatus === 'preparing') currentIdx = 1;
  if (orderStatus === 'served' || orderStatus === 'completed') currentIdx = 2;

  const activeStep = steps[currentIdx];

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

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.3s ease',
      overflowY: 'auto',
      padding: '20px',
    }}>
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
      }}>
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
            Table <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>T{placedOrder.table}</span> &bull;
            Placed at <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>{placedOrder.time}</span>
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
          {/* Track line behind dots */}
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

          {/* Active progress line */}
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
          {placedOrder.items.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.35rem 0',
              fontSize: '0.85rem',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
            }}>
              <span>{item.name} × {item.qty}</span>
              <span style={{ color: 'var(--color-accent)', fontWeight: '600' }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
            </div>
          ))}

          {placedOrder.extras && placedOrder.extras.length > 0 && (
            <>
              <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-text-muted)', marginTop: '0.75rem', marginBottom: '0.4rem', fontFamily: 'var(--font-body)', fontWeight: '500' }}>
                Extras
              </h4>
              {placedOrder.extras.map(e => (
                <div key={e.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.25rem 0',
                  fontSize: '0.82rem',
                  color: 'var(--color-text-muted)',
                }}>
                  <span>{e.name} × {e.qty}</span>
                  <span>₹{(e.price * e.qty).toLocaleString('en-IN')}</span>
                </div>
              ))}
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
            <span>Total Paid</span>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-heading)', fontSize: '1.15rem' }}>
              ₹{placedOrder.grandTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Note for Chef display */}
        {placedOrder.chefNote && (
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
              "{placedOrder.chefNote}"
            </p>
          </div>
        )}

        {/* Action Button: When Served or Completed */}
        {(orderStatus === 'served' || orderStatus === 'completed') ? (
          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.9rem', fontSize: '0.9rem', justifyContent: 'center' }}
            onClick={handleDone}
          >
            <IconParty s={18} /> Done — Back to Menu
          </button>
        ) : (
          <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            Status updates live in real-time as the kitchen prepares your meal.
          </div>
        )}
      </div>
    </div>
  );
}
