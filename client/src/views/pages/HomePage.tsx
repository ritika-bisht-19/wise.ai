import HeroSection from '@/views/sections/HeroSection';
import WhyWiseSection from '@/views/sections/WhyWiseSection';
import StackLayersSection from '@/views/sections/StackLayersSection';
import DemoSection from '@/views/sections/DemoSection';
import SecuritySection from '@/views/sections/SecuritySection';
import PricingSection from '@/views/sections/PricingSection';
import TestimonialSection from '@/views/sections/TestimonialSection';
import BlogSection from '@/views/sections/BlogSection';
import FinalCTASection from '@/views/sections/FinalCTASection';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-20 md:gap-28 pb-20 md:pb-28">
      <HeroSection />
      <WhyWiseSection />
      <StackLayersSection />
      <DemoSection />
      <SecuritySection />
      <PricingSection />
      <TestimonialSection />
      <BlogSection />
      <FinalCTASection />
    </div>
  );
}
