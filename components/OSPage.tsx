import React, { useState, useEffect, useRef } from 'react';
import HomeCarousel, { HomeCarouselHandle } from './HomeCarousel';
import { OSFeature } from '../types';

const userFeatures: OSFeature[] = [
    { id: 'u1', name: 'Yureka AI', issuer: 'Core Tech', rewardsRate: 'Instant Match', projectedSavings: '₹15k/yr', features: ['Chat to match', 'Checks 200+ cards', 'Honest suggestions'], category: 'AI', annualFee: 'Free', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800', bestFor: 'Everyone' },
    { id: 'u2', name: 'Yureka+', issuer: 'Extension', rewardsRate: 'Better Checkout', projectedSavings: '₹5k/yr', features: ['Browser extension', 'Card suggestions', 'Best rewards auto-applied'], category: 'Utility', annualFee: 'Free', image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800', bestFor: 'Shoppers' },
    { id: 'u3', name: 'Voucher Hub', issuer: 'Savings', rewardsRate: '8% Off', projectedSavings: '₹10k/yr', features: ['Discount vouchers', 'Combine with rewards', 'Instant delivery'], category: 'Rewards', annualFee: 'Free', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800', bestFor: 'Deal Hunters' },
];

const partnerFeatures: OSFeature[] = [
    { id: 'p1', name: 'NPA Settlement', issuer: 'Relief', rewardsRate: 'Clear Debt', projectedSavings: 'Variable', features: ['Negotiated settlements', 'Clear debt fast', 'Improve credit score'], category: 'Finance', annualFee: 'Free', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800', bestFor: 'Debt Relief' },
    { id: 'p2', name: 'Bill Pay', issuer: 'Payments', rewardsRate: '1% Back', projectedSavings: '₹2k/yr', features: ['Manage all bills', 'Pay card bills', 'Auto reminders'], category: 'Utility', annualFee: 'Free', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800', bestFor: 'Utility' },
    { id: 'p3', name: 'VIP Access', issuer: 'Elite', rewardsRate: 'VIP', projectedSavings: 'Priceless', features: ['Early access', 'Exclusive offers', 'VIP support'], category: 'Premium', annualFee: 'Free', image: 'https://images.unsplash.com/photo-1512351735139-ce01f731c7e6?auto=format&fit=crop&q=80&w=800', bestFor: 'Early Adopters' },
];

const ecosystemFeatures: OSFeature[] = [
    { id: 'e1', name: 'Card API', issuer: 'Devs', rewardsRate: 'Easy', projectedSavings: 'N/A', features: ['Add card matching', 'Live reward data', 'Secure setup'], category: 'API', annualFee: 'Free', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800', bestFor: 'Developers' },
    { id: 'e2', name: 'Insights', issuer: 'Data', rewardsRate: 'Detailed', projectedSavings: 'N/A', features: ['Spending analysis', 'Tips to save', 'Market reports'], category: 'Data', annualFee: 'Free', image: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800', bestFor: 'Analysts' },
    { id: 'e3', name: 'Security+', issuer: 'Trust', rewardsRate: 'Secure', projectedSavings: 'N/A', features: ['Bank-level security', 'Private data', 'Face/Touch ID'], category: 'Security', annualFee: 'Free', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800', bestFor: 'Privacy' },
];

const SecondaryNavbar = ({ activeSection, scrollTo }: { activeSection: string, scrollTo: (section: string) => void }) => {
  return (
    <div 
        className={`fixed bottom-16 sm:bottom-12 left-0 right-0 z-[85] flex justify-center pointer-events-none px-4`}
    >
        <div className={`pointer-events-auto glass-panel rounded-full p-1.5 sm:p-2 flex items-center gap-1 shadow-2xl overflow-x-auto no-scrollbar max-w-full`}>
            {['users', 'partners', 'ecosystem'].map((sec) => (
                <button 
                    key={sec}
                    onClick={() => scrollTo(sec)} 
                    className={`
                        px-4 sm:px-6 py-2 sm:py-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-full whitespace-nowrap
                        ${activeSection === sec ? 'bg-ink text-white shadow-lg' : 'bg-transparent text-ink/40 hover:text-ink hover:bg-white/50'}
                    `}
                >
                    {sec}
                </button>
            ))}
        </div>
    </div>
  );
};

const OSPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState('users');
  
  const userContainerRef = useRef<HTMLDivElement>(null);
  const partnerContainerRef = useRef<HTMLDivElement>(null);
  const ecosystemContainerRef = useRef<HTMLDivElement>(null);
  const userCarouselRef = useRef<HomeCarouselHandle>(null);
  const partnerCarouselRef = useRef<HomeCarouselHandle>(null);
  const ecosystemCarouselRef = useRef<HomeCarouselHandle>(null);

  const T = {
      L_SCROLL_END: 0.35,
      T_ENTER_START: 0.28, T_ENTER_END: 0.40, T_SCROLL_START: 0.40, T_SCROLL_END: 0.65,
      B_ENTER_START: 0.60, B_ENTER_END: 0.72, B_SCROLL_START: 0.72, B_SCROLL_END: 1.0
  };

  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
        if (!containerRef.current) return;
        
        const top = containerRef.current.offsetTop;
        const height = containerRef.current.offsetHeight;
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        let p = (scrollY - top) / (height - windowHeight);
        p = Math.max(0, Math.min(1, p));
        
        rafId = requestAnimationFrame(() => {
            let currentSection = 'users';
            if (p >= T.T_ENTER_START && p < T.B_ENTER_START) currentSection = 'partners';
            else if (p >= T.B_ENTER_START) currentSection = 'ecosystem';
            setActiveSection(currentSection);

            const lProgress = Math.min(1, p / T.L_SCROLL_END);
            userCarouselRef.current?.setProgress(lProgress);

            let tTransX = 100;
            let tProgress = 0;
            if (p >= T.T_ENTER_START) {
                if (p <= T.T_ENTER_END) {
                    const enterP = (p - T.T_ENTER_START) / (T.T_ENTER_END - T.T_ENTER_START);
                    tTransX = 100 * (1 - easeOutCubic(enterP));
                } else tTransX = 0;
                
                if (p >= T.T_SCROLL_START) {
                   const scrollP = (p - T.T_SCROLL_START) / (T.T_SCROLL_END - T.T_SCROLL_START);
                   tProgress = Math.min(1, Math.max(0, scrollP));
                }
            }
            if (partnerContainerRef.current) partnerContainerRef.current.style.transform = `translate3d(${tTransX}%, 0, 0)`;
            partnerCarouselRef.current?.setProgress(tProgress);

            let bTransX = 100;
            let bProgress = 0;
            if (p >= T.B_ENTER_START) {
                if (p <= T.B_ENTER_END) {
                    const enterP = (p - T.B_ENTER_START) / (T.B_ENTER_END - T.B_ENTER_START);
                    bTransX = 100 * (1 - easeOutCubic(enterP));
                } else bTransX = 0;

                if (p >= T.B_SCROLL_START) {
                   const scrollP = (p - T.B_SCROLL_START) / (T.B_SCROLL_END - T.B_SCROLL_START);
                   bProgress = Math.min(1, Math.max(0, scrollP));
                }
            }
            if (ecosystemContainerRef.current) ecosystemContainerRef.current.style.transform = `translate3d(${bTransX}%, 0, 0)`;
            ecosystemCarouselRef.current?.setProgress(bProgress);
        });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 
    return () => { window.removeEventListener('scroll', handleScroll); cancelAnimationFrame(rafId); };
  }, []);

  const scrollToSection = (section: string) => {
      if (!containerRef.current) return;
      const trackLength = containerRef.current.offsetHeight - window.innerHeight;
      let targetProgress = 0;
      if (section === 'users') targetProgress = 0;
      if (section === 'partners') targetProgress = T.T_SCROLL_START + 0.01; 
      if (section === 'ecosystem') targetProgress = T.B_SCROLL_START + 0.01;
      window.scrollTo({ top: containerRef.current.offsetTop + (trackLength * targetProgress), behavior: 'smooth' });
  };

  return (
    <>
      <SecondaryNavbar activeSection={activeSection} scrollTo={scrollToSection} />
      <div ref={containerRef} className="relative w-full h-[350vh] bg-cream block">
          <div className="sticky top-0 w-full h-screen overflow-hidden bg-cream">
             
             <div ref={userContainerRef} className="absolute inset-0 w-full h-full flex items-center justify-center p-2 md:p-8 lg:p-12 will-change-transform bg-cream" style={{ zIndex: 10 }}>
                 <HomeCarousel ref={userCarouselRef} id="users" cards={userFeatures} title="Smart AI" subtitle="We scan 200+ cards to find the one that matches your spending." controlled={true} />
             </div>

             <div ref={partnerContainerRef} className="absolute inset-0 w-full h-full flex items-center justify-center p-2 md:p-8 lg:p-12 will-change-transform bg-[#F0F0F0]" style={{ zIndex: 20, transform: 'translate3d(100%, 0, 0)' }}>
                 <HomeCarousel ref={partnerCarouselRef} id="partners" cards={partnerFeatures} title="For Partners" subtitle="Tools to help manage debt and pay bills easily." controlled={true} />
             </div>

             <div ref={ecosystemContainerRef} className="absolute inset-0 w-full h-full flex items-center justify-center p-2 md:p-8 lg:p-12 will-change-transform bg-[#E5E5E5]" style={{ zIndex: 30, transform: 'translate3d(100%, 0, 0)' }}>
                 <HomeCarousel ref={ecosystemCarouselRef} id="ecosystem" cards={ecosystemFeatures} title="More Features" subtitle="Data and tools for better financial decisions." controlled={true} />
             </div>

          </div>
      </div>
    </>
  );
};

export default OSPage;