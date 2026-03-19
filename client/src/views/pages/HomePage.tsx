import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import HeroSection from '@/views/sections/HeroSection';
import MockupSection from '@/views/sections/MockupSection';
import WhyWiseSection from '@/views/sections/WhyWiseSection';
import InterviewSupportSection from '@/views/sections/InterviewSupportSection';
import StackLayersSection from '@/views/sections/StackLayersSection';
import DemoSection from '@/views/sections/DemoSection';
import SecuritySection from '@/views/sections/SecuritySection';
import TestimonialSection from '@/views/sections/TestimonialSection';
import BlogSection from '@/views/sections/BlogSection';
import FinalCTASection from '@/views/sections/FinalCTASection';

export default function HomePage() {
  const trackerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const pointerFine = window.matchMedia('(pointer: fine)');
    if (!pointerFine.matches) return;

    const handleMove = (event: MouseEvent) => {
      gsap.to('.cursor', {
        x: event.clientX,
        y: event.clientY,
        stagger: 0.05,
      });
      if (trackerRef.current) trackerRef.current.style.opacity = '1';
    };

    window.addEventListener('mousemove', handleMove);

    return () => {
      window.removeEventListener('mousemove', handleMove);
    };
  }, []);

  return (
    <>
      <div ref={trackerRef} aria-hidden="true" className="cursor-layer" style={{ opacity: 0 }}>
        <div className="cursor cursor1" />
        <div className="cursor cursor2" />
      </div>

      <div className="flex flex-col gap-20 md:gap-28 pb-20 md:pb-28">
        <HeroSection />
        <MockupSection />
        <WhyWiseSection />
        <InterviewSupportSection />
        <StackLayersSection />
        <DemoSection />
        <SecuritySection />
        <TestimonialSection />
        <BlogSection />
        <FinalCTASection />
      </div>
    </>
  );
}
