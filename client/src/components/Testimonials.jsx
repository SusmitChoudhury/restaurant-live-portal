import { IconStar } from './Icons';

import avatar1 from '../assets/images/avatar_woman_1_1781774520073.png';
import avatar2 from '../assets/images/avatar_man_1_1781774534169.png';
import avatar3 from '../assets/images/avatar_woman_2_1781774547012.png';
import avatar4 from '../assets/images/avatar_man_2_1781774557643.png';
import avatar5 from '../assets/images/avatar_woman_3_1781774568656.png';

const testimonials = [
  { id: 1, name: "Priya Sharma", role: "Food Critic, Times of India", text: "The Jade Chicken Burger is a revelation. The infusion of black truffle aioli with the herb-grilled patty is simply unmatched anywhere in India.", avatar: avatar1 },
  { id: 2, name: "Rajesh Malhotra", role: "CEO, Sterling Industries", text: "An atmosphere of pure luxury. The Imperial Prawn Tempura Roll melts in your mouth. A perfect venue for celebrating milestones and corporate events.", avatar: avatar2 },
  { id: 3, name: "Ananya Patel", role: "Food Blogger @ananya_eats", text: "The table-side online ordering is genius! Everything from the Butter Chicken to the Chicken Ramen was absolutely divine. 10/10.", avatar: avatar3 },
  { id: 4, name: "Vikram Singh", role: "Zomato Elite Reviewer", text: "Every detail, from the ambient lighting to the Truffle Mushroom Consommé, is carefully curated. The table-side ordering made it even better!", avatar: avatar4 },
  { id: 5, name: "Margaret D'Souza", role: "Culinary Journalist", text: "In my 30 years of reviewing restaurants, Jade & Gold stands out as a true gem. The Hyderabadi Biryani rivals any 5-star hotel's.", avatar: avatar5 },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="section" style={{ backgroundColor: 'var(--color-background-dark)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '3.5rem' }}>
          <span className="section-subtitle">What Our Guests Say</span>
          <h2 className="section-title">Words of Praise</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {testimonials.map(t => (
            <div key={t.id} style={{
              backgroundColor: 'var(--color-background-card)', padding: '1.75rem', borderRadius: '12px',
              borderLeft: '4px solid var(--color-accent)', boxShadow: '0 5px 20px rgba(0,0,0,0.2)', transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)'; }}
            >
              <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>
                {[...Array(5)].map((_, i) => <IconStar key={i} s={16} />)}
              </div>
              <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', marginBottom: '1.25rem', fontSize: '0.92rem', lineHeight: '1.7' }}>
                "{t.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src={t.avatar} alt={t.name} style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-accent)' }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{t.name}</h4>
                  <span style={{ color: 'var(--color-accent)', fontSize: '0.75rem' }}>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
