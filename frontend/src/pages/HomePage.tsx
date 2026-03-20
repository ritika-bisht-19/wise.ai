import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import HeroSection from '@/components/HeroSection';
import MockupSection from '@/components/MockupSection';
import WhyWiseSection from '@/components/WhyWiseSection';
import InterviewSupportSection from '@/components/InterviewSupportSection';
import StackLayersSection from '@/components/StackLayersSection';
import DemoSection from '@/components/DemoSection';
import SecuritySection from '@/components/SecuritySection';
import TestimonialSection from '@/components/TestimonialSection';
import BlogSection from '@/components/BlogSection';
import FinalCTASection from '@/components/FinalCTASection';

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
