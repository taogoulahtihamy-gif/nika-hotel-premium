'use client';

import { motion } from 'framer-motion';
import { services } from '@/data/site';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] as const } },
};

export default function ServicesSection() {
  return (
    <section className="section" id="services">
      <div className="section-inner">
        <div className="sectionTitle">
          <h2>Nos Services<br/>Premium</h2>
          <p>Une expérience complète pour votre séjour à Bujumbura.</p>
          <div className="section-divider" />
        </div>

        <motion.div
          className="cards"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          {services.map((s) => (
            <motion.div className="service" key={s.title} variants={item}>
              <div style={{ fontSize: 40, marginBottom: 16, lineHeight: 1 }}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {s.features.map((f) => (
                  <li key={f} style={{ fontSize: '0.82rem', color: 'var(--muted)', padding: '4px 14px', borderRadius: 50, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
