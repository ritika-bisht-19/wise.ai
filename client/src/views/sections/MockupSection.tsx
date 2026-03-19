import { useScrollReveal } from '@/controllers/useScrollReveal';

export default function MockupSection() {
  const sectionRef = useScrollReveal();

  return (
    <section ref={sectionRef} className="mx-auto w-[95%] md:w-full max-w-[950px]">
      <div className="flex flex-col items-center gap-10 reveal">
        <div className="flex flex-col items-center text-center gap-3">
          <p className="font-season-mix text-2xl md:text-4xl font-medium leading-none text-[#1F2331]">
            Your AI interview coach.
          </p>
          <h2 className="font-season-mix font-bold w-full px-3 md:px-0 text-3xl md:text-[36px] text-tx leading-[135%]">
            Welcome to W.I.S.E
          </h2>
        </div>
        <div className="w-full flex items-center justify-center">
          <img
            src="/assets/images/mock.png"
            alt="W.I.S.E. interface mockup"
            loading="eager"
            decoding="async"
            className="w-full h-auto drop-shadow-[0_50px_80px_rgba(0,0,0,0.16)] rounded-[32px] md:rounded-[48px] transition-transform duration-500 hover:scale-[1.01]"
            style={{ imageRendering: 'crisp-edges' }}
          />
        </div>
      </div>
    </section>
  );
}
