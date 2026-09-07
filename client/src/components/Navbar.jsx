import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useSocket } from '../context/SocketContext';
import { IconCart, IconClose, IconChef } from './Icons';

export default function Navbar({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen, selectedTable, setIsTableSelectorOpen } = useCart();
  const { connected } = useSocket();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close on resize to desktop
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { href: '#hero', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#menu', label: 'Menu' },
    { href: '#gallery', label: 'Ambiance' },
    { href: '#testimonials', label: 'Reviews' },
  ];

  const handleLinkClick = (href) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 500,
        backgroundColor: scrolled ? 'rgba(10, 15, 13, 0.95)' : 'rgba(10, 15, 13, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
        padding: '0.8rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a href="#hero" className="navbar__brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            AURA <span className="navbar__brand-amp">&</span> ROYALE
          </a>
          
          {/* Live Kitchen Sync Dot */}
          <span style={{
            fontSize: '0.65rem',
            padding: '2px 8px',
            borderRadius: '12px',
            backgroundColor: connected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: connected ? '#10b981' : '#f87171',
            border: connected ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontWeight: '600'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: connected ? '#10b981' : '#f87171'
            }} />
            {connected ? 'Live Sync' : 'Offline Mode'}
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar__desktop" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className="navbar__link">
              {link.label}
            </a>
          ))}

          {/* Table Indicator Pill */}
          <button
            onClick={() => setIsTableSelectorOpen(true)}
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: 'var(--color-accent)',
              borderRadius: '20px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.78rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🪑 Table {selectedTable ? `T${selectedTable}` : 'Select'}
          </button>

          {/* Cart Trigger */}
          <button onClick={() => setIsCartOpen(true)} className="navbar__cart-btn" aria-label="Open cart">
            <IconCart s={18} />
            {totalItems > 0 && <span className="badge">{totalItems}</span>}
          </button>

          {/* Separate Admin Portal Link */}
          <a
            href="/admin"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/admin');
            }}
            style={{
              fontSize: '0.78rem',
              color: 'var(--color-text-muted)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '6px 12px',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent)';
              e.currentTarget.style.color = 'var(--color-accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'var(--color-text-muted)';
            }}
            title="Kitchen staff and manager login"
          >
            <IconChef s={14} /> Kitchen Staff
          </a>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Order Now
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="navbar__mobile-controls">
          <button onClick={() => setIsCartOpen(true)} className="navbar__cart-btn" aria-label="Open cart">
            <IconCart s={18} />
            {totalItems > 0 && <span className="badge">{totalItems}</span>}
          </button>

          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className={`navbar__hamburger-line ${menuOpen ? 'open' : ''}`} />
            <span className={`navbar__hamburger-line ${menuOpen ? 'open' : ''}`} />
            <span className={`navbar__hamburger-line ${menuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)} />
          <div className="mobile-menu">
            <div className="mobile-menu__header">
              <span className="navbar__brand" style={{ fontSize: '1.3rem' }}>
                AURA <span className="navbar__brand-amp">&</span> ROYALE
              </span>
              <button onClick={() => setMenuOpen(false)} className="mobile-menu__close" aria-label="Close menu">
                <IconClose s={24} />
              </button>
            </div>
            <div className="mobile-menu__links">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="mobile-menu__link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                >
                  {link.label}
                </a>
              ))}
              
              <a
                href="/admin"
                className="mobile-menu__link"
                style={{ color: 'var(--color-accent)' }}
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(false);
                  onNavigate('/admin');
                }}
              >
                👨‍🍳 Kitchen / Admin Portal
              </a>
            </div>
            <div className="mobile-menu__footer">
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  setMenuOpen(false);
                  document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Order Now
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
