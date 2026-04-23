import React from 'react';
import { motion } from 'motion/react';
import { Card } from '../supabase';
import { Star, Zap, TrendingUp, ShieldCheck } from 'lucide-react';

interface RentalProtectionProps {
  cards: Card[];
}

const RentalProtection: React.FC<RentalProtectionProps> = ({ cards }) => {
  // Select top 4 elite cards or fallback to first 4 if elites aren't marked
  const displayCards = cards
    .filter(c => c.elite_rating && c.elite_rating >= 4.5)
    .slice(0, 4);
    
  // Final fallback if no elite cards match filter
  const finalCards = displayCards.length === 4 ? displayCards : cards.slice(0, 4);

  return (
    <section className="bg-[#141414] py-32 px-6 relative overflow-hidden">
      {/* Background Vertical Grid Lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px)', backgroundSize: '120px 100%' }} 
      />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
        
        <div className="space-y-6 mb-24">
          <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em]">
            YOU INVESTED CRORES INTO <span className="text-white border-b border-[#047857] pb-0.5">THAT HOME</span>
          </p>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading text-white tracking-tighter leading-[0.95] max-w-4xl uppercase">
            SECURE YOUR ASSET. <br/>MULTIPLY YOUR YIELD.
          </h2>

          <p className="text-white/40 text-sm md:text-base font-sans max-w-2xl mx-auto leading-relaxed">
            Secured maps your real estate portfolio to the world's most powerful credit engines. We identify the elite financial instruments that protect your cashflow and unlock hidden yield within your rental assets.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-24">
           {finalCards.map((card, i) => (
             <motion.div
               key={card.id || i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ 
                 opacity: 1, 
                 y: 0,
                 rotate: [
                   (i - 1.5) * 2 - 1.5,
                   (i - 1.5) * 2 + 1.5,
                   (i - 1.5) * 2 - 1.5
                 ]
               }}
               viewport={{ once: true }}
               transition={{ 
                 opacity: { delay: i * 0.1, duration: 0.8 },
                 y: { delay: i * 0.1, duration: 0.8 },
                 rotate: {
                   delay: i * 0.1 + 0.8,
                   duration: 4 + Math.random() * 2,
                   repeat: Infinity,
                   ease: "easeInOut"
                 }
               }}
               style={{ 
                 transformOrigin: "32px 32px",
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

               <div className="bg-[#1a1a1a] rounded-2xl p-8 pt-16 min-h-[420px] flex flex-col items-center justify-between border border-white/5 hover:border-[#047857]/40 transition-all duration-700 relative overflow-hidden group-hover:bg-[#1f1f1f]">
                 
                 {/* Top Indicator Dot (The "Nail") */}
                 <div className="absolute top-8 left-8 w-2.5 h-2.5 rounded-full bg-[#047857] shadow-[0_0_15px_#047857] z-30" />

                 {/* Card Preview Branding */}
                 <div className="w-full text-left space-y-1">
                    <p className="text-[8px] font-mono text-[#047857] uppercase tracking-widest font-bold">Elite Instrument</p>
                    <h3 className="text-white text-lg font-heading leading-tight uppercase line-clamp-2">
                       {card.name}
                    </h3>
                    <p className="text-white/30 text-[9px] font-mono uppercase tracking-wider">{card.bank_name}</p>
                 </div>

                 {/* Tactical Data Preview */}
                 <div className="w-full space-y-4 my-8">
                    <div className="flex justify-between items-end border-b border-white/5 pb-2">
                        <span className="text-[8px] text-white/20 uppercase tracking-[0.2em]">Yield Potential</span>
                        <span className="text-xs font-mono text-[#047857] font-bold">+{card.yield_potential || '12.5'}%</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-white/5 pb-2">
                        <span className="text-[8px] text-white/20 uppercase tracking-[0.2em]">Security Tier</span>
                        <span className="text-xs font-mono text-white/80">Lvl.{Math.floor(card.rating || 4)}</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-[8px] text-white/20 uppercase tracking-[0.2em]">Elite Rating</span>
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, j) => (
                                <Star key={j} size={8} className={j < Math.floor(card.elite_rating || 4) ? "text-[#047857] fill-[#047857]" : "text-white/10"} />
                            ))}
                        </div>
                    </div>
                 </div>

                 <div className="w-full pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[7px] text-white/10 uppercase tracking-widest">Protocol ID</span>
                        <span className="text-[8px] font-mono text-white/30 tracking-widest">{card.id?.slice(0, 8).toUpperCase() || 'YR-88-SEC'}</span>
                    </div>
                    <TrendingUp size={14} className="text-[#047857] opacity-40" />
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
          Explore Elite Catalog →
        </motion.button>

      </div>
    </section>
  );
};

export default RentalProtection;
