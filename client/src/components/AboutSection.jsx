import barImg from '../assets/images/restaurant_bar_1781774433025.png';
import diningImg from '../assets/images/restaurant_dining_1781774446073.png';
import { IconUtensils, IconAward, IconLeaf, IconWine } from './Icons';

const AboutSection = () => {
  const features = [
    { icon: <IconUtensils s={20} />, label: 'Global Fusion Cuisine' },
    { icon: <IconAward s={20} />, label: '15 Culinary Awards' },
    { icon: <IconLeaf s={20} />, label: 'Farm-to-Table Fresh' },
    { icon: <IconWine s={20} />, label: 'Premium Wine Selection' },
  ];

  return (
    <section id="about" className="section" style={{ backgroundColor: 'var(--color-primary)' }}>
      <div className="container">
        <div className="about-grid">
          <div className="about-images">
            <img src={barImg} alt="Our Premium Bar" className="about-images__main" />
            <img src={diningImg} alt="Fine Dining Hall" className="about-images__secondary" />
            <div className="about-images__stat">
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: '700' }}>8+</span>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Years of Excellence</span>
            </div>
          </div>
          <div>
            <span className="section-subtitle">Our Story</span>
            <h2 className="section-title" style={{ textAlign: 'left' }}>
              Where Tradition <br/>Meets <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>Modern Luxury</span>
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '2rem', marginBottom: '1.5rem', lineHeight: '1.9', fontSize: '1rem' }}>
              Founded in 2018, Jade & Gold was born from a passion for global culinary fusion. Our chefs blend traditions of Asian, European, and Indian cuisines into a world-class experience.
            </p>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: '1.9', fontSize: '1rem' }}>
              Every ingredient is hand-selected, every dish a masterpiece. We believe dining is not just about food — it is an art form.
            </p>
            <div className="about-features">
              {features.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-accent)' }}>
                  {item.icon}
                  <span style={{ fontSize: '0.88rem', fontWeight: '500', color: 'var(--color-text-main)' }}>{item.label}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-outline" onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}>
              Discover Our Menu
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
