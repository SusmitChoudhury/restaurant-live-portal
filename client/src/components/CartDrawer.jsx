import { useCart } from '../context/CartContext';
import { useSocket } from '../context/SocketContext';
import { IconClose, IconTrash, IconCart, IconMapPin } from './Icons';

const CartDrawer = () => {
  const { menu } = useSocket();
  const {
    cart, isCartOpen, setIsCartOpen,
    updateQty, removeFromCart, clearCart,
    extras, addExtra, removeExtra, updateExtraQty, EXTRAS_LIST,
    itemsSubtotal, extrasSubtotal, gst, serviceCharge, grandTotal, totalItems,
    selectedTable, setIsTableSelectorOpen,
    chefNote, setChefNote,
  } = useCart();

  const isItemOutOfStock = (id) => {
    const m = menu.find(i => i.id === id || String(i.id) === String(id));
    return m ? m.isAvailable === false : false;
  };
  const hasOutOfStockItems = cart.some(item => isItemOutOfStock(item.id));


  if (!isCartOpen) return null;

  return (
    <>
      <div className="overlay" onClick={() => setIsCartOpen(false)} />
      <div className="drawer">
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IconCart s={20} /> Your Order <span style={{ color: 'var(--color-accent)', fontSize: '0.9rem' }}>({totalItems})</span>
          </h3>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              flexShrink: 0
            }}
            aria-label="Close cart"
          >
            <IconClose s={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.4 }}><IconCart s={48} /></div>
              <p style={{ fontSize: '1rem' }}>Your cart is empty</p>
              <p style={{ fontSize: '0.82rem', marginTop: '0.5rem' }}>Browse our menu and add some delicious items!</p>
              <button className="btn btn-outline btn-sm" style={{ marginTop: '1.5rem' }} onClick={() => { setIsCartOpen(false); document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }); }}>
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-accent)', marginBottom: '0.75rem', fontFamily: 'var(--font-body)', fontWeight: '600' }}>
                  Menu Items
                </h4>
                {cart.map(item => {
                  const outOfStock = isItemOutOfStock(item.id);
                  return (
                    <div key={item.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 0',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      gap: '0.75rem',
                      backgroundColor: outOfStock ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                      borderRadius: '8px'
                    }}>
                      <div style={{ flexGrow: 1, minWidth: 0, paddingLeft: outOfStock ? '8px' : '0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <h4 style={{ margin: 0, fontSize: '0.88rem', fontFamily: 'var(--font-body)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.name}
                          </h4>
                          {outOfStock && (
                            <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '0.62rem', padding: '1px 5px', borderRadius: '4px', fontWeight: '800' }}>
                              OUT OF STOCK
                            </span>
                          )}
                        </div>
                        <span style={{ color: outOfStock ? '#f87171' : 'var(--color-accent)', fontSize: '0.8rem', fontWeight: '600' }}>
                          ₹{item.price.toLocaleString('en-IN')} × {item.qty} = ₹{(item.price * item.qty).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        <div className="qty-control">
                          <button className="qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                          <span className="qty-value">{item.qty}</span>
                          <button
                            className="qty-btn"
                            disabled={outOfStock}
                            style={{ opacity: outOfStock ? 0.3 : 1, cursor: outOfStock ? 'not-allowed' : 'pointer' }}
                            onClick={() => !outOfStock && updateQty(item.id, item.qty + 1)}
                          >+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '0.2rem' }} title="Remove">
                          <IconTrash s={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Extras / Add-ons */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '10px',
                border: '1px solid rgba(212, 175, 55, 0.1)',
                padding: '1rem',
                marginBottom: '1rem',
              }}>
                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-accent)', marginBottom: '0.75rem', fontFamily: 'var(--font-body)', fontWeight: '600' }}>
                  Add Extras
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {EXTRAS_LIST.map(extra => {
                    const inCart = extras.find(e => e.id === extra.id);
                    return (
                      <div
                        key={extra.id}
                        style={{
                          background: inCart ? 'var(--color-accent-dim)' : 'rgba(255,255,255,0.03)',
                          border: inCart ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '8px',
                          padding: '0.6rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ fontSize: '0.78rem', fontWeight: '500', lineHeight: '1.3', color: inCart ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                          {extra.name}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: inCart ? 'var(--color-accent)' : 'rgba(255,255,255,0.6)' }}>
                            ₹{extra.price}
                          </div>

                          {inCart ? (
                            <div className="qty-control" style={{ transform: 'scale(0.85)', transformOrigin: 'right center' }}>
                              <button 
                                className="qty-btn" 
                                style={{ width: '24px', height: '24px', fontSize: '0.85rem' }} 
                                onClick={() => updateExtraQty(extra.id, inCart.qty - 1)}
                                title="Decrease quantity"
                              >−</button>
                              <span className="qty-value" style={{ width: '24px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-accent)' }}>
                                {inCart.qty}
                              </span>
                              <button 
                                className="qty-btn" 
                                style={{ width: '24px', height: '24px', fontSize: '0.85rem' }} 
                                onClick={() => updateExtraQty(extra.id, inCart.qty + 1)}
                                title="Add more"
                              >+</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addExtra(extra)}
                              style={{
                                background: 'rgba(212, 175, 55, 0.1)',
                                border: '1px solid rgba(212, 175, 55, 0.3)',
                                color: 'var(--color-accent)',
                                borderRadius: '6px',
                                padding: '0.2rem 0.6rem',
                                fontSize: '0.72rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--color-accent)';
                                e.currentTarget.style.color = '#000';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                                e.currentTarget.style.color = 'var(--color-accent)';
                              }}
                            >
                              <span>+</span> Add
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected extras with qty */}
                {extras.length > 0 && (
                  <div style={{ marginTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                    {extras.map(e => (
                      <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.3rem 0', fontSize: '0.82rem' }}>
                        <span>{e.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div className="qty-control">
                            <button className="qty-btn" style={{ width: '26px', height: '26px', fontSize: '0.8rem' }} onClick={() => updateExtraQty(e.id, e.qty - 1)}>−</button>
                            <span className="qty-value" style={{ width: '28px', fontSize: '0.8rem' }}>{e.qty}</span>
                            <button className="qty-btn" style={{ width: '26px', height: '26px', fontSize: '0.8rem' }} onClick={() => updateExtraQty(e.id, e.qty + 1)}>+</button>
                          </div>
                          <span style={{ color: 'var(--color-accent)', fontWeight: '600', fontSize: '0.8rem', width: '50px', textAlign: 'right' }}>₹{(e.price * e.qty).toLocaleString('en-IN')}</span>
                          <button onClick={() => removeExtra(e.id)} style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '0.2rem' }} title="Remove">
                            <IconTrash s={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ═══ NOTE FOR CHEF ═══ */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '10px',
                border: '1px solid rgba(212, 175, 55, 0.1)',
                padding: '1rem',
                marginBottom: '1rem',
              }}>
                <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-accent)', marginBottom: '0.6rem', fontFamily: 'var(--font-body)', fontWeight: '600' }}>
                  Note for Chef
                </h4>
                <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem', lineHeight: '1.5' }}>
                  Special requests, allergies, spice level, or any changes to your order:
                </p>
                <textarea
                  value={chefNote}
                  onChange={(e) => setChefNote(e.target.value)}
                  placeholder="e.g. No onions in biryani, extra spicy butter chicken, nut allergy — please avoid cashews..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.8rem',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'var(--color-text-main)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.82rem',
                    resize: 'vertical',
                    outline: 'none',
                    lineHeight: '1.5',
                    transition: 'border-color 0.3s',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                {chefNote.trim() && (
                  <div style={{ marginTop: '0.4rem', fontSize: '0.7rem', color: 'var(--color-success)', fontWeight: '500' }}>
                    Note will be sent to the kitchen with your order
                  </div>
                )}
              </div>

              <button onClick={clearCart} style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500' }}>
                Clear All
              </button>
            </>
          )}
        </div>

        {/* Footer - Detailed Billing */}
        {cart.length > 0 && (
          <div style={{
            padding: '1.25rem clamp(1rem, 4vw, 1.5rem)',
            paddingBottom: 'max(1.5rem, calc(env(safe-area-inset-bottom) + 1.25rem))',
            borderTop: '1px solid rgba(212, 175, 55, 0.15)',
            background: 'rgba(0,0,0,0.3)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Items Subtotal</span>
              <span>₹{itemsSubtotal.toLocaleString('en-IN')}</span>
            </div>
            {extrasSubtotal > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Extras</span>
                <span>₹{extrasSubtotal.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>GST (5%)</span>
              <span>₹{gst.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Service Charge (3%)</span>
              <span>₹{serviceCharge.toLocaleString('en-IN')}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '0.6rem',
              paddingTop: '0.6rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              fontSize: '1.1rem',
              fontWeight: '700',
            }}>
              <span>Grand Total</span>
              <span style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {selectedTable && (
              <div style={{ marginTop: '0.6rem', padding: '0.4rem 0.8rem', background: 'var(--color-accent-dim)', borderRadius: '6px', fontSize: '0.82rem', color: 'var(--color-accent)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <IconMapPin s={14} /> Table {selectedTable} selected
              </div>
            )}

            {hasOutOfStockItems ? (
              <button
                className="btn btn-secondary"
                disabled
                style={{
                  width: '100%',
                  marginTop: '0.75rem',
                  padding: '0.9rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#f87171',
                  fontWeight: '700',
                  cursor: 'not-allowed',
                  justifyContent: 'center'
                }}
              >
                ⚠️ Please Remove Out-of-Stock Items to Order
              </button>
            ) : (
              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.75rem', padding: '0.9rem', justifyContent: 'center' }}
                onClick={() => { setIsCartOpen(false); setIsTableSelectorOpen(true); }}
              >
                {selectedTable ? 'Confirm & Place Order' : 'Select Table & Order'}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
