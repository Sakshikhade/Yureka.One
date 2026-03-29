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
        <div className="max-w-[1440px] mx-auto mb-24 border-b border-black/10 pb-12">
            <FadeInSection>
                <div className="flex justify-between items-end">
                    <h1 className="text-5xl md:text-7xl font-serif leading-[0.8] tracking-tighter text-black">
                        Get More Value<span className="text-clay">.</span>
                    </h1>
                    <div className="hidden md:block text-right mb-4">
                        <p className="font-bold uppercase tracking-widest text-xs mb-2 text-black/60">Fact</p>
                        <p className="font-serif italic text-xl text-black">Optimization &gt; Loyalty.</p>
                    </div>
                </div>
            </FadeInSection>
        </div>

        {/* REWARDS SECTION */}
        <section className="max-w-[1440px] mx-auto mb-32">
             <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-black/10 bg-white shadow-xl">
                
                {/* Main Feature */}
                <div className="col-span-1 md:col-span-8 p-10 md:p-16 border-b md:border-b-0 md:border-r border-black/10 relative">
                    <span className="absolute top-8 left-8 text-xs font-bold uppercase tracking-[0.3em] text-clay">Why Compare?</span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mt-8 mb-6 leading-[0.9] text-black tracking-tight">
                        The Right Card Saves You <br/> 
                        <span className="italic font-light opacity-50">₹15,000.</span>
                    </h2>
                    <p className="text-base md:text-lg font-sans font-light max-w-lg leading-relaxed text-black/80">
                        Most people lose money by using the wrong card. We make sure you always use the best one.
                    </p>
                    <div className="mt-10 inline-block bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-sm">
                        You Save: ₹15,000/yr
                    </div>
                </div>

                {/* Sidebar Features */}
                <div className="col-span-1 md:col-span-4 bg-[#F5F5F0]">
                    <div className="p-12 border-b border-black/10 h-1/2 flex flex-col justify-between hover:bg-clay hover:text-white transition-colors group">
                        <Gift size={32} className="mb-4 text-black group-hover:text-white" />
                        <div>
                            <h3 className="text-3xl font-serif mb-2 text-black group-hover:text-white">Discount Vouchers</h3>
                            <p className="opacity-60 text-sm leading-relaxed text-black group-hover:text-white">Get up to 8% off brand vouchers. Use them with your card rewards.</p>
                        </div>
                    </div>
                    <div className="p-12 h-1/2 flex flex-col justify-between hover:bg-black hover:text-white transition-colors group">
                        <Sparkles size={32} className="mb-4 text-black group-hover:text-white" />
                        <div>
                            <h3 className="text-3xl font-serif mb-2 text-black group-hover:text-white">Smart AI</h3>
                            <p className="opacity-60 text-sm leading-relaxed text-black group-hover:text-white">Chat with our AI to find the perfect card for your spending.</p>
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
        <section className="max-w-[1440px] mx-auto pb-24">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-black text-white p-12 md:p-16 flex flex-col justify-between min-h-[400px]">
                     <div>
                         <h3 className="text-3xl font-serif mb-4">Card API <br/><span className="text-[#00C48C]">Card API</span></h3>
                         <p className="text-white/50 text-xl max-w-sm">Add our card finder to your website.</p>
                     </div>
                     <div className="w-full h-px bg-white/20 mt-12"></div>
                 </div>
                 
                 <div className="bg-white border border-black/10 p-12 md:p-16 flex flex-col justify-between min-h-[400px]">
                     <div>
                         <h3 className="text-3xl font-serif mb-4 text-black">Debt Help <br/><span className="text-blue-600">Debt Help</span></h3>
                         <p className="text-black/50 text-xl max-w-sm">Help your users clear their debt.</p>
                     </div>
                     <div className="w-full h-px bg-black/10 mt-12"></div>
                 </div>
             </div>
        </section>

    </div>
  );
};

export default BFFPage;