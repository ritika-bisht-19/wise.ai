import { useDemoTabs } from '@/controllers/useDemoTabs';
import { useScrollReveal } from '@/controllers/useScrollReveal';
import { demoTabs } from '@/models/home.data';

export default function DemoSection() {
  const { activeTab, setActiveTab, content } = useDemoTabs();
  const sectionRef = useScrollReveal();

  return (
    <section ref={sectionRef} className="relative w-full overflow-x-clip">
      {/* Background blur layer */}
      <div className="right-0 bottom-[15%] left-0 absolute blur-[80px] h-2/5 overflow-hidden pointer-events-none" style={{ transform: 'scaleX(2.5) scaleY(1.2)', background: 'linear-gradient(180deg, #C7D2FE 0%, #A5B4FC 30%, #818CF8 50%, #A5B4FC 70%, #C7D2FE 100%)' }} />
      <div className="relative flex flex-col items-center gap-8 md:gap-12 mx-auto w-[85%] md:w-9/12 max-w-[1280px]">
        <div className="flex flex-col items-center text-center gap-6 w-full reveal">
          <h2 className="font-season-mix md:font-normal font-normal w-full px-3 md:px-0 text-3xl md:text-[36px] text-tx leading-[135%]">See W.I.S.E. in Action</h2>
        </div>
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 reveal" style={{ transitionDelay: '100ms' }}>
          {demoTabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 md:px-6 py-2.5 rounded-full text-sm font-matter font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${activeTab === tab.key ? 'bg-sr-indigo-50 text-sr-indigo-800 border border-sr-indigo-100 shadow-sm' : 'bg-white text-[#666] border border-[#f0f0f0] hover:bg-[#f5f5f5]'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        {/* Demo Card */}
        <div className="bg-white border border-st-secondary rounded-[32px] md:rounded-[40px] w-full h-[550px] overflow-hidden relative reveal-scale" style={{ transitionDelay: '200ms' }}>
          <div className="px-6 md:px-10 py-6 md:py-8 border-b border-[#f0f0f0] flex items-center justify-between">
            <h3 className="font-matter font-medium text-lg md:text-[22px] text-tx">{content.title}</h3>
            <span className="flex items-center gap-2 text-sm font-matter text-[#666]">
              <span className="rounded-full w-2 h-2 bg-green-500" />LIVE
            </span>
          </div>
          <div className="p-6 md:p-12 flex flex-col items-center justify-center flex-1">
            <p className="font-matter text-base text-[#666] mb-8 text-center">{content.description}</p>
            {/* Decorative motif illustrations */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <img src="/assets/images/decorative-motif-01.svg" alt="" className="w-24 md:w-32 h-auto opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-500" />
              <img src="/assets/images/decorative-motif-02.svg" alt="" className="w-24 md:w-32 h-auto opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-500" />
              <img src="/assets/images/decorative-motif-03.svg" alt="" className="w-24 md:w-32 h-auto opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-500" />
            </div>
            {/* Glassmorphism Begin Interview button */}
            <button className="relative px-8 py-3.5 rounded-full font-season-mix font-medium text-base md:text-lg btn-glow" style={{ backdropFilter: 'blur(20px) saturate(1.2) contrast(1.05) brightness(1.02)', background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 100%)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.05)' }}>
              Begin Interview
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
