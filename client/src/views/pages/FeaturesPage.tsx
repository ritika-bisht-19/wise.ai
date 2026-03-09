import { Link } from 'react-router-dom';
import { featureCategories } from '@/models/features.data';
import { useScrollReveal } from '@/controllers/useScrollReveal';

export default function FeaturesPage() {
  const heroRef = useScrollReveal();

  return (
    <div className="flex flex-col gap-20 md:gap-28 pb-20 md:pb-28">
      {/* Hero */}
      <section ref={heroRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px] pt-12 md:pt-20">
        <div className="flex flex-col items-center text-center gap-6">
          <h1 className="text-4xl md:text-[56px] font-season-mix leading-[120%] text-tx max-w-[720px] reveal">
            Everything you need to ace your next interview
          </h1>
          <p className="text-lg md:text-xl text-[#666] font-matter max-w-[560px] leading-relaxed reveal" style={{ transitionDelay: '150ms' }}>
            From AI mock interviews to real-time stress tracking — W.I.S.E. covers every dimension of interview preparation.
          </p>
        </div>
      </section>

      {/* Feature groups */}
      {featureCategories.map((group) => {
        const groupRef = useScrollReveal();
        return (
        <section key={group.category} ref={groupRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px]">
          <h2 className="text-2xl md:text-[30px] font-season-mix text-tx mb-8 reveal">{group.category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {group.items.map((item, idx) => (
              <div key={item.title} className="p-8 rounded-[24px] border border-[#f0f0f0] bg-white hover:border-[#C7D2FE] card-hover reveal" style={{ transitionDelay: `${150 + idx * 100}ms` }}>
                <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3730A3" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-matter font-semibold text-lg text-tx mb-2">{item.title}</h3>
                <p className="font-matter text-base text-[#666] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
        );
      })}

      {/* CTA */}
      <section className="mx-auto w-[85%] md:w-9/12 max-w-[1280px]">
        <div className="flex flex-col items-center text-center gap-4">
          <h2 className="text-2xl md:text-[36px] font-season-mix text-tx">Ready to see it in action?</h2>
          <Link to="/pricing" className="px-8 py-3.5 rounded-full bg-[#131313] text-white font-season-mix font-medium text-base hover:bg-[#333] transition-colors">
            View Pricing
          </Link>
        </div>
      </section>
    </div>
  );
}
