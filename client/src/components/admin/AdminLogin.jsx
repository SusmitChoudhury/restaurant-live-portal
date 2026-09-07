import React, { useState } from 'react';
import { IconChef, IconCheck } from '../Icons';

export default function AdminLogin({ onLoginSuccess, onReturnHome }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'Smile@123') {
      sessionStorage.setItem('admin_auth_token', 'true');
      onLoginSuccess();
    } else {
      setError('Access Denied: Incorrect password. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #0f221a 0%, #080c0a 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        background: '#141a18',
        border: '1px solid rgba(212, 175, 55, 0.25)',
        borderRadius: '16px',
        padding: '36px 30px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(212, 175, 55, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(212, 175, 55, 0.12)',
          border: '1px solid var(--color-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          color: 'var(--color-accent)'
        }}>
          <IconChef s={32} />
        </div>

        <span style={{
          color: 'var(--color-accent)',
          fontSize: '0.75rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          fontWeight: '700'
        }}>
          Restricted Staff Access
        </span>

        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.75rem',
          color: '#fff',
          margin: '0.4rem 0 0.8rem'
        }}>
          Kitchen & Admin Portal
        </h2>

        <p style={{
          color: 'var(--color-text-muted)',
          fontSize: '0.88rem',
          marginBottom: '2rem',
          lineHeight: '1.5'
        }}>
          Enter the manager authorization code to manage live incoming orders and menu stock availability.
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#f87171',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            marginBottom: '1.25rem',
            textAlign: 'left'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              marginBottom: '0.4rem',
              fontWeight: '600'
            }}>
              Manager Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter password..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem' }}
          >
            Unlock Kitchen Dashboard
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            onClick={onReturnHome}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '0.82rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            ← Return to Customer Website
          </button>
        </div>
      </div>
    </div>
  );
}
