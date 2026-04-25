import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Card } from '../supabase';
import { Star, TrendingUp, ArrowUpRight, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageWithLoader from './ImageWithLoader';

interface RentalProtectionProps {
  cards: Card[];
}

const generateSlug = (name: string, bank: string) =>
  `${name}-${bank}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const RentalProtection: React.FC<RentalProtectionProps> = ({ cards }) => {
  // Randomly pick 4 cards — shuffle once per mount
  const displayCards = useMemo(() => {
    const pool = cards.length >= 4 ? [...cards] : [...cards, ...cards].slice(0, 4);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 4);
  }, [cards]);

  // Subtle tilt angles for the "hanging card" effect
  const tilts = [-3, 1.5, -1, 2.5];

  return (
    <section className="bg-[#141414] py-20 md:py-28 px-6 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px)', backgroundSize: '120px 100%' }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#047857]/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-5 mb-16 md:mb-20 max-w-4xl"
        >
          <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em]">
            YOU INVESTED CRORES INTO{' '}
            <span className="text-white border-b border-[#047857] pb-0.5">THAT HOME</span>
          </p>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading text-white tracking-tighter leading-[0.95] uppercase">
            SECURE YOUR ASSET. <br/>MULTIPLY YOUR YIELD.
          </h2>

          <p className="text-white/40 text-sm md:text-base font-sans max-w-2xl mx-auto leading-relaxed">
            Secured maps your real estate portfolio to the world's most powerful credit engines. We identify the elite financial instruments that protect your cashflow and unlock hidden yield within your rental assets.
          </p>
        </motion.div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full mb-16">
          {displayCards.map((card, i) => {
            const slug = card.slug || generateSlug(card.name, card.bank || card.issuer || '');
            return (
              <motion.div
                key={card.id || i}
                initial={{ opacity: 0, y: 40, rotate: tilts[i] }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.03, rotate: 0 }}
                viewport={{ once: true }}
                transition={{
                  opacity: { delay: i * 0.12, duration: 0.7 },
                  y: { delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                  rotate: { delay: i * 0.12, duration: 0.7 },
                  hover: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                }}
                style={{ rotate: tilts[i] }}
                className="group relative"
              >
                {/* Serrated Tape Header */}
                <div className="absolute top-0 left-0 right-0 h-3 bg-[#141414] z-20 overflow-hidden flex">
                  {[...Array(40)].map((_, j) => (
                    <div key={j} className="w-1.5 h-1.5 bg-[#141414] rounded-full -translate-y-1/2 border border-white/5" />
                  ))}
                </div>

                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-[#047857]/0 group-hover:bg-[#047857]/5 transition-all duration-700 blur-xl" />

                <div className="bg-[#1a1a1a] rounded-2xl pt-12 pb-6 px-6 flex flex-col items-center border border-white/5 group-hover:border-[#047857]/30 transition-all duration-700 relative overflow-hidden">

                  {/* Indicator dot */}
                  <div className="absolute top-7 left-6 w-2.5 h-2.5 rounded-full bg-[#047857] shadow-[0_0_12px_#047857] z-30 animate-pulse" />

                  {/* Card image */}
                  <div className="w-full aspect-[1.6/1] rounded-xl overflow-hidden bg-[#242424] mb-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] group-hover:shadow-[0_30px_60px_-10px_rgba(4,120,87,0.3)] transition-all duration-700">
                    {card.image ? (
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-full object-contain p-3 transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#1f1f1f]">
                        <span className="text-white/10 text-[10px] uppercase tracking-widest">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Card info */}
                  <div className="w-full text-left space-y-1 mb-5">
                    <p className="text-[8px] font-mono text-[#047857] uppercase tracking-widest font-bold">Elite Instrument</p>
                    <h3 className="text-white text-base font-heading leading-tight uppercase">
                      {card.name}
                    </h3>
                    <p className="text-white/30 text-[9px] font-mono uppercase tracking-wider">{card.issuer || card.bank}</p>
                  </div>

                  {/* Stats */}
                  <div className="w-full space-y-3 mb-5">
                    <div className="flex justify-between items-end border-b border-white/5 pb-2">
                      <span className="text-[8px] text-white/20 uppercase tracking-[0.2em]">Yield Potential</span>
                      <span className="text-xs font-mono text-[#047857] font-bold">
                        +{card.rewards_rate || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between items-end border-b border-white/5 pb-2">
                      <span className="text-[8px] text-white/20 uppercase tracking-[0.2em]">Annual Fee</span>
                      <span className="text-xs font-mono text-white/70">
                        ₹{String(card.annual_fee ?? '0').replace(/[^0-9]/g, '') || '0'}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-[8px] text-white/20 uppercase tracking-[0.2em]">Elite Rating</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            size={8}
                            className={j < Math.floor(card.elite_rating || card.rating || 4) ? 'text-[#047857] fill-[#047857]' : 'text-white/10'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="w-full pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[7px] text-white/10 uppercase tracking-widest">Protocol ID</span>
                      <span className="text-[8px] font-mono text-white/30 tracking-widest">{card.id?.slice(0, 8).toUpperCase() || 'YR-88-SEC'}</span>
                    </div>
                    <Link
                      to={`/cards/${slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-7 h-7 rounded-lg bg-[#047857]/20 flex items-center justify-center hover:bg-[#047857] transition-colors group/btn"
                    >
                      <ArrowUpRight size={12} className="text-[#047857] group-hover/btn:text-white transition-colors" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/cards"
            className="inline-block bg-white text-black px-12 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] shadow-2xl hover:bg-[#047857] hover:text-white transition-all duration-300"
          >
            Explore Elite Catalog →
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default RentalProtection;
