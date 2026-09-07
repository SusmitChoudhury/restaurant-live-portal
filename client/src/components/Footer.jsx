import { useState } from 'react';
import { IconMapPin, IconMail, IconPhone, IconClock, IconFacebook, IconInstagram, IconTwitter, IconYoutube, IconChevronRight } from './Icons';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer id="contact" style={{
      backgroundColor: '#070c0a',
      padding: '5rem 0 2rem',
      borderTop: '1px solid rgba(212, 175, 55, 0.15)',
    }}>
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent)', marginBottom: '1.5rem', fontSize: '1.4rem', letterSpacing: '2px' }}>
              JADE & GOLD
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              Elevating global cuisine to an art form. Experience tradition and modern luxury at every table.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {[
                { icon: <IconFacebook s={16} />, label: 'Facebook' },
                { icon: <IconInstagram s={16} />, label: 'Instagram' },
                { icon: <IconTwitter s={16} />, label: 'Twitter' },
                { icon: <IconYoutube s={16} />, label: 'Youtube' },
              ].map((social, i) => (
                <a key={i} href="#" onClick={(e) => e.preventDefault()} aria-label={social.label}
                  style={{
                    width: '38px', height: '38px', borderRadius: '8px', border: '1px solid rgba(212, 175, 55, 0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', color: 'var(--color-text-muted)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-accent-dim)'; e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--color-text-main)', marginBottom: '1.5rem', fontSize: '1rem' }}>Quick Links</h4>
            {[
              { href: '#hero', label: 'Home' }, { href: '#about', label: 'About Us' },
              { href: '#menu', label: 'Our Menu' }, { href: '#gallery', label: 'Gallery' },
              { href: '#testimonials', label: 'Reviews' },
            ].map((link, i) => (
              <a key={i} href={link.href} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '0.6rem', transition: 'all 0.3s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)'; e.currentTarget.style.paddingLeft = '6px'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.paddingLeft = '0'; }}
              >
                <IconChevronRight s={14} /> {link.label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'var(--color-text-main)', marginBottom: '1.5rem', fontSize: '1rem' }}>Contact Us</h4>
            {[
              { icon: <IconMapPin s={16} />, text: '42, MG Road, Connaught Place, New Delhi 110001' },
              { icon: <IconMail s={16} />, text: 'reservations@jadegold.in' },
              { icon: <IconPhone s={16} />, text: '+91 98765 43210' },
              { icon: <IconClock s={16} />, text: 'Mon-Sun: 12 PM – 1 AM' },
            ].map((info, i) => (
              <p key={i} style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '0.6rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }}>{info.icon}</span>
                {info.text}
              </p>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color: 'var(--color-text-main)', marginBottom: '1.5rem', fontSize: '1rem' }}>Newsletter</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '1rem', lineHeight: '1.7' }}>
              Subscribe for exclusive invitations, seasonal menu launches, and members-only events.
            </p>
            <div style={{ display: 'flex' }}>
              <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                style={{ padding: '0.7rem 0.9rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRight: 'none', color: 'white', outline: 'none', width: '100%', borderRadius: '6px 0 0 6px', fontSize: '0.88rem' }}
              />
              <button className="btn btn-primary" style={{ borderRadius: '0 6px 6px 0', padding: '0.7rem 1rem', fontSize: '0.8rem' }} onClick={handleSubscribe}>Join</button>
            </div>
            {subscribed && <p style={{ color: 'var(--color-success)', fontSize: '0.78rem', marginTop: '0.4rem' }}>Successfully subscribed!</p>}
          </div>
        </div>

        <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>&copy; {new Date().getFullYear()} Jade & Gold Restaurant. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((link, i) => (
              <a key={i} href="#" onClick={(e) => e.preventDefault()} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
              >{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
