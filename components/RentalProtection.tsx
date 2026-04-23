import React from 'react';
import { motion } from 'motion/react';
import { Shield, Home, Key, Gauge } from 'lucide-react';

const PROTECTION_CARDS = [
  {
    title: "Zero-Cost Vacancy Cover",
    icon: Shield,
    delay: 0.1
  },
  {
    title: "Zero-cost tenant background verification",
    icon: Home,
    delay: 0.2
  },
  {
    title: "Loan Against Rental Income",
    icon: Key,
    delay: 0.3
  },
  {
    title: "Property Damage Cover",
    icon: Gauge,
    delay: 0.4
  }
];

const RentalProtection: React.FC = () => {
  return (
    <section className="bg-[#141414] py-32 px-6 relative overflow-hidden">
      {/* Background Vertical Grid Lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px)', backgroundSize: '120px 100%' }} 
      />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
        
        {/* Dotted House Illustration (Simplified Vector Approximation) */}
        <div className="mb-12 opacity-40">
           <svg width="180" height="150" viewBox="0 0 180 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M90 20L150 70V130H30V70L90 20Z" stroke="white" strokeWidth="1" strokeDasharray="3 3"/>
              <rect x="75" y="100" width="30" height="30" stroke="white" strokeWidth="1" strokeDasharray="2 2"/>
              <circle cx="90" cy="50" r="10" stroke="white" strokeWidth="1" strokeDasharray="2 2"/>
              <path d="M10 70L90 10L170 70" stroke="white" strokeWidth="1" strokeDasharray="3 3"/>
           </svg>
        </div>

        <div className="space-y-6 mb-24">
          <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em]">
            YOU INVESTED CRORES INTO <span className="text-white border-b border-[#047857] pb-0.5">THAT HOME</span>
          </p>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading text-white tracking-tighter leading-[0.95] max-w-4xl">
            Yet, your rental income is just one event away from disruption
          </h2>

          <p className="text-white/40 text-sm md:text-base font-sans max-w-2xl mx-auto leading-relaxed">
            Secured is a protection stack built around your rental asset. It starts with vacancy cover today and expands into smarter tools that future-proof your rental income for whatever comes next.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-24">
           {PROTECTION_CARDS.map((card, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ 
                 opacity: 1, 
                 y: 0,
                 rotate: [
                   (i - 1.5) * 2 - 1.5, // Start slightly left of center
                   (i - 1.5) * 2 + 1.5, // Swing right
                   (i - 1.5) * 2 - 1.5  // Swing back left
                 ]
               }}
               viewport={{ once: true }}
               transition={{ 
                 opacity: { delay: card.delay, duration: 0.8 },
                 y: { delay: card.delay, duration: 0.8 },
                 rotate: {
                   delay: card.delay + 0.8,
                   duration: 4 + Math.random() * 2, // Varied speeds for organic feel
                   repeat: Infinity,
                   ease: "easeInOut"
                 }
               }}
               style={{ 
                 transformOrigin: "32px 32px", // Pivot exactly on the indicator dot
                 rotate: `${(i - 1.5) * 2}deg` 
               }} 
               className="group relative"
             >
               {/* Serrated Tape/Header */}
               <div className="absolute top-0 left-0 right-0 h-3 bg-[#141414] z-20 overflow-hidden flex">
                  {[...Array(40)].map((_, j) => (
                    <div key={j} className="w-1.5 h-1.5 bg-[#141414] rounded-full -translate-y-1/2 border border-white/5" />
                  ))}
               </div>

               <div className="bg-[#1a1a1a] rounded-2xl p-8 pt-16 min-h-[360px] flex flex-col items-center justify-between border border-white/5 hover:border-[#047857]/40 transition-all duration-700 relative overflow-hidden group-hover:bg-[#1f1f1f]">
                 
                 {/* Top Indicator Dot (The "Nail") */}
                 <div className="absolute top-8 left-8 w-2.5 h-2.5 rounded-full bg-[#047857] shadow-[0_0_15px_#047857] z-30" />

                 {/* Tactical Icon Wrapper */}
                 <div className="relative mb-8">
                    <div className="absolute inset-0 bg-[#047857]/20 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 w-20 h-20 border border-white/5 rounded-full flex items-center justify-center group-hover:border-[#047857]/30 transition-colors">
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            {/* Dotted Starburst logic */}
                            <div className="w-10 h-px bg-[#047857]" />
                            <div className="h-10 w-px bg-[#047857]" />
                        </div>
                        <card.icon className="text-[#047857] w-8 h-8 z-20 group-hover:scale-110 transition-transform" strokeWidth={1} />
                    </div>
                 </div>

                 <h3 className="text-white/40 text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] leading-relaxed text-center group-hover:text-white/80 transition-colors">
                    {card.title}
                 </h3>

                 {/* Bottom ID label */}
                 <div className="mt-8 text-[8px] font-mono text-white/10 uppercase tracking-widest">
                    PROT.V2.{i+1}00
                 </div>
               </div>
             </motion.div>
           ))}
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-black px-12 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] shadow-2xl hover:bg-[#047857] hover:text-white transition-all"
        >
          Get Started With Secured →
        </motion.button>

      </div>
    </section>
  );
};

export default RentalProtection;
