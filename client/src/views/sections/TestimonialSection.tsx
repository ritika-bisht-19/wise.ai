import { useScrollReveal } from '@/controllers/useScrollReveal';

export default function TestimonialSection() {
  const sectionRef = useScrollReveal();

  return (
    <section ref={sectionRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px]">
      <div className="bg-white p-6 md:p-16 border border-[#f0f0f0] rounded-[24px] md:rounded-[48px] reveal card-hover">
        <div className="flex flex-col gap-8 md:gap-12">
          {/* Logo */}
          <img src="/wise-logo.svg" alt="W.I.S.E." className="h-6 md:h-8 w-auto" />
          {/* Heading */}
          <h3 className="font-season-mix text-2xl md:text-[32px] leading-[135%] text-tx">What our users say</h3>
          {/* Quote */}
          <blockquote className="text-xl md:text-[24px] font-matter leading-[165%] text-tx-secondary max-w-[800px]">
            &ldquo;W.I.S.E. completely changed how I prepared for interviews. I went from freezing up to landing offers at three top companies. The real-time stress analytics helped me understand my anxiety triggers, and the personalised coaching gave me a clear roadmap to improve.&rdquo;
          </blockquote>
          {/* Author */}
          <div className="flex items-center gap-4">
            <img src="/assets/images/testimonial-profile.png" alt="Priya Sharma" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p className="font-matter font-semibold text-tx">Priya Sharma</p>
              <p className="font-matter text-sm text-tx-tertiary">Software Engineer at Google &middot; IIT Delhi &apos;23</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
