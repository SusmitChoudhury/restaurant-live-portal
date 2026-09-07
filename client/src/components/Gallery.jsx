import { useState } from 'react';

import heroImg from '../assets/images/premium_hero_1781771597010.png';
import barImg from '../assets/images/restaurant_bar_1781774433025.png';
import diningImg from '../assets/images/restaurant_dining_1781774446073.png';
import sushiImg from '../assets/images/premium_sushi_1781771610958.png';
import burgerImg from '../assets/images/premium_burger_1781771634417.png';
import pizzaImg from '../assets/images/premium_pizza_1781771645444.png';
import dessertImg from '../assets/images/premium_dessert_1781774458841.png';
import cocktailImg from '../assets/images/premium_cocktail_1781774485171.png';

const galleryImages = [
  { src: heroImg, alt: 'Restaurant Ambiance' },
  { src: barImg, alt: 'Premium Bar Area' },
  { src: diningImg, alt: 'Fine Dining Hall' },
  { src: sushiImg, alt: 'Imperial Prawn Tempura Roll' },
  { src: burgerImg, alt: 'The Jade Burger' },
  { src: pizzaImg, alt: 'Neapolitan Pizza' },
  { src: dessertImg, alt: 'Chocolate Lava Cake' },
  { src: cocktailImg, alt: 'Signature Cocktails' },
];

const Gallery = () => {
  const [lightbox, setLightbox] = useState(null);

  return (
    <section id="gallery" className="section" style={{ backgroundColor: 'var(--color-primary)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '3.5rem' }}>
          <span className="section-subtitle">Visual Journey</span>
          <h2 className="section-title">Our Gallery</h2>
          <p style={{ marginTop: '1.5rem', color: 'var(--color-text-muted)', maxWidth: '550px', margin: '1.5rem auto 0' }}>
            A glimpse into the world of Jade & Gold — from our kitchen to your table.
          </p>
        </div>

        <div className="gallery-grid">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              style={{
                overflow: 'hidden',
                borderRadius: '10px',
                cursor: 'pointer',
                position: 'relative',
                gridColumn: i === 0 ? 'span 2' : i === 3 ? 'span 2' : 'span 1',
                gridRow: i === 0 ? 'span 2' : 'span 1',
              }}
              onClick={() => setLightbox(img)}
            >
              <img
                src={img.src}
                alt={img.alt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease, filter 0.5s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.filter = 'brightness(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '1rem',
                opacity: 0,
                transition: 'opacity 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
              >
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{img.alt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox.src} alt={lightbox.alt} />
        </div>
      )}
    </section>
  );
};

export default Gallery;
