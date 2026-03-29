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
                <span>www.jupyter.credit</span>
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span>Price: Free</span>
            </div>
            {/* Masthead */}
            <div className="py-2 text-center relative">
                <h1 className="font-blackletter text-4xl md:text-6xl lg:text-[5rem] leading-none text-black">Jupyter.credit</h1>
            </div>
            {/* Categories */}
            <div className="border-t-2 border-b border-black py-1.5 flex justify-center flex-wrap gap-4 md:gap-8 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-black">
                <span className="cursor-pointer hover:text-teal">AI Match</span>
                <span className="cursor-pointer hover:text-teal">Rewards</span>
                <span className="cursor-pointer hover:text-teal">Rules</span>
                <span className="cursor-pointer hover:text-teal">Money</span>
                <span className="cursor-pointer hover:text-teal">Tech</span>
                <span className="cursor-pointer hover:text-teal">Security</span>
                <span className="cursor-pointer hover:text-teal">Vouchers</span>
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
                     <h5 className="font-bold text-xs uppercase mb-1">Jupyter.credit</h5>
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
                     <h3 className="font-serif text-2xl font-bold leading-tight mb-3">Jupyter+: Better Shopping</h3>
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

    </div>
  );
};

export default OurStory;