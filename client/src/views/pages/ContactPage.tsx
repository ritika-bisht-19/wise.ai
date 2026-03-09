import { useContactForm } from '@/controllers/useContactForm';
import { useScrollReveal } from '@/controllers/useScrollReveal';

export default function ContactPage() {
  const { submitted, handleSubmit } = useContactForm();
  const heroRef = useScrollReveal();
  const formRef = useScrollReveal();

  return (
    <div className="flex flex-col gap-20 md:gap-28 pb-20 md:pb-28">
      {/* Hero */}
      <section ref={heroRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px] pt-12 md:pt-20">
        <div className="flex flex-col items-center text-center gap-4">
          <h1 className="text-4xl md:text-[56px] font-season-mix leading-[120%] text-tx reveal">
            Get in touch
          </h1>
          <p className="text-lg text-[#666] font-matter max-w-[480px] reveal" style={{ transitionDelay: '150ms' }}>
            Have a question, partnership idea, or just want to say hello? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section ref={formRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px]">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white border border-[#f0f0f0] rounded-[28px] p-8 reveal-left">
            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                <div className="w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-matter font-semibold text-xl text-tx">Message sent!</h3>
                <p className="font-matter text-base text-[#666] text-center">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="font-matter text-sm font-medium text-tx">Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="px-4 py-3 rounded-xl border border-[#e6e6e6] bg-[#fafafa] font-matter text-base text-tx placeholder:text-[#999] focus:outline-none focus:border-[#C7D2FE] transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="font-matter text-sm font-medium text-tx">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="px-4 py-3 rounded-xl border border-[#e6e6e6] bg-[#fafafa] font-matter text-base text-tx placeholder:text-[#999] focus:outline-none focus:border-[#C7D2FE] transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="font-matter text-sm font-medium text-tx">Subject</label>
                  <select
                    id="subject"
                    required
                    className="px-4 py-3 rounded-xl border border-[#e6e6e6] bg-[#fafafa] font-matter text-base text-tx focus:outline-none focus:border-[#C7D2FE] transition-colors"
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="sales">Sales & Pricing</option>
                    <option value="campus">Campus Partnership</option>
                    <option value="support">Technical Support</option>
                    <option value="careers">Careers</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="font-matter text-sm font-medium text-tx">Message</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    className="px-4 py-3 rounded-xl border border-[#e6e6e6] bg-[#fafafa] font-matter text-base text-tx placeholder:text-[#999] focus:outline-none focus:border-[#C7D2FE] transition-colors resize-none"
                    placeholder="Tell us more..."
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 w-full py-3.5 rounded-full bg-[#131313] text-white font-season-mix font-medium text-base hover:bg-[#333] btn-glow transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-8 reveal" style={{ transitionDelay: '200ms' }}>
            <div>
              <h3 className="font-matter font-semibold text-lg text-tx mb-2">Email</h3>
              <p className="font-matter text-base text-[#666]">hello@wise-interview.com</p>
            </div>
            <div>
              <h3 className="font-matter font-semibold text-lg text-tx mb-2">Office</h3>
              <p className="font-matter text-base text-[#666]">Bangalore, India</p>
              <p className="font-matter text-sm text-[#999] mt-1">Remote-first team across India, US & Singapore</p>
            </div>
            <div>
              <h3 className="font-matter font-semibold text-lg text-tx mb-2">Social</h3>
              <div className="flex gap-4">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="font-matter text-sm text-[#3730A3] hover:underline">Twitter</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="font-matter text-sm text-[#3730A3] hover:underline">LinkedIn</a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="font-matter text-sm text-[#3730A3] hover:underline">GitHub</a>
              </div>
            </div>
            <div className="p-6 rounded-[20px] bg-[#EEF2FF] border border-[#C7D2FE]">
              <h3 className="font-matter font-semibold text-base text-[#3730A3] mb-1">Campus Partnership</h3>
              <p className="font-matter text-sm text-[#666]">
                Interested in bringing W.I.S.E. to your university?
                We offer custom plans for career centres and placement cells.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
