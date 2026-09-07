import { useState, useEffect, useRef } from 'react';
import { IconUtensils, IconStar, IconAward, IconUsers } from './Icons';

const stats = [
  { icon: <IconUtensils s={28} />, value: 5000, suffix: '+', label: 'Dishes Served Monthly' },
  { icon: <IconStar s={28} />, value: 200, suffix: '+', label: 'Five-Star Reviews' },
  { icon: <IconAward s={28} />, value: 15, suffix: '', label: 'Culinary Awards' },
  { icon: <IconUsers s={28} />, value: 12, suffix: '', label: 'Expert Chefs' },
];

const StatsCounter = () => {
  const [counts, setCounts] = useState(stats.map(() => 0));
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCounts(stats.map(s => Math.min(Math.round((s.value * step) / steps), s.value)));
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [started]);

  return (
    <section ref={ref} style={{
      padding: '5rem 0',
      background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-primary-dark) 100%)',
      borderTop: '1px solid rgba(212, 175, 55, 0.1)',
      borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
    }}>
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} style={{
              padding: '2rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(212, 175, 55, 0.08)', transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ marginBottom: '0.75rem', color: 'var(--color-accent)', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.8rem', fontWeight: '700', color: 'var(--color-accent)', lineHeight: '1', marginBottom: '0.5rem' }}>
                {counts[i].toLocaleString('en-IN')}{stat.suffix}
              </div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
