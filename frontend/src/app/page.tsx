'use client';

import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import ServicesSection from '@/components/ServicesSection';
import RoomsSection from '@/components/RoomsSection';
import RestaurantSection from '@/components/RestaurantSection';
import BarSection from '@/components/BarSection';
import GallerySection from '@/components/GallerySection';
import CTASection from '@/components/CTASection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <div className="morphing-bg" aria-hidden="true">
        <div className="morphing-shape" />
        <div className="morphing-shape" />
        <div className="morphing-shape" />
      </div>
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <RoomsSection />
      <RestaurantSection />
      <BarSection />
      <GallerySection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </>
  );
}
