import React from 'react';
import { motion } from 'motion/react';

const REWARDS = [
  {
    id: 1,
    logo: '/logos/atmos.png',
    tag: 'Smarter Shopping Spends',
    highlight: 'Saving upto 20%',
    text: 'on Myntra and Nykaa orders just by using the right credit card combined with affiliate tools.',
    color: 'from-pink-500/10 to-transparent',
    glow: 'group-hover:shadow-pink-500/10',
  },
  {
    id: 2,
    logo: '/logos/aerclub.png',
    tag: 'Smarter Travel Spends',
    highlight: 'Saving upto 20%',
    text: 'on Indigo tickets just by using the right credit card combined with airline membership programmes.',
    color: 'from-sky-500/10 to-transparent',
    glow: 'group-hover:shadow-sky-500/10',
  },
  {
    id: 3,
    logo: '/logos/itc.png',
    tag: 'Smarter Dining Spends',
    highlight: 'Saving upto 30%',
    text: 'on Restaurant Bills just by using the right credit card with dining programs like EazyDiner.',
    color: 'from-orange-500/10 to-transparent',
    glow: 'group-hover:shadow-orange-500/10',
  },
  {
    id: 4,
    logo: '/assets/banks/sbi.png',
    tag: 'Smarter Business Spends',
    highlight: 'Saving upto 16.67%',
    text: 'on Tax payments just by using the right business credit cards with max benefit redemption options.',
    color: 'from-emerald-500/10 to-transparent',
    glow: 'group-hover:shadow-emerald-500/10',
  },
  {
    id: 5,
    logo: '/logos/accor.png',
    tag: 'Smarter Hotel Spends',
    highlight: 'Unlock free nights',
    text: 'on your stays at Accor Hotels by using the right credit card, the most rewarding redemption options and transfer bonuses.',
    color: 'from-amber-500/10 to-transparent',
    glow: 'group-hover:shadow-amber-500/10',
  },
];

const FeaturedRewards: React.FC = () => {
  return (
    <section className="relative bg-cream py-24 md:py-36 border-t border-white/5 overflow-hidden">
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />
      {/* Glow center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-clay/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block text-clay text-[10px] font-black uppercase tracking-[0.5em] mb-5">
            Intelligence-Driven Savings
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading text-white tracking-tighter leading-[0.95] uppercase mb-6">
            Featured <span className="text-clay">Rewards</span>
          </h2>
          <p className="text-white/40 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            The right card, matched to the right category, unlocks compounding rewards you'd never find on your own.
          </p>
        </motion.div>

        {/* Cards Grid — 3 top, 2 bottom centered */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          {REWARDS.slice(0, 3).map((r, i) => (
            <RewardCard key={r.id} reward={r} delay={i * 0.1} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto lg:max-w-none lg:grid-cols-2 lg:w-2/3 lg:mx-auto">
          {REWARDS.slice(3).map((r, i) => (
            <RewardCard key={r.id} reward={r} delay={(i + 3) * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface Reward {
  id: number;
  logo: string;
  tag: string;
  highlight: string;
  text: string;
  color: string;
  glow: string;
}

const RewardCard: React.FC<{ reward: Reward; delay: number }> = ({ reward, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -6, scale: 1.02 }}
    className={`group relative bg-white/[0.03] backdrop-blur-xl border border-white/8 rounded-[2.5rem] p-8 flex flex-col items-center text-center cursor-default transition-all duration-500 hover:border-white/20 shadow-xl hover:shadow-2xl ${reward.glow}`}
  >
    {/* Gradient wash */}
    <div className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-b ${reward.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

    {/* Logo */}
    <div className="relative z-10 w-24 h-24 mb-6 flex items-center justify-center">
      <img
        src={reward.logo}
        alt={reward.tag}
        className="w-full h-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
    </div>

    {/* Tag */}
    <p className="relative z-10 text-[11px] font-black uppercase tracking-[0.3em] text-white/50 mb-3 group-hover:text-white/70 transition-colors">
      {reward.tag}
    </p>

    {/* Highlight */}
    <p className="relative z-10 text-white text-sm font-bold mb-2">
      <span className="text-clay">{reward.highlight}</span>
    </p>

    {/* Description */}
    <p className="relative z-10 text-white/40 text-xs leading-relaxed group-hover:text-white/60 transition-colors">
      {reward.text}
    </p>

    {/* Bottom glow line */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-clay/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full" />
  </motion.div>
);

export default FeaturedRewards;
