import { useStackLayers } from '@/controllers/useStackLayers';
import { useScrollReveal } from '@/controllers/useScrollReveal';
import { layers } from '@/models/home.data';

export default function StackLayersSection() {
  const { active, setActive } = useStackLayers();
  const sectionRef = useScrollReveal();

  return (
    <section ref={sectionRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px]">
      <div className="flex flex-col items-center gap-12 md:gap-16">
        <div className="flex flex-col items-center gap-4 reveal">
          <p className="font-matter font-medium text-tx-tertiary text-xs text-center uppercase tracking-[2px]">For Students | Job Seekers | Career Changers</p>
          <div className="flex flex-col items-center text-center gap-6 w-full">
            <h2 className="font-season-mix md:font-normal font-normal w-full px-3 md:px-0 text-3xl md:text-[36px] text-tx leading-[135%]">Your complete interview preparation toolkit</h2>
          </div>
        </div>
        <div className="flex md:flex-row flex-col items-stretch w-full reveal-scale" style={{ transitionDelay: '200ms' }}>
          {/* Glass card area */}
          <div className="relative border border-st rounded-[48px] w-full md:w-1/2 h-[320px] md:h-[480px] overflow-hidden">
            {/* Rich gradient background */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #C7D2FE 40%, #A5B4FC 70%, #E0E7FF 100%)' }} />
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle, #3730A3 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="absolute inset-0 flex justify-center items-center" style={{ perspective: '1200px' }}>
              <div style={{ position: 'relative', width: '200px', height: '200px', marginTop: '-120px' }}>
              {layers.map((layer, i) => {
                const isActive = active === i;
                const offset = i - active;
                return (
                  <div
                    key={i}
                    className="absolute inset-0 transition-all duration-700 ease-out cursor-pointer"
                    style={{
                      willChange: 'transform, opacity',
                      opacity: isActive ? 1 : 0.8,
                      transform: isActive
                        ? 'rotateX(52deg) rotateZ(-45deg) translateZ(0px) scale(1)'
                        : `rotateX(52deg) rotateZ(-45deg) translateZ(${offset * -90}px) scale(${1 - Math.abs(offset) * 0.03})`,
                      zIndex: isActive ? 10 : 5 - Math.abs(offset),
                    }}
                    onClick={() => setActive(i)}
                  >
                    <div
                      style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '22px',
                        background: isActive
                          ? 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.75) 100%)'
                          : 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.35) 100%)',
                        backdropFilter: 'blur(20px) saturate(1.6)',
                        WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
                        border: isActive ? '1.5px solid rgba(255,255,255,0.85)' : '1px solid rgba(255,255,255,0.5)',
                        boxShadow: isActive
                          ? 'inset 0 1px 0 rgba(255,255,255,0.6), 0 8px 32px rgba(55,48,163,0.15)'
                          : 'inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 12px rgba(55,48,163,0.06)',
                        transformStyle: 'preserve-3d' as const,
                        display: 'flex',
                        flexDirection: 'column' as const,
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                      }}
                    >
                      <div
                        style={{
                          width: isActive ? '48px' : '40px',
                          height: isActive ? '48px' : '40px',
                          borderRadius: '12px',
                          background: isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.6)',
                          border: '1px solid rgba(255,255,255,0.9)',
                          boxShadow: '0 2px 8px rgba(55,48,163,0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.5s ease',
                        }}
                      >
                        <div style={{ transform: isActive ? 'scale(1)' : 'scale(0.8)', transition: 'transform 0.5s ease' }}>
                          {layer.cardIcon}
                        </div>
                      </div>
                      <span
                        className="font-matter font-semibold text-center uppercase"
                        style={{
                          fontSize: isActive ? '11px' : '9px',
                          letterSpacing: '0.5px',
                          color: isActive ? '#3730A3' : '#4F46E5',
                          transition: 'all 0.5s ease',
                        }}
                      >{layer.cardLabel}</span>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          </div>
          {/* Text content */}
          <div className="relative w-full md:w-1/2 min-h-[280px] md:min-h-0">
            {layers.map((layer, i) => (
              <div
                key={layer.title}
                className="absolute inset-0 flex flex-col gap-8 px-6 md:px-20 py-8 md:py-16 justify-center transition-opacity duration-500"
                style={{ opacity: active === i ? 1 : 0, pointerEvents: active === i ? 'auto' : 'none' }}
              >
                <div className="flex flex-col gap-3 md:gap-4">
                  <h3 className="font-matter font-medium text-tx md:text-[26px] text-xl leading-tight tracking-[-0.26px]">{layer.title}</h3>
                  <p className="max-w-[480px] font-matter text-tx-tertiary md:text-[18px] text-base leading-[1.55] tracking-[-0.18px]">{layer.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {layer.pills.map((pill) => (
                    <span key={pill} className="inline-flex items-center bg-sr-indigo-50 px-3 md:px-5 py-2 md:py-2.5 border border-sr-indigo-100 rounded-full font-matter text-tx-secondary md:text-[18px] text-sm tracking-[-0.18px]">{pill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Nav dots */}
        <div className="flex gap-2">
          {layers.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} className={`w-3 h-3 rounded-full transition-colors ${active === i ? 'bg-[#3730A3]' : 'bg-[#e6e6e6] hover:bg-[#ccc]'}`} aria-label={`Layer ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
