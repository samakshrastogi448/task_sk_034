import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const photos = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=85',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1400&q=85'
];

function App() {
  const root = useRef(null);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from('.hero-copy > *', { y: 32, opacity: 0, duration: .85, stagger: .11, ease: 'power3.out' });
      gsap.utils.toArray('.reveal').forEach((el) => gsap.from(el, {
        y: 40, opacity: 0, duration: .8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 82%', once: true }
      }));
      const rail = document.querySelector('.signal-rail');
      if (rail && window.innerWidth > 900) {
        gsap.to(rail, {
          x: () => -(rail.scrollWidth - window.innerWidth + 96),
          ease: 'none',
          scrollTrigger: { trigger: '.rail-shell', start: 'top top', end: () => `+=${rail.scrollWidth}`, scrub: 1, pin: true, invalidateOnRefresh: true }
        });
      }
      gsap.to('.moon-disc', { yPercent: -22, scrollTrigger: { trigger: '.interlude', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    }, root);
    return () => ctx.revert();
  }, []);

  return <main ref={root}>
    <section className="hero">
      <img src={photos[0]} alt="Indian wedding couple photographed under warm evening lights" />
      <div className="veil" />
      <div className="hero-copy">
        <p className="eyebrow">PROJECT 034 · WEDDING NIGHT EDITORIAL</p>
        <h1>Jasmine<br/>Voltage</h1>
        <p className="lede">White flowers, electric blue night and brass light turn the celebration into a photographic current.</p>
        <a className="cta" href="#story">Follow the signal ↓</a>
      </div>
    </section>

    <section id="story" className="intro reveal">
      <p className="eyebrow">01 · FIRST CURRENT</p>
      <h2>The night begins in jasmine white.</h2>
      <p>Soft floral detail and deep cobalt shadow create a quiet opening before the frames accelerate into music, portraits and warm ceremonial light.</p>
    </section>

    <section className="split reveal">
      <img src={photos[1]} alt="Bride and groom in an evening wedding portrait" />
      <div>
        <span>02 · PORTRAIT FREQUENCY</span>
        <h2>Stillness inside the celebration.</h2>
        <p>Editorial spacing and full-height portraiture slow the sequence down, letting skin tones and fabric detail sit against the dark blue field.</p>
      </div>
    </section>

    <section className="rail-shell">
      <div className="rail-head reveal"><p className="eyebrow">03 · SIGNAL STRIP</p><h2>Four frames crossing one night.</h2></div>
      <div className="signal-rail">
        {photos.slice(1).map((src, i) => <figure key={src}><img src={src} alt={`Wedding night editorial frame ${i + 1}`} /><figcaption>FREQUENCY {String(i + 1).padStart(2,'0')}</figcaption></figure>)}
      </div>
    </section>

    <section className="interlude reveal">
      <div className="moon-disc" aria-hidden="true" />
      <p className="eyebrow">04 · BLUE HOUR CHARGE</p>
      <blockquote>“Some celebrations glow. Others stay in the air like electricity.”</blockquote>
    </section>

    <section className="mosaic reveal">
      <img src={photos[2]} alt="Wedding ceremony detail in warm light" />
      <img src={photos[3]} alt="Wedding celebration with family and friends" />
      <img src={photos[4]} alt="Bride and groom during the evening celebration" />
      <div className="note"><span>05 · AFTER SIGNAL</span><h2>The last frames soften into brass.</h2><p>The closing movement trades cobalt intensity for intimate warm photographs, preserving the feeling of the night without crowding the page.</p></div>
    </section>

    <footer><p>JASMINE VOLTAGE</p><p>Photography-led Indian wedding editorial · 2026</p></footer>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
