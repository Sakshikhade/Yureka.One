import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const Hero: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 0 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  const bullets = [
    "Find the best way to pay before every purchase.",
    "Stack offers, gift cards, and store rewards in one flow.",
    "Redeem points where they create the highest value."
  ];

  return (
    <section id="hero" className="relative w-full flex flex-col items-center pt-2 md:pt-4 pb-6 bg-cream border-b border-white/10 overflow-hidden text-[#F2EFE9] scroll-mt-32">

        {/* Background Grid/Lines */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full border-x border-white/5 relative opacity-30">
                 <div className="absolute top-0 left-[33%] bottom-0 w-px bg-white/5 hidden lg:block"></div>
                 <div className="absolute top-0 right-[33%] bottom-0 w-px bg-white/5 hidden lg:block"></div>
            </div>
        </div>

        <div className="relative z-10 w-full px-6 flex flex-col items-center">
            
            {/* --- MAIN HEADLINE SECTION (H1 for SEO) --- */}
            <motion.div 
                initial={fadeInUp.initial}
                whileInView={fadeInUp.whileInView}
                viewport={fadeInUp.viewport}
                transition={{ ...fadeInUp.transition, delay: 0.2 }}
                className="w-full text-center mb-6 md:mb-10 px-6 pt-6"
            >
                <div className="flex justify-center items-center gap-6 mb-4 md:mb-6">
                     <div className="h-[1px] bg-white/10 w-12 md:w-24"></div>
                     <span className="text-clay font-bold text-xs uppercase tracking-[0.4em]">India’s AI-driven credit and rewards platform</span>
                     <div className="h-[1px] bg-white/10 w-12 md:w-24"></div>
                </div>
                <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-[clamp(2rem,5vw,5.5rem)] leading-[0.95] font-heading font-extrabold text-white uppercase tracking-tight">
                    Turn every swipe <br className="hidden md:block" /> into your next big experience.
                </h1>
                <p className="text-xs sm:text-base xl:text-lg font-sans font-medium text-white/95 mt-4 md:mt-6 max-w-3xl mx-auto leading-relaxed tracking-tight px-4 sm:px-0">
                    Yureka helps you earn smarter, stack offers better, and redeem rewards at maximum value — so your everyday spends can unlock flights, stays, gadgets, dining, events, and premium experiences without the usual hassle.
                </p>

                {/* Hero Bullets */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 max-w-4xl mx-auto">
                    {bullets.map((bullet, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-left bg-white/5 px-4 py-2.5 rounded-2xl border border-white/5">
                            <CheckCircle2 size={16} className="text-clay shrink-0" />
                            <span className="text-xs font-semibold text-[#FFF] tracking-wide">{bullet}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-8 md:mt-10 mb-2 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-4">
                    <Link to="/join-waitlist" className="group relative px-8 py-5 md:px-12 md:py-6 bg-white text-cream overflow-hidden rounded-full w-full sm:w-auto shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)] transition-all hover:-translate-y-1 hover:shadow-2xl text-center border border-transparent">
                        <div className="absolute inset-0 w-full h-full bg-clay/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        <span className="relative z-10 font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                            <Sparkles size={16} className="text-clay animate-pulse" /> Join the Waitlist
                        </span>
                    </Link>
                    
                    <a href="#how-it-works" className="group px-8 py-5 md:px-12 md:py-6 bg-white/5 text-[#F2EFE9] rounded-full w-full sm:w-auto border-2 border-white/10 hover:border-white/30 hover:bg-white/10 transition-all hover:-translate-y-1 text-center backdrop-blur-sm">
                        <span className="font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                            See How It Works
                        </span>
                    </a>
                </div>
                <p className="text-[9px] uppercase tracking-widest text-white/60 font-bold mt-3">
                    Join with Gmail. Get your Reward IQ. No full card number needed.
                </p>
            </motion.div>

        </div>
    </section>
  );
};

export default Hero;