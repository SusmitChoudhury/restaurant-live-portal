import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { IconChef, IconCheck, IconUtensils, IconParty } from './Icons';

const steps = [
  { key: 'preparing', label: 'Preparing', icon: <IconChef s={24} />, description: 'Our chefs are crafting your order with care...' },
  { key: 'ready', label: 'Ready', icon: <IconCheck s={24} />, description: 'Your order is ready and being served!' },
  { key: 'served', label: 'Served', icon: <IconUtensils s={24} />, description: 'Your food has arrived. Enjoy your meal!' },
];

const OrderTracker = () => {
  const { orderStatus, setOrderStatus, placedOrder, resetOrder } = useCart();
  const [elapsed, setElapsed] = useState(0);

  // Auto-advance timer
  useEffect(() => {
    if (!orderStatus || orderStatus === 'served') return;
    const timer = setInterval(() => setElapsed(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [orderStatus]);

  // Reset elapsed when status changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setElapsed(0);
  }, [orderStatus]);

  // Auto-advance: preparing (15s) -> ready (10s) -> served
  useEffect(() => {
    if (orderStatus === 'preparing' && elapsed >= 15) {
      setOrderStatus('ready');
    } else if (orderStatus === 'ready' && elapsed >= 10) {
      setOrderStatus('served');
    }
  }, [elapsed, orderStatus, setOrderStatus]);

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

  const currentIdx = steps.findIndex(s => s.key === orderStatus);

  const getEstimate = () => {
    if (orderStatus === 'preparing') return `~${Math.max(15 - elapsed, 0)}s remaining`;
    if (orderStatus === 'ready') return `~${Math.max(10 - elapsed, 0)}s remaining`;
    return 'Completed';
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
      background: 'var(--color-background-dark)',
      zIndex: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.4s ease',
      overflowY: 'auto',
      padding: '2rem',
    }}>
      <div style={{
        background: 'var(--color-primary-dark)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '16px',
        padding: 'clamp(1.5rem, 3vw, 3rem)',
        maxWidth: '580px',
        width: '100%',
        boxShadow: 'var(--shadow-glow)',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '1.5rem' }}>
          <span className="section-subtitle">Order Placed Successfully</span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', margin: 0 }}>
            Tracking Your Order
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem', fontSize: '0.88rem' }}>
            Table <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>T{placedOrder.table}</span> &bull;
            Placed at <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>{placedOrder.time}</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          {steps.map((step, i) => {
            let dotClass = 'progress-dot';
            let labelClass = 'progress-label';
            if (i < currentIdx) { dotClass += ' done'; }
            else if (i === currentIdx) { dotClass += ' active'; labelClass += ' active'; }

            return (
              <div key={step.key} className="progress-step">
                <div className={dotClass}>{step.icon}</div>
                <span className={labelClass}>{step.label}</span>
              </div>
            );
          })}
        </div>

        {/* Current Status */}
        <div style={{
          textAlign: 'center',
          padding: '1.25rem',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '10px',
          border: '1px solid rgba(212, 175, 55, 0.1)',
          marginBottom: '1.25rem',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
            {steps[currentIdx].icon}
          </div>
          <h3 style={{ margin: '0 0 0.4rem', fontFamily: 'var(--font-heading)', color: 'var(--color-accent)', fontSize: '1.2rem' }}>
            {steps[currentIdx].label}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.9rem' }}>
            {steps[currentIdx].description}
          </p>
          <p style={{ color: 'var(--color-text-muted)', margin: '0.4rem 0 0', fontSize: '0.75rem', opacity: 0.7 }}>
            {getEstimate()}
          </p>
        </div>

        {/* Order Summary */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-accent)', marginBottom: '0.5rem', fontFamily: 'var(--font-body)', fontWeight: '600' }}>
            Order Summary
          </h4>
          {placedOrder.items.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.35rem 0',
              fontSize: '0.85rem',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
            }}>
              <span>{item.name} x {item.qty}</span>
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
                  <span>{e.name} x {e.qty}</span>
                  <span>₹{(e.price * e.qty).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </>
          )}

          {/* Billing Breakdown */}
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', color: 'var(--color-text-muted)' }}>
              <span>Subtotal</span><span>₹{placedOrder.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', color: 'var(--color-text-muted)' }}>
              <span>GST (5%)</span><span>₹{placedOrder.gst.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.2rem 0', color: 'var(--color-text-muted)' }}>
              <span>Service Charge (3%)</span><span>₹{placedOrder.serviceCharge.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '0.5rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontWeight: '700',
            fontSize: '1.05rem',
          }}>
            <span>Grand Total</span>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-heading)', fontSize: '1.15rem' }}>
              ₹{placedOrder.grandTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Chef Note */}
        {placedOrder.chefNote && (
          <div style={{
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.15)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
          }}>
            <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-accent)', marginBottom: '0.35rem', fontFamily: 'var(--font-body)', fontWeight: '600' }}>
              Note for Chef
            </h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0, fontStyle: 'italic', lineHeight: '1.5' }}>
              "{placedOrder.chefNote}"
            </p>
          </div>
        )}

        {/* Done Button — always visible when served */}
        {orderStatus === 'served' && (
          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '1rem', fontSize: '0.9rem', position: 'relative', zIndex: 10 }}
            onClick={handleDone}
          >
            <IconParty s={18} /> Done — Back to Menu
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderTracker;
