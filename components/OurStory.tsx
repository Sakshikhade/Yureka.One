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
    <div className="min-h-screen bg-[#F2EFE9] pt-28 pb-20 font-sans text-[#1a1a1a] px-2 md:px-6">
      
      {/* --- NEW HERO SECTION: LE MONDE STYLE --- */}
      <div className="max-w-[1280px] mx-auto overflow-hidden mb-12 animate-fade-in-up">
        
        {/* Header Strip */}
        <div className="px-6 pt-6 pb-2">
            <div className="flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-black/60 border-b border-black pb-2 mb-1">
                <span>www.yureka.money</span>
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span>Price: Free</span>
            </div>
            {/* Masthead */}
            <div className="py-2 text-center relative">
                <h1 className="font-blackletter text-4xl md:text-6xl lg:text-[5rem] leading-none text-black">Yureka.money</h1>
            </div>
            {/* Categories */}
            <div className="border-t-2 border-b border-black py-1.5 flex justify-center flex-wrap gap-4 md:gap-8 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-black">
                <a href="#ai-match" className="cursor-pointer hover:text-teal transition-colors">AI Match</a>
                <a href="#rewards" className="cursor-pointer hover:text-teal transition-colors">Rewards</a>
                <a href="#rules" className="cursor-pointer hover:text-teal transition-colors">Rules</a>
                <a href="#money" className="cursor-pointer hover:text-teal transition-colors">Money</a>
                <a href="#tech" className="cursor-pointer hover:text-teal transition-colors">Tech</a>
                <a href="#security" className="cursor-pointer hover:text-teal transition-colors">Security</a>
                <a href="#vouchers" className="cursor-pointer hover:text-teal transition-colors">Vouchers</a>
            </div>
        </div>

        {/* Hero Content Grid */}
        <div className="p-6 md:p-10 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Editorial */}
            <div className="lg:col-span-2 hidden lg:block border-r border-black/10 pr-6">
                <div className="mb-4">
                    <span className="text-4xl text-teal font-blackletter block mb-2">J</span>
                    <h3 className="font-bold uppercase tracking-widest text-xs mb-2">Editorial</h3>
                    <h4 className="font-serif font-bold text-lg leading-tight mb-2">The Problem</h4>
                </div>
                <p className="font-serif text-sm leading-relaxed text-justify text-black/80">
                    Credit cards are confusing. There are hidden fees and biased advice. We built this to make things clear and honest.
                </p>
                <div className="mt-8 border-t border-black/10 pt-4">
                     <h5 className="font-bold text-xs uppercase mb-1">Yureka.money</h5>
                     <p className="text-xs text-black/60">Founded 2026</p>
                </div>
            </div>

            {/* Center Column: Main Story */}
            <div className="lg:col-span-7">
                <div className="mb-6">
                    <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-black/60 mb-2">Making credit cards simple for everyone.</h3>
                    <h2 className="font-serif text-4xl md:text-5xl lg:text-5xl font-bold leading-[0.95] text-black mb-6">
                        Credit cards are complicated. We make them simple.
                    </h2>
                </div>
                
                <div className="mb-6">
                    <div className="w-full aspect-[4/3] bg-black/5 relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                        <ImageWithLoader 
                            src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800" 
                            className="w-full h-full object-cover" 
                            alt="Founder"
                        />
                         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                            <p className="text-white text-xs font-bold uppercase tracking-widest">
                                Our team working to help you save.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-black/10 pt-6">
                    <div className="col-span-1">
                        <h4 className="font-bold text-xs uppercase mb-2 flex items-center gap-2"><span className="w-2 h-2 bg-black"></span> AI Magic</h4>
                        <p className="font-serif text-sm leading-tight text-black/80">
                            We scan 200+ cards in seconds to find your best match.
                        </p>
                    </div>
                    <div className="col-span-1 border-l border-black/10 pl-6">
                         <h4 className="font-bold text-xs uppercase mb-2 flex items-center gap-2"><span className="w-2 h-2 bg-black"></span> Rewards</h4>
                         <p className="font-serif text-sm leading-tight text-black/80">
                            Average users save ₹15,000+ a year by finding the right card.
                         </p>
                    </div>
                    <div className="col-span-1 border-l border-black/10 pl-6">
                         <h4 className="font-bold text-xs uppercase mb-2 flex items-center gap-2"><span className="w-2 h-2 bg-black"></span> Security</h4>
                         <p className="font-serif text-sm leading-tight text-black/80">
                            We use bank-level security to keep your data safe.
                         </p>
                    </div>
                </div>
            </div>

            {/* Right Column: Side Stories */}
            <div className="lg:col-span-3 border-l border-black/10 pl-6 md:pl-8">
                
                <div className="mb-8 pb-8 border-b border-black/10">
                    <h3 className="font-serif text-2xl font-bold leading-tight mb-3">No more hidden fees</h3>
                    <p className="font-serif text-3xl font-bold float-left mr-2 leading-none text-black/20">F</p>
                    <p className="font-serif text-sm leading-relaxed text-black/80 mb-4">
                        We help you find cards with the best benefits and lowest fees.
                    </p>
                    <p className="font-serif text-sm leading-relaxed text-black/80">
                        We believe in transparency. We don't charge you fees.
                    </p>
                </div>

                <div className="mb-8">
                     <h3 className="font-serif text-2xl font-bold leading-tight mb-3">Yureka+: Better Shopping</h3>
                     <p className="font-serif text-sm leading-relaxed text-black/80 mb-4">
                         Our browser extension helps you save money when you shop online.
                     </p>
                     <div className="w-full h-32 bg-black/5 border border-black/5 p-4 flex items-center justify-center text-center">
                         <span className="font-blackletter text-2xl text-black/20">Ad Space</span>
                     </div>
                </div>

            </div>

        </div>

      </div>

      {/* --- RESTORED GUARDIAN CONTENT (Transparent) --- */}
      <div className="max-w-[1280px] mx-auto border-t border-black/10 overflow-hidden relative mb-20">

        {/* 1. TOP TEASERS */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-black/10">
           {[
             { img: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=400", title: "Our Goal", subtitle: "Helping You" },
             { img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400", title: "Who We Are", subtitle: "The Founders" },
             { img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400", title: "Community", subtitle: "Join Us" },
             { img: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400", title: "Money", subtitle: "Smart Savings" }
           ].map((item, i) => (
             <div key={i} className="flex items-center gap-3 p-3 border-r border-black/10 last:border-r-0 hover:bg-black/5 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-black/5 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                    <ImageWithLoader src={item.img} className="w-full h-full object-cover" />
                </div>
                <div>
                   <p className="text-[10px] font-bold uppercase tracking-wider text-teal opacity-70">{item.subtitle}</p>
                   <p className="text-xs font-serif font-bold leading-tight">{item.title}</p>
                </div>
             </div>
           ))}
        </div>

        {/* 2. MASTHEAD */}
        <div className="bg-[#111] text-white p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-black">
            <div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tighter leading-none">
                    our mission<span className="text-teal">.</span>
                </h1>
            </div>
            <div className="flex gap-8 text-right mt-4 md:mt-0 font-serif italic opacity-80 text-sm">
                <div>
                    <span className="block font-sans font-bold text-[10px] uppercase tracking-widest opacity-50 mb-1">Published</span>
                    Bengaluru, 2026
                </div>
                <div>
                    <span className="block font-sans font-bold text-[10px] uppercase tracking-widest opacity-50 mb-1">Cost</span>
                    Free
                </div>
            </div>
        </div>

        {/* 3. HEADLINE SECTION */}
        <div className="p-6 md:p-12 border-b border-black/10">
            <FadeInSection>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold leading-[0.95] text-black tracking-tight mb-4">
                    Credit cards are confusing. <br className="hidden md:block"/> <span className="italic text-clay">We make them simple.</span>
                </h2>
            </FadeInSection>
        </div>

        {/* 4. MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
            
            {/* LEFT COLUMN: 'Sketch' / Sidebar */}
            <div className="lg:col-span-2 border-r border-black/10 p-4 md:p-6">
                 <FadeInSection delay={100}>
                     <div className="mb-8">
                         <p className="text-clay font-serif text-xl italic mb-1">Editor's Note</p>
                         <h3 className="font-serif text-3xl font-bold leading-none mb-3">The Problem</h3>
                         <p className="font-serif text-sm leading-relaxed text-black/80">
                             "There are too many credit cards in India. Most people have the wrong one. We fix that."
                         </p>
                     </div>
                     <div className="mb-8">
                         <div className="w-full h-px bg-black/10 mb-4"></div>
                         <p className="font-bold text-xs uppercase tracking-widest mb-2">In this issue</p>
                         <ul className="space-y-2 text-sm font-serif underline decoration-black/20 underline-offset-4 cursor-pointer">
                             <li className="hover:text-teal">Hidden Fees</li>
                             <li className="hover:text-teal">Helpful AI</li>
                             <li className="hover:text-teal">Save on Vouchers</li>
                         </ul>
                     </div>
                 </FadeInSection>
            </div>

            {/* CENTER/RIGHT: Main Story */}
            <div className="lg:col-span-10">
                
                {/* Image and Caption */}
                <div className="p-4 md:p-6 pb-0">
                    <FadeInSection delay={200}>
                        <div className="w-full aspect-[21/9] bg-black/5 relative grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden">
                             <ImageWithLoader 
                                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop" 
                                className="w-full h-full object-cover" 
                                alt="Fintech"
                             />
                             <div className="absolute bottom-0 left-0 bg-white/90 backdrop-blur-sm p-2 text-[10px] font-bold uppercase tracking-widest border-t border-r border-black/10">
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
                               <span className="bg-clay text-white text-[9px] font-bold uppercase px-2 py-1 rounded-sm">Cover Story</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-serif font-bold leading-tight mb-4">
                                Why it's hard to compare cards yourself, and how we help.
                            </h3>
                            <div className="columns-1 md:columns-2 gap-8 font-serif text-sm leading-relaxed text-justify text-black/80">
                                <p className="mb-4">
                                    <span className="float-left text-4xl font-bold leading-[0.8] mr-2 mt-[-2px]">T</span>here is too much information to check: fees, rewards, and rules.
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
                    <div className="md:col-span-4 bg-black/5 p-5 border-t-4 border-black">
                        <FadeInSection delay={400}>
                            <h4 className="font-bold text-sm uppercase tracking-widest mb-4">The Data</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-3xl font-serif font-bold">200+</p>
                                    <p className="text-xs text-black/60 border-b border-black/10 pb-2">Cards checked by us.</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-serif font-bold">₹0</p>
                                    <p className="text-xs text-black/60 border-b border-black/10 pb-2">Fees charged to you.</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-serif font-bold">₹15k</p>
                                    <p className="text-xs text-black/60 pb-2">Average yearly savings.</p>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-black/10">
                                <Quote size={24} className="text-clay mb-2" />
                                <p className="font-serif italic text-sm">"We want to help you save money and understand your finances."</p>
                                <p className="text-xs font-bold uppercase mt-2">— The Founders</p>
                            </div>
                        </FadeInSection>
                    </div>
                </div>

            </div>
        </div>

        {/* 5. BOTTOM GRID (Categories) */}
        <div className="grid grid-cols-1 md:grid-cols-4 border-t border-black divide-y md:divide-y-0 md:divide-x divide-black/10">
            {[
                { label: "AI Magic", title: "Smart Match", desc: "Our AI finds the best card for your spending habits." },
                { label: "Rewards", title: "Vouchers", desc: "Get up to 8% off brand vouchers. Instant delivery." },
                { label: "Financial", title: "Smart Money", desc: "Improve your credit score and access better financial products." },
                { label: "Security", title: "Secure", desc: "Your data is safe with us. We don't share it." }
            ].map((col, i) => (
                <FadeInSection key={i} delay={500 + (i * 100)}>
                    <div className="p-5 hover:bg-black/5 transition-colors group h-full">
                        <div className="border-t-2 border-black w-full pt-1 mb-2">
                            <span className="font-bold text-[10px] uppercase tracking-widest text-black/50">{col.label}</span>
                        </div>
                        <h4 className="font-serif text-lg font-bold leading-tight mb-2 group-hover:text-teal transition-colors">{col.title}</h4>
                        <p className="text-xs font-serif leading-relaxed text-black/70">{col.desc}</p>
                    </div>
                </FadeInSection>
            ))}
        </div>

      </div>

      {/* --- NEW EDITORIAL SECTIONS --- */}
      <div className="max-w-[1280px] mx-auto px-6 mb-20 space-y-32">
        
        {/* 1. AI MATCH */}
        <section id="ai-match" className="scroll-mt-32">
            <FadeInSection>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t-4 border-black pt-12">
                    <div className="lg:col-span-4">
                        <span className="text-clay font-bold text-xs uppercase tracking-widest block mb-4">Neural Dispatch 01</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold leading-none mb-6">The AI Match Engine.</h2>
                        <div className="bg-black text-[#F2EFE9] p-6 font-serif italic text-lg leading-relaxed shadow-xl transform -rotate-1">
                            "We don't guess. We compute. Every reward, every fee, every hidden clause scanned in 350ms."
                        </div>
                    </div>
                    <div className="lg:col-span-8 flex flex-col justify-center">
                        <div className="columns-1 md:columns-2 gap-10 font-serif text-lg leading-relaxed text-justify text-black/90">
                            <p className="mb-6">
                                <span className="float-left text-7xl font-bold leading-[0.7] mr-3 mt-1 text-teal">O</span>ur neural core is trained on the collective logic of thousands of credit instruments. It understands that a 5% reward rate is meaningless if the redemption cap is low or the exclusion list is long.
                            </p>
                            <p>
                                By processing your spending patterns across 12 distinct categories, the engine simulates 12 months of usage for every card in our database. The result isn't a recommendation—it's a prediction of performance. Precision finance, finally tailored to the individual.
                            </p>
                        </div>
                    </div>
                </div>
            </FadeInSection>
        </section>

        {/* 2. REWARDS */}
        <section id="rewards" className="scroll-mt-32">
            <FadeInSection>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t-2 border-black/10 pt-12">
                    <div className="lg:col-span-7 border-r border-black/10 pr-12">
                        <h2 className="text-4xl md:text-6xl font-blackletter text-black mb-8">The Matrix of Rewards.</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-4">
                                <h4 className="font-bold text-xs uppercase tracking-widest bg-clay text-white inline-block px-2 py-1">Strategy A</h4>
                                <p className="font-serif text-lg leading-snug">
                                    Maximize miles for travel. We map airline transfer partners across multiple card networks to build Your flight bridge.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-bold text-xs uppercase tracking-widest bg-teal text-white inline-block px-2 py-1">Strategy B</h4>
                                <p className="font-serif text-lg leading-snug">
                                    Direct cashback liquid assets. For those who prefer immediate injection of capital back into their ecosystem.
                                </p>
                            </div>
                        </div>
                        <p className="font-serif text-xl italic text-black/70 leading-relaxed border-l-4 border-clay pl-6 py-2">
                            Rewards are not "perks"—they are the yield of your lifestyle. If you aren't earning 3-5% CAGR on your regular spends, you are effectively paying a hidden tax to the banking system.
                        </p>
                    </div>
                    <div className="lg:col-span-5 flex items-center">
                        <div className="w-full aspect-video bg-black/10 relative grayscale overflow-hidden group">
                           <ImageWithLoader 
                                src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                                alt="Founders"
                            />
                            <div className="absolute inset-0 border-[20px] border-black/5 pointer-events-none"></div>
                        </div>
                    </div>
                </div>
            </FadeInSection>
        </section>

        {/* 3. RULES */}
        <section id="rules" className="scroll-mt-32">
            <FadeInSection>
                <div className="relative border-4 border-black p-8 md:p-16 overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 font-blackletter text-6xl text-black/5 pointer-events-none">THE FINE PRINT</div>
                    <div className="max-w-3xl mx-auto text-center">
                        <span className="text-clay font-bold text-xs uppercase tracking-[0.4em] mb-4 block">Registry Audit / Rules</span>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-8 italic underline decoration-clay underline-offset-8">No More Cryptic Clauses.</h2>
                        <div className="space-y-8 font-serif text-lg leading-relaxed text-black/80">
                            <p>
                                Banks profit from complexity. The 50-page Terms & Conditions document is a wall designed to prevent you from truly understanding the instrument you hold.
                            </p>
                            <div className="flex flex-col md:flex-row gap-8 justify-center py-8">
                                <div className="text-center px-4">
                                    <span className="block text-4xl font-bold text-black mb-1">94%</span>
                                    <span className="text-[10px] font-bold uppercase text-black/50 tracking-widest">Users miss excluding mcc lists</span>
                                </div>
                                <div className="text-center px-4 md:border-x border-black/10">
                                    <span className="block text-4xl font-bold text-black mb-1">₹4,500</span>
                                    <span className="text-[10px] font-bold uppercase text-black/50 tracking-widest">Avg hidden fee per annum</span>
                                </div>
                                <div className="text-center px-4">
                                    <span className="block text-4xl font-bold text-black mb-1">0</span>
                                    <span className="text-[10px] font-bold uppercase text-black/50 tracking-widest">Surprises with Yureka</span>
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
        <section id="money" className="scroll-mt-32">
            <FadeInSection>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t-2 border-black/10 pt-12">
                     <div className="lg:col-span-5 order-2 lg:order-1">
                        <div className="w-full aspect-square bg-[#111] text-white p-12 flex flex-col justify-between group overflow-hidden relative">
                             <div className="relative z-10">
                                <h3 className="text-3xl font-serif font-bold mb-4 italic">Assets Over Liabilities.</h3>
                                <p className="font-serif text-lg leading-relaxed opacity-80">
                                    "A credit card is either a hole in your pocket or a bridge to your next major investment. You choose the architecture."
                                </p>
                             </div>
                             <div className="text-clay font-blackletter text-[10rem] absolute -bottom-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">$</div>
                        </div>
                    </div>
                    <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center">
                        <span className="text-clay font-bold text-xs uppercase tracking-widest block mb-4">Financial Dispatch 04</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold leading-none mb-6">Money: The Strategic Tool.</h2>
                        <div className="font-serif text-lg leading-relaxed text-justify text-black/90">
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

        {/* 5. TECH */}
        <section id="tech" className="scroll-mt-32">
            <FadeInSection>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-y-2 border-black py-16 bg-white shadow-2xl">
                    <div className="lg:col-span-12 text-center mb-8 px-6">
                        <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter mb-4">The Stack Behind the Strategy.</h2>
                        <p className="max-w-2xl mx-auto font-serif text-xl italic text-black/60">Built for 99.9% precision in a world of 100% financial noise.</p>
                    </div>
                    <div className="lg:col-span-4 px-12 border-r border-black/5">
                        <h4 className="font-bold text-xs uppercase tracking-[0.3em] mb-4 text-clay">Neural Engine</h4>
                        <p className="font-serif text-sm leading-relaxed">
                            Our proprietary LLM-driven core parses bank policy PDF changes in real-time. No manual entry, no stale data.
                        </p>
                    </div>
                    <div className="lg:col-span-4 px-12 border-r border-black/5">
                        <h4 className="font-bold text-xs uppercase tracking-[0.3em] mb-4 text-clay">Real-Time Sync</h4>
                        <p className="font-serif text-sm leading-relaxed">
                            Integration with Supabase ensures that every card update is propagated to your dashboard in under 200ms.
                        </p>
                    </div>
                    <div className="lg:col-span-4 px-12">
                        <h4 className="font-bold text-xs uppercase tracking-[0.3em] mb-4 text-clay">React Architecture</h4>
                        <p className="font-serif text-sm leading-relaxed">
                            A high-fidelity frontend built with Framer Motion for a tactile, responsive experience that feels like magic.
                        </p>
                    </div>
                </div>
            </FadeInSection>
        </section>

        {/* 6. SECURITY */}
        <section id="security" className="scroll-mt-32">
            <FadeInSection>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-black/10 pt-12">
                    <div className="lg:col-span-6 bg-clay/5 p-12 border-l-8 border-clay">
                        <h2 className="text-4xl font-serif font-bold mb-6">Security as a Foundation.</h2>
                        <div className="space-y-6 font-serif text-lg leading-relaxed">
                            <p>
                                Your financial data is a extension of your identity. We treat it with the same reverence as a top-tier banking institution.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex gap-4 items-start">
                                    <span className="w-6 h-6 rounded-full bg-clay text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold">01</span>
                                    <span>**AES-256 Encryption**: Your data is encrypted at rest and in transit.</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="w-6 h-6 rounded-full bg-clay text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold">02</span>
                                    <span>**Zero-Knowledge Architecture**: We prioritize your privacy above all. We don't see what you don't share.</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <span className="w-6 h-6 rounded-full bg-clay text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold">03</span>
                                    <span>**Regular Audits**: Our systems undergo continuous penetration testing to ensure resilience.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="lg:col-span-6 flex items-center justify-center">
                        <div className="relative w-full max-w-md aspect-square bg-[#1a1a1a] p-12 flex items-center justify-center overflow-hidden">
                             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-clay to-transparent animate-pulse"></div>
                             <div className="w-32 h-32 border-4 border-white/20 rounded-full flex items-center justify-center relative z-10">
                                <div className="w-16 h-16 bg-white rounded-sm transform rotate-45 flex items-center justify-center">
                                    <div className="w-4 h-4 bg-[#1a1a1a] rounded-full"></div>
                                </div>
                             </div>
                             <p className="absolute bottom-8 text-white/40 font-mono text-[10px] uppercase tracking-[0.5em]">System Status: Fortified</p>
                        </div>
                    </div>
                </div>
            </FadeInSection>
        </section>

        {/* 7. VOUCHERS */}
        <section id="vouchers" className="scroll-mt-32">
            <FadeInSection>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t-4 border-black pt-12 mb-20">
                    <div className="lg:col-span-4">
                        <h2 className="text-4xl md:text-6xl font-blackletter mb-6 leading-none">Instant Value.</h2>
                        <p className="font-serif text-xl italic text-black/60 mb-8 underline decoration-clay underline-offset-4 decoration-2">Spend smart, Save smarter.</p>
                        <ul className="space-y-4 font-bold text-xs uppercase tracking-widest text-[#1a1a1a]/70">
                            <li>• 500+ Luxury Partners</li>
                            <li>• 2-10% Immediate Savings</li>
                            <li>• Instant Digital Registry</li>
                        </ul>
                    </div>
                    <div className="lg:col-span-8">
                        <div className="font-serif text-lg leading-relaxed text-justify text-black/90 columns-1 md:columns-2 gap-10">
                            <p className="mb-6">
                                Points are legacy assets. Vouchers are liquid capital. We've partnered with the world's leading brands to ensure that your credit performance converts directly into purchasing power.
                            </p>
                            <p>
                                Whether it's the 15% you save on your weekly grocery run or the ₹5,000 you shave off your next luxury purchase, the Yureka Voucher Hub is where your strategy meets the real world. No waiting for billing cycles. No cryptic redemption portals. Just pure, instant value. 
                            </p>
                        </div>
                        <div className="mt-12 bg-black text-white p-8 flex flex-col md:flex-row justify-between items-center gap-8">
                             <div>
                                <h3 className="text-2xl font-serif font-bold mb-2 tracking-tight">Ready to optimize?</h3>
                                <p className="font-serif italic opacity-60 text-sm">Join 10,000+ high-performance spenders today.</p>
                             </div>
                             <button className="bg-clay text-white px-8 py-4 font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer">
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