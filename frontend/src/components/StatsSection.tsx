'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { stats } from '@/data/site';

function StatItem({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div className="stat" ref={ref}>
      <b style={{ opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)' }}>
        {value}
      </b>
      <span>{label}</span>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="section">
      <div className="section-inner">
        <div className="stats">
          {stats.map((s) => (
            <StatItem key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
