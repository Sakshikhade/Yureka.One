import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Card } from '../types';
import { Star, TrendingUp, ArrowUpRight, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import ImageWithLoader from './ImageWithLoader';

interface RentalProtectionProps {
  cards: Card[];
}

const generateSlug = (name: string, bank: string) =>
  `${name}-${bank}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const RentalProtection: React.FC<RentalProtectionProps> = ({ cards }) => {
  // Always pull these specific 4 elite cards if they exist, otherwise use fallbacks
  const targetIssuers = ['ICICI', 'Axis', 'Axis', 'HDFC'];
  const targetNames = ['Emeralde Private', 'Magnus', 'Atlas', 'Diners Club Black'];

  const displayCards = useMemo(() => {
    // Attempt to find the specific cards in the pool
    const found = targetNames.map((name, i) => {
      return cards.find(c => 
        c.name.toLowerCase().includes(name.toLowerCase()) && 
        (c.issuer?.toLowerCase().includes(targetIssuers[i].toLowerCase()) || c.bank?.toLowerCase().includes(targetIssuers[i].toLowerCase()))
      );
    }).filter(Boolean);

    // If we don't find all 4, we use the ones we found + whatever is available to make it 4
    if (found.length < 4) {
      const remaining = cards.filter(c => !found.includes(c));
      return [...found, ...remaining].slice(0, 4);
    }
    return found;
  }, [cards]);

  // If no cards are available at all (still loading or empty), we show nothing or skeleton
  if (displayCards.length === 0) return null;

  return (
    <section className="bg-[#0a0a0a] py-16 md:py-20 px-6 relative overflow-hidden glass-shine-container">
      <div className="absolute inset-0 glass-dark opacity-95" />
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px)', backgroundSize: '120px 100%' }}
      />

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#34d399]/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-5 mb-10 md:mb-12 max-w-4xl"
        >
          <p className="text-[#34d399] text-[10px] md:text-xs font-bold uppercase tracking-[0.4em]">
            YOU INVESTED CRORES INTO{' '}
            <span className="text-white border-b border-[#34d399] pb-0.5">THAT HOME</span>
          </p>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading text-white tracking-tighter leading-[0.95] uppercase">
            SECURE YOUR ASSET. <br/>MULTIPLY YOUR YIELD.
          </h2>

          <p className="text-white/40 text-sm md:text-base font-sans max-w-2xl mx-auto leading-relaxed">
            Secured maps your real estate portfolio to the world's most powerful credit engines. We identify the elite financial instruments that protect your cashflow and unlock hidden yield within your rental assets.
          </p>
        </motion.div>

        {/* Card List (Image 2 Redesign) */}
        <div className="w-full space-y-6 mb-12">
          {displayCards.map((card, i) => {
            const slug = card.slug || generateSlug(card.name, card.bank || card.issuer || '');
            return (
              <motion.div
                key={card.id || i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="group relative"
              >
                <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-5 md:p-8 hover:bg-white/[0.05] hover:border-[#34d399]/30 transition-all duration-500 overflow-hidden shadow-2xl">
                  
                  {/* Top Row: Visual & Quick Info */}
                  <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start mb-8">
                    {/* Card Visual */}
                    <div className="w-full lg:w-72 shrink-0 aspect-[1.6/1] rounded-2xl overflow-hidden bg-black/40 border border-white/5 relative group-hover:border-[#34d399]/20 transition-all">
                      <img 
                        src={card.image} 
                        alt={card.name} 
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
                    </div>

                    {/* Middle: Title & Tags */}
                    <div className="flex-1 text-left">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-amber-500/20">
                          Premium <Star size={10} />
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-blue-500/20">
                          Travel
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-[#34d399]/10 text-[#34d399] text-[9px] font-black uppercase tracking-widest rounded-full border border-[#34d399]/20">
                          Lounge Access
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-heading font-black text-white leading-tight uppercase tracking-tighter mb-2 group-hover:text-[#34d399] transition-colors">
                        {card.name}
                      </h3>
                      <p className="text-white/40 text-xs font-mono uppercase tracking-[0.2em]">
                        {card.issuer || card.bank} — Protocol ID: {card.id?.slice(0,8).toUpperCase() || 'ELITE-99'}
                      </p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col gap-3 w-full lg:w-64 shrink-0">
                      <Link 
                        to={`/cards/${slug}`}
                        className="w-full bg-[#34d399] text-[#0a0a0a] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-[0_10px_20px_rgba(52,211,153,0.1)]"
                      >
                        Read More <ArrowUpRight size={14} />
                      </Link>
                      <Link 
                        to="/yureka-ai"
                        className="w-full bg-white/5 border border-white/10 text-white/60 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                      >
                        Ask AI <TrendingUp size={14} />
                      </Link>
                      <button className="text-[9px] text-white/20 hover:text-white/40 transition-colors uppercase tracking-widest font-bold">
                        Report data issue
                      </button>
                    </div>
                  </div>

                  {/* Bottom Row: Data Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pt-8 border-t border-white/10">
                    <div className="space-y-1.5">
                      <span className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-black">Intro Offer</span>
                      <p className="text-[10px] font-bold text-white/80 leading-snug line-clamp-2 italic font-serif">{card.intro_offer || 'Elite Welcome Rewards'}</p>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-black">Annual Fees</span>
                      <p className="text-sm font-black text-white">₹{String(card.annual_fee ?? '0').replace(/[^0-9]/g, '') || '0'} <span className="text-[9px] text-white/20 font-medium">+GST</span></p>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-black">Joining Fees</span>
                      <p className="text-sm font-black text-white">₹{String(card.joining_fee || card.annual_fee ?? '0').replace(/[^0-9]/g, '') || '0'} <span className="text-[9px] text-white/20 font-medium">+GST</span></p>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-black">Reward Rate</span>
                      <p className="text-sm font-black text-[#34d399]">{card.rewards_rate || '3.33% → 33%'}</p>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-black">Elite Rating</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-white">{card.elite_rating || card.rating || '4.5'}</span>
                        <Star size={12} className="text-[#34d399] fill-[#34d399]" />
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            to="/cards"
            className="inline-block bg-[#34d399] text-[#0a0a0a] px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl hover:shadow-[#34d399]/20 transition-all duration-300"
          >
            Explore Full Catalog →
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default RentalProtection;
