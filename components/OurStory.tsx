import React, { useEffect, useRef, useState } from 'react';
import { Quote } from 'lucide-react';
import ImageWithLoader from './ImageWithLoader';

interface FadeInSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setIsVisible(true);
      });
    }, { threshold: 0.1 });
    const current = domRef.current;
    if (current) observer.observe(current);
    return () => {
        if(current) observer.unobserve(current);
    }
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.25,0.8,0.25,1)] transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const OurStory: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-4 md:pt-8 pb-20 font-sans text-[#e5e5e5] px-2 md:px-6">
      
      {/* --- NEW HERO SECTION: LE MONDE STYLE --- */}
      <div className="max-w-[1280px] mx-auto overflow-hidden mb-12 animate-fade-in-up">
        
        {/* Header Strip */}
        <div className="px-6 pt-6 pb-2">
            <div className="flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/20 pb-2 mb-1">
                <span>www.yureka.money</span>
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span>Price: Free</span>
            </div>
            {/* Masthead */}
            <div className="py-2 text-center relative px-2">
                <h1 className="font-blackletter text-3xl sm:text-6xl md:text-8xl leading-none text-[#34d399] break-words">Yureka.money</h1>
            </div>
            {/* Categories */}
            <div className="border-t-2 border-b border-white/20 py-1.5 flex justify-center flex-wrap gap-4 md:gap-8 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-white/60">
                <a href="#ai-match" className="cursor-pointer hover:text-[#34d399] transition-colors">AI Match</a>
                <a href="#rewards" className="cursor-pointer hover:text-[#34d399] transition-colors">Rewards</a>
                <a href="#rules" className="cursor-pointer hover:text-[#34d399] transition-colors">Rules</a>
                <a href="#money" className="cursor-pointer hover:text-[#34d399] transition-colors">Money</a>
                <a href="#tech" className="cursor-pointer hover:text-[#34d399] transition-colors">Tech</a>
                <a href="#security" className="cursor-pointer hover:text-[#34d399] transition-colors">Security</a>
                <a href="#vouchers" className="cursor-pointer hover:text-[#34d399] transition-colors">Vouchers</a>
            </div>
        </div>

        {/* Hero Content Grid */}
        <div className="p-6 md:p-10 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Editorial */}
            <div className="lg:col-span-2 hidden lg:block border-r border-white/10 pr-6">
                <div className="mb-4">
                    <span className="text-4xl text-[#34d399] font-blackletter block mb-2">J</span>
                    <h3 className="font-bold uppercase tracking-widest text-xs mb-2 text-white/80">Editorial</h3>
                    <h4 className="font-serif font-bold text-lg leading-tight mb-2 text-white">The Problem</h4>
                </div>
                <p className="font-serif text-sm leading-relaxed text-justify text-white/60">
                    Credit cards are confusing. There are hidden fees and biased advice. We built this to make things clear and honest.
                </p>
                <div className="mt-8 border-t border-white/10 pt-4">
                     <h5 className="font-bold text-xs uppercase mb-1 text-white/40">Yureka.money</h5>
                     <p className="text-xs text-white/20">Founded 2026</p>
                </div>
            </div>

            {/* Center Column: Main Story */}
            <div className="lg:col-span-7">
                <div className="mb-6">
                    <h3 className="font-sans text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/30 mb-2">Making credit cards simple for everyone.</h3>
                    <h2 className="font-heading text-2xl sm:text-5xl lg:text-5xl font-black leading-[1.1] text-white mb-6 uppercase">
                        Credit cards are complicated. <br/><span className="text-white/20 italic">We make them simple.</span>
                    </h2>
                </div>

                
                <div className="mb-6">
                    <div className="w-full aspect-[4/3] bg-white/5 relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 border border-white/10">
                        <ImageWithLoader 
                            src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800" 
                            className="w-full h-full object-cover opacity-80" 
                            alt="Founder"
                        />
                         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                                Our team working to help you save.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-white/10 pt-6">
                    <div className="col-span-1">
                        <h4 className="font-bold text-[10px] uppercase mb-2 flex items-center gap-2 text-[#34d399]"><span className="w-1.5 h-1.5 bg-[#34d399]"></span> Yureka AI</h4>
                        <p className="font-serif text-sm leading-tight text-white/60">
                            We scan 200+ cards in seconds to find your best match.
                        </p>
                    </div>
                    <div className="col-span-1 border-l border-white/10 pl-6">
                         <h4 className="font-bold text-[10px] uppercase mb-2 flex items-center gap-2 text-[#34d399]"><span className="w-1.5 h-1.5 bg-[#34d399]"></span> Rewards</h4>
                         <p className="font-serif text-sm leading-tight text-white/60">
                            Average users save ₹15,000+ a year by finding the right card.
                         </p>
                    </div>
                    <div className="col-span-1 border-l border-white/10 pl-6">
                         <h4 className="font-bold text-[10px] uppercase mb-2 flex items-center gap-2 text-[#34d399]"><span className="w-1.5 h-1.5 bg-[#34d399]"></span> Security</h4>
                         <p className="font-serif text-sm leading-tight text-white/60">
                            We use bank-level security to keep your data safe.
                         </p>
                    </div>
                </div>
            </div>

            {/* Right Column: Side Stories */}
            <div className="lg:col-span-3 border-l border-white/10 pl-6 md:pl-8">
                
                <div className="mb-8 pb-8 border-b border-white/10">
                    <h3 className="font-heading text-2xl font-black leading-tight mb-3 uppercase text-white">No more hidden fees</h3>
                    <p className="font-heading font-black text-3xl float-left mr-2 leading-none text-white/10">F</p>

                    <p className="font-serif text-sm leading-relaxed text-white/60 mb-4">
                        We help you find cards with the best benefits and lowest fees.
                    </p>
                    <p className="font-serif text-sm leading-relaxed text-white/40">
                        We believe in transparency. We don't charge you fees.
                    </p>
                </div>

                <div className="mb-8">
                     <h3 className="font-serif text-2xl font-bold leading-tight mb-3 text-white/80">Yureka+: Better Shopping</h3>
                     <p className="font-serif text-sm leading-relaxed text-white/40 mb-4">
                         Our browser extension helps you save money when you shop online.
                     </p>
                     <div className="w-full h-32 bg-white/5 border border-white/5 p-4 flex items-center justify-center text-center">
                         <span className="font-blackletter text-2xl text-white/5">Ad Space</span>
                     </div>
                </div>

            </div>

        </div>

      </div>

      {/* --- RESTORED GUARDIAN CONTENT (Transparent) --- */}
      <div id="manifesto-content" className="max-w-[1280px] mx-auto border-t border-white/10 overflow-hidden relative mb-20 scroll-mt-32">


        {/* 1. TOP TEASERS */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/10">
           {[
             { img: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=400", title: "Our Goal", subtitle: "Helping You" },
             { img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400", title: "Who We Are", subtitle: "The Founders" },
             { img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400", title: "Community", subtitle: "Join Us" },
             { img: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400", title: "Money", subtitle: "Smart Savings" }
           ].map((item, i) => (
             <div key={i} className="flex items-center gap-3 p-3 border-r border-white/10 last:border-r-0 hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-white/5 overflow-hidden grayscale group-hover:grayscale-0 transition-all border border-white/5">
                    <ImageWithLoader src={item.img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                </div>
                <div>
                   <p className="text-[10px] font-bold uppercase tracking-wider text-[#34d399] opacity-70">{item.subtitle}</p>
                   <p className="text-xs font-serif font-bold leading-tight text-white/80">{item.title}</p>
                </div>
             </div>
           ))}
        </div>

         <div className="bg-[#111111] text-white p-6 md:p-10 flex flex-col md:flex-row justify-between items-center md:items-end border-b border-white/20 text-center md:text-left">
            <div>
                <h1 className="text-3xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tighter leading-tight uppercase">
                    our mission<span className="text-[#34d399]">.</span>
                </h1>
            </div>

            <div className="flex gap-8 justify-center md:justify-end text-center md:text-right mt-6 md:mt-0 font-serif italic opacity-40 text-sm">
                <div>
                    <span className="block font-sans font-bold text-[10px] uppercase tracking-widest opacity-30 mb-1">Published</span>
                    Bengaluru, 2026
                </div>
                <div>
                    <span className="block font-sans font-bold text-[10px] uppercase tracking-widest opacity-30 mb-1">Cost</span>
                    Free
                </div>
            </div>
        </div>

         <div className="p-6 md:p-12 border-b border-white/10 text-center md:text-left">
            <FadeInSection>
                <h2 className="text-2xl sm:text-5xl lg:text-6xl font-heading font-black leading-[1.1] text-white tracking-tight mb-4 uppercase">
                    Credit cards are confusing. <br className="hidden md:block"/> <span className="text-[#34d399]">We make them simple.</span>
                </h2>
            </FadeInSection>
        </div>


        {/* 4. MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
            
            {/* LEFT COLUMN: 'Sketch' / Sidebar */}
            <div className="lg:col-span-2 border-r border-white/10 p-4 md:p-6">
                 <FadeInSection delay={100}>
                     <div className="mb-8">
                         <p className="text-[#34d399] font-serif text-xl italic mb-1">Editor's Note</p>
                         <h3 className="font-serif text-3xl font-bold leading-none mb-3 text-white">The Problem</h3>
                         <p className="font-serif text-sm leading-relaxed text-white/40">
                             "There are too many credit cards in India. Most people have the wrong one. We fix that."
                         </p>
                     </div>
                     <div className="mb-8">
                         <div className="w-full h-px bg-white/10 mb-4"></div>
                         <p className="font-bold text-[10px] uppercase tracking-widest mb-2 text-white/20">In this issue</p>
                         <ul className="space-y-2 text-sm font-serif underline decoration-white/10 underline-offset-4 cursor-pointer text-white/60">
                             <li className="hover:text-[#34d399]">Hidden Fees</li>
                             <li className="hover:text-[#34d399]">Helpful AI</li>
                             <li className="hover:text-[#34d399]">Save on Vouchers</li>
                         </ul>
                     </div>
                 </FadeInSection>
            </div>

            {/* CENTER/RIGHT: Main Story */}
            <div className="lg:col-span-10">
                
                {/* Image and Caption */}
                <div className="p-4 md:p-6 pb-0">
                    <FadeInSection delay={200}>
                        <div className="w-full aspect-[21/9] bg-white/5 relative grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden border border-white/10">
                             <ImageWithLoader 
                                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop" 
                                className="w-full h-full object-cover opacity-70 hover:opacity-100" 
                                alt="Fintech"
                             />
                             <div className="absolute bottom-0 left-0 bg-black/80 backdrop-blur-sm p-2 text-[10px] font-bold uppercase tracking-widest border-t border-r border-white/10 text-white/60">
                                 Fig A. The Digital Economy
                             </div>
                        </div>
                    </FadeInSection>
                </div>

                {/* Article Body */}
                <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
                    
                    {/* Intro / Leadin */}
                    <div className="md:col-span-8">
                        <FadeInSection delay={300}>
                            <div className="flex items-center gap-2 mb-4">
                               <span className="bg-[#34d399] text-[#0a0a0a] text-[9px] font-bold uppercase px-2 py-1 rounded-sm">Cover Story</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-serif font-bold leading-tight mb-4 text-white">
                                Why it's hard to compare cards yourself, and how we help.
                            </h3>
                            <div className="columns-1 md:columns-2 gap-10 font-serif text-sm leading-relaxed text-justify text-white/60">
                                <p className="mb-4">
                                    <span className="float-left text-4xl font-bold leading-[0.8] mr-2 mt-[-2px] text-[#34d399]">T</span>here is too much information to check: fees, rewards, and rules.
                                </p>
                                <p className="mb-4">
                                    It's hard to find the best card on your own. That's why we built our AI. We do the math for you.
                                </p>
                                <p>
                                    We don't sell cards. We help you find the one that pays you back.
                                </p>
                            </div>
                        </FadeInSection>
                    </div>

                    {/* Right Sidebar Info Box */}
                    <div className="md:col-span-4 bg-white/[0.02] p-5 border-t-4 border-[#34d399]">
                        <FadeInSection delay={400}>
                            <h4 className="font-bold text-[10px] uppercase tracking-widest mb-4 text-white/20">The Data</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-3xl font-serif font-bold text-white">200+</p>
                                    <p className="text-[10px] text-white/40 border-b border-white/5 pb-2 uppercase tracking-widest">Cards checked by us.</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-serif font-bold text-white">₹0</p>
                                    <p className="text-[10px] text-white/40 border-b border-white/5 pb-2 uppercase tracking-widest">Fees charged to you.</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-serif font-bold text-white">₹15k</p>
                                    <p className="text-[10px] text-white/40 pb-2 uppercase tracking-widest">Average yearly savings.</p>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/5">
                                <Quote size={24} className="text-[#34d399] mb-2 opacity-50" />
                                <p className="font-serif italic text-sm text-white/60">"We want to help you save money and understand your finances."</p>
                                <p className="text-[10px] font-bold uppercase mt-2 text-[#34d399] tracking-widest">— The Founders</p>
                            </div>
                        </FadeInSection>
                    </div>
                </div>

            </div>
        </div>

        {/* 5. BOTTOM GRID (Categories) */}
        <div className="grid grid-cols-1 md:grid-cols-4 border-t border-white/20 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {[
                { label: "Yureka AI", title: "Smart Match", desc: "Our AI finds the best card for your spending habits." },
                { label: "Rewards", title: "Vouchers", desc: "Get up to 8% off brand vouchers. Instant delivery." },
                { label: "Financial", title: "Smart Money", desc: "Improve your credit score and access better financial products." },
                { label: "Security", title: "Secure", desc: "Your data is safe with us. We don't share it." }
            ].map((col, i) => (
                <FadeInSection key={i} delay={500 + (i * 100)}>
                    <div className="p-5 hover:bg-white/5 transition-colors group h-full">
                        <div className="border-t-2 border-white/20 w-full pt-1 mb-2">
                            <span className="font-bold text-[10px] uppercase tracking-widest text-white/20">{col.label}</span>
                        </div>
                        <h4 className="font-serif text-lg font-bold leading-tight mb-2 group-hover:text-[#34d399] transition-colors text-white/80">{col.title}</h4>
                        <p className="text-xs font-serif leading-relaxed text-white/40">{col.desc}</p>
                    </div>
                </FadeInSection>
            ))}
        </div>

      </div>

      {/* --- NEW EDITORIAL SECTIONS --- */}
      <div className="max-w-[1280px] mx-auto px-6 mb-20 space-y-32">
        
         <section id="ai-match" className="scroll-mt-32">

            <FadeInSection>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t-4 border-white/20 pt-12">
                    <div className="lg:col-span-4">
                        <span className="text-[#34d399] font-bold text-[10px] uppercase tracking-[0.3em] block mb-4">Neural Dispatch 01</span>
                        <h2 className="text-4xl md:text-5xl font-heading font-black leading-none mb-6 uppercase text-white">The AI Match Engine.</h2>
                        <div className="bg-[#111111] text-white/90 p-6 font-sans font-medium text-lg leading-relaxed shadow-2xl transform -rotate-1 border border-white/5">
                            "We don't guess. We compute. Every reward, every fee, every hidden clause scanned in 350ms."
                        </div>
                    </div>

                    <div className="lg:col-span-8 flex flex-col justify-center">
                        <div className="columns-1 md:columns-2 gap-10 font-serif text-lg leading-relaxed text-justify text-white/60">
                            <p className="mb-6">
                                <span className="float-left text-7xl font-bold leading-[0.7] mr-3 mt-1 text-[#34d399]">O</span>ur neural core is trained on the collective logic of thousands of credit instruments. It understands that a 5% reward rate is meaningless if the redemption cap is low or the exclusion list is long.
                            </p>
                            <p>
                                By processing your spending patterns across 12 distinct categories, the engine simulates 12 months of usage for every card in our database. The result isn't a recommendation—it's a prediction of performance. Precision finance, finally tailored to the individual.
                            </p>
                        </div>
                    </div>
                </div>
            </FadeInSection>
        </section>

         <section id="rewards-matrix" className="scroll-mt-32">
            <FadeInSection>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t-2 border-white/10 pt-12">
                    <div className="lg:col-span-7 border-r border-white/10 pr-12">
                        <h2 className="text-4xl md:text-6xl font-heading font-black text-white mb-8 uppercase tracking-tighter">The Matrix of Rewards.</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-4">
                                <h4 className="font-bold text-[10px] uppercase tracking-widest bg-[#34d399] text-[#0a0a0a] inline-block px-2 py-1">Strategy A</h4>
                                <p className="font-serif text-lg leading-snug text-white/80">
                                    Maximize miles for travel. We map airline transfer partners across multiple card networks to build Your flight bridge.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-bold text-[10px] uppercase tracking-widest bg-emerald-500 text-[#0a0a0a] inline-block px-2 py-1">Strategy B</h4>
                                <p className="font-serif text-lg leading-snug text-white/80">
                                    Direct cashback liquid assets. For those who prefer immediate injection of capital back into their ecosystem.
                                </p>
                            </div>
                        </div>
                        <p className="font-serif text-xl italic text-white/40 leading-relaxed border-l-4 border-[#34d399]/40 pl-6 py-2">
                            Rewards are not "perks"—they are the yield of your lifestyle. If you aren't earning 3-5% CAGR on your regular spends, you are effectively paying a hidden tax to the banking system.
                        </p>
                    </div>
                    <div className="lg:col-span-5 flex items-center">
                        <div className="w-full aspect-video bg-white/5 relative grayscale overflow-hidden group border border-white/10">
                           <ImageWithLoader 
                                src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60" 
                                alt="Founders"
                            />
                            <div className="absolute inset-0 border-[20px] border-white/5 pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </FadeInSection>
        </section>

        {/* 3. RULES */}
        <section id="rules-audit" className="scroll-mt-32">
            <FadeInSection>
                <div className="relative border-4 border-white/10 p-8 md:p-16 overflow-hidden bg-white/[0.01]">
                    <div className="absolute top-0 right-0 p-4 font-blackletter text-6xl text-white/5 pointer-events-none">THE FINE PRINT</div>
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="text-[#34d399] font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block">Registry Audit / Rules</span>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-8 italic underline decoration-[#34d399]/40 underline-offset-8 text-white">No More Cryptic Clauses.</h2>
                        <div className="space-y-8 font-serif text-lg leading-relaxed text-white/60">
                            <p>
                                Banks profit from complexity. The 50-page Terms & Conditions document is a wall designed to prevent you from truly understanding the instrument you hold.
                            </p>
                            <div className="flex flex-col md:flex-row gap-8 justify-center py-8">
                                <div className="text-center px-4">
                                    <span className="block text-4xl font-bold text-white mb-1">94%</span>
                                    <span className="text-[10px] font-bold uppercase text-white/20 tracking-widest">Users miss excluding mcc lists</span>
                                </div>
                                <div className="text-center px-4 md:border-x border-white/10">
                                    <span className="block text-4xl font-bold text-white mb-1">₹4,500</span>
                                    <span className="text-[10px] font-bold uppercase text-white/20 tracking-widest">Avg hidden fee per annum</span>
                                </div>
                                <div className="text-center px-4">
                                    <span className="block text-4xl font-bold text-white mb-1">0</span>
                                    <span className="text-[10px] font-bold uppercase text-white/20 tracking-widest">Surprises with Yureka</span>
                                </div>
                            </div>
                            <p>
                                We translate "Bank-Speak" into human intelligence. Our Rules engine highlights every exclusion, every cap, and every fee in plain text. Knowledge isn't just power—it's capital.
                            </p>
                        </div>
                    </div>
                </div>
            </FadeInSection>
        </section>

        {/* 4. MONEY */}
        <section id="financial-strategy" className="scroll-mt-32">
            <FadeInSection>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t-2 border-white/10 pt-12">
                     <div className="lg:col-span-5 order-2 lg:order-1">
                        <div className="w-full aspect-square bg-[#111111] text-white p-12 flex flex-col justify-between group overflow-hidden relative border border-white/5 shadow-2xl">
                             <div className="relative z-10">
                                <h3 className="text-3xl font-serif font-bold mb-4 italic">Assets Over Liabilities.</h3>
                                <p className="font-serif text-lg leading-relaxed opacity-40">
                                    "A credit card is either a hole in your pocket or a bridge to your next major investment. You choose the architecture."
                                </p>
                             </div>
                             <div className="text-[#34d399] font-blackletter text-[10rem] absolute -bottom-10 -right-10 opacity-5 group-hover:rotate-12 transition-transform duration-1000">$</div>
                        </div>
                    </div>
                    <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center">
                        <span className="text-[#34d399] font-bold text-[10px] uppercase tracking-[0.3em] block mb-4">Financial Dispatch 04</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold leading-none mb-6 text-white">Money: The Strategic Tool.</h2>
                        <div className="font-serif text-lg leading-relaxed text-justify text-white/60">
                            <p className="mb-6">
                                We believe credit is an asset classes in its own right. When managed with precision, it allows for interest-free capital deployment and significant yield through reward arbitrage.
                            </p>
                            <p>
                                Yureka treats your wallet like a portfolio. We help you balance the "Risk-Reward" ratio of every card, ensuring that your credit score grows alongside your liquid savings. This isn't just about spending—it's about wealth architecture.
                            </p>
                        </div>
                    </div>
                </div>
            </FadeInSection>
        </section>

         <section id="tech-stack" className="scroll-mt-32">
            <FadeInSection>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-y-2 border-white/20 py-16 bg-[#0c0c0c] shadow-2xl">
                    <div className="lg:col-span-12 text-center mb-8 px-6">
                        <h2 className="text-3xl sm:text-6xl md:text-8xl font-heading font-black tracking-tighter mb-4 uppercase text-white">The Stack Behind the Strategy.</h2>
                        <p className="max-w-2xl mx-auto font-sans text-[10px] sm:text-lg font-bold uppercase tracking-[0.4em] text-white/20">Built for 99.9% precision in a world of 100% financial noise.</p>
                    </div>

                    <div className="lg:col-span-4 px-12 border-r border-white/5">
                        <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] mb-4 text-[#34d399]">Neural Engine</h4>
                        <p className="font-serif text-sm leading-relaxed text-white/60">
                            Our proprietary LLM-driven core parses bank policy PDF changes in real-time. No manual entry, no stale data.
                        </p>
                    </div>
                    <div className="lg:col-span-4 px-12 border-r border-white/5">
                        <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] mb-4 text-[#34d399]">Real-Time Sync</h4>
                        <p className="font-serif text-sm leading-relaxed text-white/60">
                            Integration with Supabase ensures that every card update is propagated to your dashboard in under 200ms.
                        </p>
                    </div>
                    <div className="lg:col-span-4 px-12">
                        <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] mb-4 text-[#34d399]">React Architecture</h4>
                        <p className="font-serif text-sm leading-relaxed text-white/60">
                            A high-fidelity frontend built with Framer Motion for a tactile, responsive experience that feels like magic.
                        </p>
                    </div>
                </div>
            </FadeInSection>
        </section>

        {/* 6. SECURITY */}
        <section id="security" className="scroll-mt-32">
            <FadeInSection>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-white/10 pt-12">
                    <div className="lg:col-span-6 bg-white/[0.02] p-12 border-l-8 border-[#34d399]/40">
                        <h2 className="text-4xl font-serif font-bold mb-6 text-white">Security as a Foundation.</h2>
                        <div className="space-y-6 font-serif text-lg leading-relaxed text-white/60">
                            <p>
                                Your financial data is a extension of your identity. We treat it with the same reverence as a top-tier banking institution.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex gap-4 items-start">
                                    <span className="w-6 h-6 rounded-full bg-[#34d399] text-[#0a0a0a] flex-shrink-0 flex items-center justify-center text-[10px] font-bold">01</span>
                                    <span><strong className="text-white">AES-256 Encryption</strong>: Your data is encrypted at rest and in transit.</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="w-6 h-6 rounded-full bg-[#34d399] text-[#0a0a0a] flex-shrink-0 flex items-center justify-center text-[10px] font-bold">02</span>
                                    <span><strong className="text-white">Zero-Knowledge Architecture</strong>: We prioritize your privacy above all. We don't see what you don't share.</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="w-6 h-6 rounded-full bg-[#34d399] text-[#0a0a0a] flex-shrink-0 flex items-center justify-center text-[10px] font-bold">03</span>
                                    <span><strong className="text-white">Regular Audits</strong>: Our systems undergo continuous penetration testing to ensure resilience.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="lg:col-span-6 flex items-center justify-center">
                        <div className="relative w-full max-w-md aspect-square bg-[#111111] p-12 flex items-center justify-center overflow-hidden border border-white/5">
                             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#34d399] to-transparent animate-pulse"></div>
                             <div className="w-32 h-32 border-4 border-white/10 rounded-full flex items-center justify-center relative z-10">
                                <div className="w-16 h-16 bg-white rounded-sm transform rotate-45 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                    <div className="w-4 h-4 bg-[#0a0a0a] rounded-full"></div>
                                </div>
                             </div>
                             <p className="absolute bottom-8 text-white/20 font-mono text-[10px] uppercase tracking-[0.5em]">System Status: Fortified</p>
                        </div>
                    </div>
                </div>
            </FadeInSection>
        </section>

        {/* 7. VOUCHERS */}
        <section id="vouchers" className="scroll-mt-32">
            <FadeInSection>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t-4 border-white pt-12 mb-20">
                    <div className="lg:col-span-4">
                        <h2 className="text-4xl md:text-6xl font-blackletter mb-6 leading-none text-[#34d399]">Instant Value.</h2>
                        <p className="font-serif text-xl italic text-white/40 mb-8 underline decoration-[#34d399]/40 underline-offset-4 decoration-2">Spend smart, Save smarter.</p>
                        <ul className="space-y-4 font-bold text-[10px] uppercase tracking-widest text-white/30">
                            <li>• 500+ Luxury Partners</li>
                            <li>• 2-10% Immediate Savings</li>
                            <li>• Instant Digital Registry</li>
                        </ul>
                    </div>
                    <div className="lg:col-span-8">
                        <div className="font-serif text-lg leading-relaxed text-justify text-white/60 columns-1 md:columns-2 gap-10">
                            <p className="mb-6">
                                Points are legacy assets. Vouchers are liquid capital. We've partnered with the world's leading brands to ensure that your credit performance converts directly into purchasing power.
                            </p>
                            <p>
                                Whether it's the 15% you save on your weekly grocery run or the ₹5,000 you shave off your next luxury purchase, the Yureka Voucher Hub is where your strategy meets the real world. No waiting for billing cycles. No cryptic redemption portals. Just pure, instant value. 
                            </p>
                        </div>
                        <div className="mt-12 bg-[#111111] text-white p-8 flex flex-col md:flex-row justify-between items-center gap-8 border border-white/5 text-center md:text-left">
                             <div>
                                <h3 className="text-2xl font-serif font-bold mb-2 tracking-tight">Ready to optimize?</h3>
                                <p className="font-serif italic opacity-30 text-sm">Join 10,000+ high-performance spenders today.</p>
                             </div>
                             <button className="bg-[#34d399] text-[#0a0a0a] px-8 py-4 font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all cursor-pointer shadow-lg shadow-[#34d399]/10">
                                Join the Registry
                             </button>
                        </div>
                    </div>
                </div>
            </FadeInSection>
        </section>

      </div>
    </div>
  );
};

export default OurStory;