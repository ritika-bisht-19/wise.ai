import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function TestimonialSection() {
  const sectionRef = useScrollReveal();

  return (
    <section ref={sectionRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px]">
      <div className="bg-white p-6 md:p-16 border border-[#f0f0f0] rounded-[24px] md:rounded-[48px] reveal card-hover">
        <div className="flex flex-col gap-8 md:gap-12">
          {/* Logo */}
          <img src="/wise-logo.svg" alt="W.I.S.E." className="h-6 md:h-8 w-auto" />
          {/* Heading */}
          <h3 className="font-season-mix font-bold text-2xl md:text-[32px] leading-[135%] text-tx">Why We Built W.I.S.E.</h3>
          {/* Quote */}
          <blockquote className="text-xl md:text-[24px] font-matter leading-[165%] text-tx-secondary max-w-[800px]">
            &ldquo;Many students know the content but struggle with pressure during interviews. We built W.I.S.E. to simulate realistic interviews and provide feedback on both communication and stress patterns.&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  );
}
