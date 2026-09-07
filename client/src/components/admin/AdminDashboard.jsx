import React, { useState } from 'react';
import { useSocket, playOrderChime } from '../../context/SocketContext';
import AdminLogin from './AdminLogin';
import AdminStats from './AdminStats';
import StockManager from './StockManager';
import OrderCard from './OrderCard';
import { IconChef } from '../Icons';

export default function AdminDashboard({ onNavigate }) {
  const {
    orders,
    menu,
    connected,
    updateOrderStatus,
    backendUrl,
    saveCustomBackendUrl
  } = useSocket();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_auth_token') === 'true';
  });

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'stock' | 'stats'
  const [filterStatus, setFilterStatus] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [inputUrl, setInputUrl] = useState(backendUrl || '');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth_token');
    setIsAuthenticated(false);
  };

  const handleSaveUrl = (e) => {
    e.preventDefault();
    saveCustomBackendUrl(inputUrl);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      setShowSettings(false);
    }, 1500);
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLoginSuccess={() => setIsAuthenticated(true)}
        onReturnHome={() => onNavigate('/')}
      />
    );
  }

  const activeOrdersCount = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const cookingOrdersCount = orders.filter(o => o.status === 'preparing').length;
  const servedOrdersCount = orders.filter(o => o.status === 'served' || o.status === 'completed').length;
  const outOfStockCount = menu.filter(i => i.isAvailable === false).length;

  const filteredOrders = orders.filter(o => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return o.status === 'pending' || o.status === 'preparing';
    return o.status === filterStatus;
  });

  return (
    <div className="admin-layout" style={{ minHeight: '100vh', backgroundColor: '#080c0a', color: '#f0f5f2' }}>
      {/* Sticky Mobile Top Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 200,
        backgroundColor: 'rgba(15, 34, 26, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
        padding: '10px clamp(12px, 3vw, 24px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px'
      }}>
        {/* Brand & Connection Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid var(--color-accent)',
            color: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <IconChef s={20} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(0.95rem, 3.5vw, 1.25rem)',
              margin: 0,
              color: '#fff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              Kitchen Portal
            </h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.68rem',
              color: 'var(--color-text-muted)',
              whiteSpace: 'nowrap'
            }}>
              <span className="live-dot" style={{ backgroundColor: connected ? '#10b981' : '#f59e0b', width: '8px', height: '8px' }} />
              <span>{connected ? 'Cloud Synced' : 'Local Sync Active'}</span>
            </div>
          </div>
        </div>

        {/* Action Controls: Compact and touch-friendly */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <button
            onClick={playOrderChime}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              touchAction: 'manipulation'
            }}
            title="Test notification sound chime"
          >
            🔔 <span className="admin-btn-text">Chime</span>
          </button>

          <button
            onClick={() => onNavigate('/')}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              backgroundColor: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: 'var(--color-accent)',
              fontSize: '0.78rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              touchAction: 'manipulation'
            }}
            title="View customer dining menu"
          >
            🌐 <span className="admin-btn-text">Customer</span>
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              padding: '6px 8px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
              fontSize: '0.8rem',
              cursor: 'pointer',
              touchAction: 'manipulation'
            }}
            title="Cloud Server Link Settings"
          >
            ⚙️
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#f87171',
              fontSize: '0.76rem',
              fontWeight: '700',
              cursor: 'pointer',
              touchAction: 'manipulation'
            }}
            title="Log out of Kitchen Portal"
          >
            🔒 <span className="admin-btn-text">Logout</span>
          </button>
        </div>
      </header>

      {/* Backend Settings Panel */}
      {showSettings && (
        <div style={{
          backgroundColor: '#0f1713',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
          padding: '14px clamp(12px, 3vw, 24px)',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--color-accent)', margin: '0 0 4px' }}>
              ⚙️ Backend Server Connection URL
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '0 0 10px' }}>
              Enter your live Railway backend URL. Cross-tab sync between customer and admin is active with 0ms delay!
            </p>
            <form onSubmit={handleSaveUrl} style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://restaurant-live-portal-production.up.railway.app"
                style={{
                  flexGrow: 1,
                  minWidth: '220px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  color: '#fff',
                  fontSize: '16px' // Prevents iOS zoom
                }}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ minHeight: '38px', padding: '6px 14px', fontSize: '0.8rem' }}
              >
                Save & Connect
              </button>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="btn-secondary"
                style={{ minHeight: '38px', fontSize: '0.78rem', padding: '6px 12px' }}
              >
                Close
              </button>
              {savedNotice && (
                <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: '700' }}>
                  ✓ Saved! Reconnecting...
                </span>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Main Kitchen Navigation Tabs (Segmented Control) */}
      <div style={{
        backgroundColor: '#0c1310',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'sticky',
        top: '57px',
        zIndex: 150,
        padding: '8px clamp(12px, 3vw, 24px)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none'
        }}>
          {/* Orders Tab */}
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              flex: '1 1 0',
              minWidth: '110px',
              padding: '10px 12px',
              borderRadius: '10px',
              border: activeTab === 'orders' ? '1.5px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.08)',
              backgroundColor: activeTab === 'orders' ? 'var(--color-accent)' : 'rgba(255,255,255,0.03)',
              color: activeTab === 'orders' ? '#0a0f0d' : 'var(--color-text-muted)',
              fontWeight: activeTab === 'orders' ? '800' : '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              touchAction: 'manipulation'
            }}
          >
            <span>🔥 Orders</span>
            <span style={{
              backgroundColor: activeTab === 'orders' ? '#0a0f0d' : 'rgba(245, 158, 11, 0.2)',
              color: activeTab === 'orders' ? 'var(--color-accent)' : '#f59e0b',
              padding: '1px 6px',
              borderRadius: '10px',
              fontSize: '0.72rem',
              fontWeight: '900'
            }}>
              {activeOrdersCount}
            </span>
          </button>

          {/* Stock & Menu Tab */}
          <button
            onClick={() => setActiveTab('stock')}
            style={{
              flex: '1 1 0',
              minWidth: '110px',
              padding: '10px 12px',
              borderRadius: '10px',
              border: activeTab === 'stock' ? '1.5px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.08)',
              backgroundColor: activeTab === 'stock' ? 'var(--color-accent)' : 'rgba(255,255,255,0.03)',
              color: activeTab === 'stock' ? '#0a0f0d' : 'var(--color-text-muted)',
              fontWeight: activeTab === 'stock' ? '800' : '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              touchAction: 'manipulation'
            }}
          >
            <span>📦 Stock</span>
            {outOfStockCount > 0 && (
              <span style={{
                backgroundColor: activeTab === 'stock' ? '#0a0f0d' : 'rgba(239, 68, 68, 0.2)',
                color: activeTab === 'stock' ? '#ef4444' : '#ef4444',
                padding: '1px 6px',
                borderRadius: '10px',
                fontSize: '0.72rem',
                fontWeight: '900'
              }}>
                {outOfStockCount} Out
              </span>
            )}
          </button>

          {/* Stats & Reports Tab */}
          <button
            onClick={() => setActiveTab('stats')}
            style={{
              flex: '1 1 0',
              minWidth: '110px',
              padding: '10px 12px',
              borderRadius: '10px',
              border: activeTab === 'stats' ? '1.5px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.08)',
              backgroundColor: activeTab === 'stats' ? 'var(--color-accent)' : 'rgba(255,255,255,0.03)',
              color: activeTab === 'stats' ? '#0a0f0d' : 'var(--color-text-muted)',
              fontWeight: activeTab === 'stats' ? '800' : '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              touchAction: 'manipulation'
            }}
          >
            <span>📊 Stats</span>
          </button>
        </div>
      </div>

      {/* Main Admin Body */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px clamp(12px, 3vw, 24px) 80px' }}>
        {/* VIEW 1: LIVE ORDERS */}
        {activeTab === 'orders' && (
          <div>
            {/* Orders Filter Pills */}
            <div style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              paddingBottom: '10px',
              marginBottom: '16px'
            }}>
              {[
                { id: 'all', label: `All (${orders.length})` },
                { id: 'active', label: `🔥 Active (${activeOrdersCount})` },
                { id: 'pending', label: `⏳ Pending (${pendingOrdersCount})` },
                { id: 'preparing', label: `👨‍🍳 Cooking (${cookingOrdersCount})` },
                { id: 'served', label: `🍽️ Served (${servedOrdersCount})` }
              ].map(f => {
                const isSelected = filterStatus === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFilterStatus(f.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      fontWeight: isSelected ? '800' : '600',
                      cursor: 'pointer',
                      flexShrink: 0,
                      border: isSelected ? '1px solid var(--color-accent)' : '1px solid rgba(255,255,255,0.08)',
                      backgroundColor: isSelected ? 'var(--color-accent)' : 'rgba(255,255,255,0.03)',
                      color: isSelected ? '#0a0f0d' : 'var(--color-text-muted)',
                      transition: 'all 0.15s ease',
                      touchAction: 'manipulation'
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div style={{
                backgroundColor: '#141a18',
                borderRadius: '16px',
                padding: '48px 16px',
                textAlign: 'center',
                border: '1px solid rgba(212, 175, 55, 0.15)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🛎️</div>
                <h3 style={{ color: '#fff', marginBottom: '6px', fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>
                  No {filterStatus !== 'all' ? filterStatus : ''} orders right now
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0 auto' }}>
                  When customers place an order from table menus, it will instantly pop up here with an audio chime!
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
                gap: '14px'
              }}>
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={updateOrderStatus}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: INVENTORY & STOCK */}
        {activeTab === 'stock' && (
          <StockManager menu={menu} />
        )}

        {/* VIEW 3: METRICS & STATS */}
        {activeTab === 'stats' && (
          <div>
            <AdminStats orders={orders} menu={menu} />

            {/* Kitchen Operations Summary */}
            <div style={{
              backgroundColor: '#141a18',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '14px',
              padding: '18px',
              marginTop: '16px'
            }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#fff', margin: '0 0 10px' }}>
                Kitchen Portal Diagnostics
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Connection Engine:</span>
                  <span style={{ color: connected ? '#10b981' : 'var(--color-accent)', fontWeight: '700' }}>
                    {connected ? 'WebSocket (Cloud Sync)' : 'BroadcastChannel (Instant Tab-to-Tab)'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Stock Persistence:</span>
                  <span style={{ color: '#10b981', fontWeight: '700' }}>
                    ✓ Auto-Saved to Permanent Local Blacklist
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Total Menu Dishes:</span>
                  <span style={{ color: '#fff', fontWeight: '700' }}>{menu.length} Dishes</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Orders Processed Today:</span>
                  <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>{orders.length} Orders</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
