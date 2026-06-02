'use client';

import { motion } from 'framer-motion';
import { testimonials } from '@/data/site';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] as const } },
};

export default function TestimonialsSection() {
  return (
    <section className="section section-alt" id="testimonials">
      <div className="section-inner">
        <div className="sectionTitle">
          <h2>Ce que disent<br/>nos clients</h2>
          <p>La satisfaction de nos hôtes est notre plus belle récompense.</p>
          <div className="section-divider" />
        </div>

        <motion.div
          className="testimonials-grid"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          {testimonials.map((t) => (
            <motion.div className="testimonial-card" key={t.name} variants={item}>
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
