import React, { useEffect, useRef, useState } from 'react';
import { CreditCard, Zap, Smartphone, Gift, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

const FadeInSection: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setIsVisible(true); });
    }, { threshold: 0.1 });
    const current = domRef.current;
    if (current) observer.observe(current);
    return () => { if(current) observer.unobserve(current); }
  }, []);

  return (
    <div ref={domRef} className={`transition-all duration-1000 ease-[cubic-bezier(0.25,0.8,0.25,1)] transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const BFFPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream pt-32 pb-20 px-4 md:px-8 relative font-sans text-black overflow-x-hidden">
        
        {/* HEADER */}
        <div className="max-w-[1440px] mx-auto mb-16 md:mb-24 border-b border-black/10 pb-8 md:pb-12">
            <FadeInSection>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif leading-[0.8] tracking-tighter text-black">
                        Get More Value<span className="text-clay">.</span>
                    </h1>
                    <div className="text-left md:text-right mb-0 md:mb-4">
                        <p className="font-bold uppercase tracking-widest text-[10px] md:text-xs mb-1 md:mb-2 text-black/60">Fact</p>
                        <p className="font-serif italic text-lg md:text-xl text-black">Optimization &gt; Loyalty.</p>
                    </div>
                </div>
            </FadeInSection>
        </div>

        {/* REWARDS SECTION */}
        <section className="max-w-[1440px] mx-auto mb-20 md:mb-32">
             <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-black/10 bg-white shadow-xl">
                
                {/* Main Feature */}
                <div className="col-span-1 md:col-span-8 p-8 md:p-16 border-b md:border-b-0 md:border-r border-black/10 relative">
                    <span className="absolute top-6 left-6 md:top-8 md:left-8 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-clay">Why Compare?</span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mt-6 md:mt-8 mb-4 md:mb-6 leading-[0.9] text-black tracking-tight">
                        The Right Card Saves You <br/> 
                        <span className="italic font-light opacity-50">₹15,000.</span>
                    </h2>
                    <p className="text-sm md:text-lg font-sans font-light max-w-lg leading-relaxed text-black/80">
                        Most people lose money by using the wrong card. We make sure you always use the best one.
                    </p>
                    <div className="mt-8 md:mt-10 inline-block bg-black text-white px-5 py-2.5 md:px-6 md:py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-sm">
                        You Save: ₹15,000/yr
                    </div>
                </div>

                {/* Sidebar Features */}
                <div className="col-span-1 md:col-span-4 bg-[#F5F5F0]">
                    <div className="p-8 md:p-12 border-b border-black/10 flex flex-col justify-between hover:bg-clay hover:text-white transition-colors group min-h-[200px] md:h-1/2">
                        <Gift size={28} className="mb-4 text-black group-hover:text-white md:w-8 md:h-8" />
                        <div>
                            <h3 className="text-2xl md:text-3xl font-serif mb-2 text-black group-hover:text-white">Discount Vouchers</h3>
                            <p className="opacity-60 text-xs md:text-sm leading-relaxed text-black group-hover:text-white">Get up to 8% off brand vouchers. Use them with your card rewards.</p>
                        </div>
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-between hover:bg-black hover:text-white transition-colors group min-h-[200px] md:h-1/2">
                        <Sparkles size={28} className="mb-4 text-black group-hover:text-white md:w-8 md:h-8" />
                        <div>
                            <h3 className="text-2xl md:text-3xl font-serif mb-2 text-black group-hover:text-white">Smart AI</h3>
                            <p className="opacity-60 text-xs md:text-sm leading-relaxed text-black group-hover:text-white">Chat with our AI to find the perfect card for your spending.</p>
                        </div>
                    </div>
                </div>
             </div>
        </section>

        {/* PARTNER HEADER */}
        <div className="max-w-[1440px] mx-auto mb-12 border-t border-black/10 pt-20 text-center">
             <span className="inline-block px-4 py-1 border border-black/20 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 text-black/60">For Partners</span>
             <h2 className="text-3xl md:text-4xl font-serif leading-[0.9] text-black tracking-tight">Grow With Us.</h2>
        </div>

        {/* PARTNER GRID */}
        <section className="max-w-[1440px] mx-auto pb-16 md:pb-24">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                 <div className="bg-black text-white p-10 md:p-16 flex flex-col justify-between min-h-[300px] md:min-h-[400px]">
                     <div>
                         <h3 className="text-2xl md:text-3xl font-serif mb-4">Card API <br/><span className="text-[#00C48C]">Card API</span></h3>
                         <p className="text-white/50 text-lg md:text-xl max-w-sm">Add our card finder to your website.</p>
                     </div>
                     <div className="w-full h-px bg-white/20 mt-8 md:mt-12"></div>
                 </div>
                 
                 <div className="bg-white border border-black/10 p-10 md:p-16 flex flex-col justify-between min-h-[300px] md:min-h-[400px]">
                     <div>
                         <h3 className="text-2xl md:text-3xl font-serif mb-4 text-black">Debt Help <br/><span className="text-blue-600">Debt Help</span></h3>
                         <p className="text-black/50 text-lg md:text-xl max-w-sm">Help your users clear their debt.</p>
                     </div>
                     <div className="w-full h-px bg-black/10 mt-8 md:mt-12"></div>
                 </div>
             </div>
        </section>

    </div>
  );
};

export default BFFPage;