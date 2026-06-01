'use client';

import { motion } from 'framer-motion';
import { gallery } from '@/data/site';

export default function GallerySection() {
  return (
    <section className="section" id="gallery">
      <div className="section-inner">
        <div className="sectionTitle">
          <h2>Galerie<br/>NIKA HOTEL</h2>
          <p>Découvrez notre établissement à travers ces visuels.</p>
          <div className="section-divider" />
        </div>

        <motion.div
          className="gallery"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.68, -0.55, 0.265, 1.55] as const }}
        >
          {gallery.map((img, i) => (
            <div
              key={i}
              className={i === 0 ? 'galleryItem big' : 'galleryItem'}
              style={{ backgroundImage: `url(${img.image})` }}
            >
              <span className="gallery-label">{img.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
