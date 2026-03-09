import { securityBadges } from '@/models/home.data';
import { useScrollReveal } from '@/controllers/useScrollReveal';

export default function SecuritySection() {
  const sectionRef = useScrollReveal();

  return (
    <section ref={sectionRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px]">
      <div className="flex flex-col items-center gap-12 md:gap-16">
        <div className="flex flex-col items-center text-center gap-4 w-full max-w-[640px] reveal">
          <p className="font-matter font-medium text-tx-tertiary text-xs text-center uppercase tracking-[2px]">Privacy & Security</p>
          <h2 className="font-season-mix md:font-normal font-normal w-full px-3 md:px-0 text-3xl md:text-[36px] text-tx leading-[135%]">Your data stays yours. Privacy built in from day one.</h2>
        </div>
        <div className="flex md:flex-row flex-col justify-center items-center gap-6 md:gap-10 mx-auto w-full">
          {securityBadges.map((badge, idx) => (
            <div key={badge.title} className="flex flex-col items-center gap-4 group reveal" style={{ transitionDelay: `${150 + idx * 150}ms` }}>
              <div
                className="flex justify-center items-center rounded-full w-[160px] h-[160px] md:w-[200px] md:h-[200px] group-hover:scale-105 transition-transform duration-300"
                style={{
                  background: 'linear-gradient(180deg, #F0F3FA 0%, #E0E7FF 100%)',
                  boxShadow: 'inset 0 0 40px rgba(165,187,252,0.5), 0 4px 20px rgba(165,187,252,0.15)',
                }}
              >
                {badge.icon}
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-matter font-semibold text-tx text-[15px] md:text-[16px] tracking-[-0.16px]">{badge.title}</span>
                <span className="font-matter text-tx-tertiary text-[13px] md:text-[14px] tracking-[-0.14px]">{badge.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
