import heroImg from '../assets/images/premium_hero_1781771597010.png';
import { IconUtensils, IconArrowDown } from './Icons';

const Hero = () => {
  return (
    <section id="hero" style={{
      minHeight: '100vh',
      width: '100%',
      backgroundImage: `linear-gradient(135deg, rgba(15, 34, 26, 0.75) 0%, rgba(10, 15, 13, 0.9) 100%), url(${heroImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      paddingTop: '85px',
      paddingBottom: '3rem',
    }}>
      <div style={{
        position: 'absolute', top: '10%', left: '5%', width: '200px', height: '200px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)', filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '10%', width: '300px', height: '300px',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(25,56,44,0.3) 0%, transparent 70%)', filter: 'blur(50px)',
      }} />

      <div className="container text-center animate-fade-in" style={{ position: 'relative', zIndex: 2 }}>
        {/* Static Disclaimer Banner Below Navbar */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          background: 'rgba(212, 175, 55, 0.08)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '50px',
          padding: '0.45rem 1.25rem',
          marginBottom: '1.75rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
          maxWidth: '95%',
          flexWrap: 'wrap',
        }}>
          <span style={{
            background: 'var(--color-accent)',
            color: '#0a0f0d',
            fontWeight: '700',
            fontSize: '0.72rem',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            padding: '0.2rem 0.65rem',
            borderRadius: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}>
            ⚠️ Demo Sample
          </span>
          <span style={{
            color: '#f0f5f2',
            fontSize: '0.84rem',
            fontWeight: '400',
            lineHeight: '1.4',
          }}>
            This is a sample demonstration website. Some minor errors may be present, but the final client-side website will be 100% complete and perfect.
          </span>
        </div>

        <div style={{ display: 'block' }}>
          <span className="section-subtitle" style={{ fontSize: '0.85rem', letterSpacing: '5px' }}>
            Exquisite Dining Experience
          </span>
        </div>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          marginBottom: '1.5rem',
          lineHeight: '1.08',
          textShadow: '0 4px 30px rgba(0,0,0,0.6)',
        }}>
          Awaken Your Senses <br />
          <span style={{
            color: 'var(--color-accent)',
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, #d4af37, #f0d060, #d4af37)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            with Premium Global Flavors
          </span>
        </h1>
        <p style={{
          maxWidth: '650px', margin: '0 auto 2.5rem', fontSize: '1.05rem',
          color: 'var(--color-text-muted)', lineHeight: '1.8',
        }}>
          From artisanal sushi to authentic Indian biryani, wood-fired pizzas to handcrafted cocktails —
          explore 100+ dishes and order directly from your table.
        </p>
        <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}>
            <IconUtensils s={16} /> Explore Our Menu
          </button>
          <button className="btn btn-outline" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
            Our Story
          </button>
        </div>
        <div style={{ marginTop: '4rem', opacity: 0.4, color: 'var(--color-accent)', animation: 'fadeInUp 2s ease infinite alternate' }}>
          <IconArrowDown s={24} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
