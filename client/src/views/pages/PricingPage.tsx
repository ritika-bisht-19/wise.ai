import { Link } from 'react-router-dom';
import PricingSection from '@/views/sections/PricingSection';
import { faqs } from '@/models/pricing.data';
import { useScrollReveal } from '@/controllers/useScrollReveal';

export default function PricingPage() {
  const heroRef = useScrollReveal();
  const faqRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  return (
    <div className="flex flex-col gap-20 md:gap-28 pb-20 md:pb-28">
      {/* Hero */}
      <section ref={heroRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px] pt-12 md:pt-20">
        <div className="flex flex-col items-center text-center gap-4">
          <h1 className="text-4xl md:text-[56px] font-season-mix leading-[120%] text-tx reveal">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-[#666] font-matter max-w-[480px] reveal" style={{ transitionDelay: '150ms' }}>
            Start free, upgrade when you need more. Every plan includes core AI features.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <PricingSection />

      {/* FAQ */}
      <section ref={faqRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px]">
        <h2 className="text-2xl md:text-[36px] font-season-mix text-tx text-center mb-10 reveal">Frequently Asked Questions</h2>
        <div className="max-w-[680px] mx-auto flex flex-col gap-4">
          {faqs.map((f, idx) => (
            <details key={f.q} className="group rounded-2xl border border-[#f0f0f0] bg-white overflow-hidden card-hover reveal" style={{ transitionDelay: `${idx * 80}ms` }}>
              <summary className="px-6 py-5 font-matter font-medium text-base text-tx cursor-pointer list-none flex items-center justify-between">
                {f.q}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" className="shrink-0 transition-transform group-open:rotate-180">
                  <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <div className="px-6 pb-5">
                <p className="font-matter text-base text-[#666] leading-relaxed">{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px]">
        <div className="flex flex-col items-center text-center gap-4 reveal">
          <p className="font-matter text-base text-[#666]">Still have questions?</p>
          <Link to="/contact" className="px-8 py-3 rounded-full border border-[#e6e6e6] text-tx font-matter font-medium text-base hover:bg-[#f5f5f5] transition-colors">
            Contact Sales
          </Link>
        </div>
      </section>
    </div>
  );
}
