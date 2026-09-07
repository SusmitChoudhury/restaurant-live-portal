import sushiImg from '../assets/images/premium_sushi_1781771610958.png';
import burgerImg from '../assets/images/premium_burger_1781771634417.png';
import { IconFire } from './Icons';

const ChefSpecial = () => {
  return (
    <section style={{
      padding: '6rem 0',
      background: 'linear-gradient(135deg, rgba(25, 56, 44, 0.9), rgba(10, 15, 13, 0.95))',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)', filter: 'blur(60px)',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <span className="section-subtitle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <IconFire s={16} /> Today's Highlight
          </span>
          <h2 className="section-title">Chef's Special</h2>
        </div>

        <div className="chef-grid">
          {[
            { img: sushiImg, name: 'Sakura Dragon Roll', desc: 'Mango, tempura prawn, salmon, topped with gold leaf and our signature wasabi-yuzu sauce.', price: '1,850', oldPrice: '2,200', badge: "Chef's Pick", badgeColor: 'var(--color-accent)', badgeTextColor: '#111' },
            { img: burgerImg, name: 'The Emperor Burger', desc: 'Double grilled lamb patties, smoked gouda, caramelized onions, truffle mushroom duxelle on charcoal brioche.', price: '1,650', oldPrice: '1,999', badge: 'Limited Time', badgeColor: '#e74c3c', badgeTextColor: 'white' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)', borderRadius: '16px', overflow: 'hidden',
              border: '1px solid rgba(212, 175, 55, 0.15)', transition: 'all 0.4s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(212, 175, 55, 0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ position: 'relative' }}>
                <img src={item.img} alt={item.name} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', top: '1rem', right: '1rem', background: item.badgeColor, color: item.badgeTextColor,
                  padding: '0.35rem 0.9rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px',
                }}>
                  {item.badge}
                </div>
              </div>
              <div style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1rem', lineHeight: '1.7' }}>{item.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: '700' }}>₹{item.price}</span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', textDecoration: 'line-through' }}>₹{item.oldPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChefSpecial;
