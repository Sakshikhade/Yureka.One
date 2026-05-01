import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Bot, CreditCard, ScanLine, Calculator, ArrowRightLeft, Newspaper, ArrowUpRight } from 'lucide-react';

const FEATURES = [
  {
    icon: Bot,
    title: 'Ask AI',
    sub: 'Try Now →',
    subLink: '/yureka-ai',
    description: 'Your personal credit card guru. Instantly get answers on features, exclusions, hacks, and the best ways to earn.',
    gradient: 'from-[#34d399]/20 via-transparent to-transparent',
    iconBg: 'bg-[#34d399]/10 text-[#34d399]',
    preview: (
      <div className="w-full rounded-2xl bg-[#0d0d0d] border border-white/5 p-4 text-left space-y-2">
        <div className="flex gap-2 items-start">
          <div className="w-6 h-6 rounded-full bg-[#34d399]/20 shrink-0 flex items-center justify-center"><Bot size={12} className="text-[#34d399]" /></div>
          <div className="bg-[#34d399]/10 text-[#34d399] text-[10px] px-3 py-1.5 rounded-xl rounded-tl-none leading-relaxed">Insurance spends on Axis Atlas? Although Insurance spends are excluded, you can purchase Amazon Pay vouchers and pay with them.</div>
        </div>
        <div className="flex gap-2 items-start justify-end">
          <div className="bg-white/5 text-white/60 text-[10px] px-3 py-1.5 rounded-xl rounded-tr-none">Which card for IndiGo?</div>
        </div>
      </div>
    ),
  },
  {
    icon: CreditCard,
    title: 'Find Your Perfect Card',
    sub: 'Discover →',
    subLink: '/cards',
    description: 'Browse top cards by category. From travel to cashback — discover what fits you best.',
    gradient: 'from-blue-500/10 via-transparent to-transparent',
    iconBg: 'bg-blue-500/10 text-blue-400',
    preview: (
      <div className="w-full rounded-2xl bg-[#0d0d0d] border border-white/5 overflow-hidden">
        <div className="grid grid-cols-3 gap-1 p-2">
          {['/assets/banks/hdfc.png', '/assets/banks/sbi.png', '/assets/banks/axis.png', '/assets/banks/icici.png', '/assets/banks/kotak.png', '/assets/banks/amex.png'].map((src, i) => (
            <div key={i} className="bg-white/5 rounded-xl aspect-video flex items-center justify-center p-1.5">
              <img src={src} alt="" className="w-full h-full object-contain opacity-70" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: ScanLine,
    title: 'Credit Card Deep Dive',
    sub: null,
    subLink: '/cards',
    description: 'Skip the fine print. Get straight to the key benefits, offers, and hidden terms — clearly laid out.',
    gradient: 'from-purple-500/10 via-transparent to-transparent',
    iconBg: 'bg-purple-500/10 text-purple-400',
    preview: (
      <div className="w-full rounded-2xl bg-[#0d0d0d] border border-white/5 p-3 space-y-1.5">
        {['Lounge Access', 'Cashback Rate', 'Annual Fee Waiver', 'Reward Points', 'Milestone Benefits'].map((item, i) => (
          <div key={i} className="flex items-center justify-between text-[9px]">
            <span className="text-white/40">{item}</span>
            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#34d399] rounded-full" style={{ width: `${60 + i * 8}%` }} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Calculator,
    title: 'Rewards Calculator',
    sub: null,
    subLink: '/rewards-calculator',
    description: 'Estimate your real-world earnings. Know exactly how much value each card brings you.',
    gradient: 'from-amber-500/10 via-transparent to-transparent',
    iconBg: 'bg-amber-500/10 text-amber-400',
    preview: (
      <div className="w-full rounded-2xl bg-[#0d0d0d] border border-white/5 p-3">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[9px] text-white/30 uppercase tracking-wider">Rewards</span>
          <span className="text-[9px] text-white/30 uppercase tracking-wider">Redemptions</span>
          <span className="text-[9px] text-white/30 uppercase tracking-wider">Return Rate</span>
        </div>
        {['HDFC', 'SBI', 'Axis'].map((bank, i) => (
          <div key={i} className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0">
            <img src={`/assets/banks/${bank.toLowerCase()}.png`} alt="" className="w-4 h-4 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span className="text-[9px] text-white/50 flex-1">{bank}</span>
            <span className="text-[9px] text-[#34d399] font-bold">{['₹15.4k', '₹12.1k', '₹18.7k'][i]}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: ArrowRightLeft,
    title: 'Compare Cards',
    sub: 'Compare →',
    subLink: '/cards',
    description: 'Put your top picks head-to-head. See which card wins based on features, rewards, and more.',
    gradient: 'from-cyan-500/10 via-transparent to-transparent',
    iconBg: 'bg-cyan-500/10 text-cyan-400',
    preview: (
      <div className="w-full rounded-2xl bg-[#0d0d0d] border border-white/5 p-3 space-y-1.5">
        <div className="grid grid-cols-2 gap-2 mb-2">
          {['/assets/banks/hdfc.png', '/assets/banks/axis.png'].map((src, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-2 flex items-center justify-center">
              <img src={src} alt="" className="h-5 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          ))}
        </div>
        {['Rewards', 'Lounge', 'Annual Fee'].map((label, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto_1fr] gap-1 items-center text-[9px]">
            <div className="h-1.5 bg-[#34d399]/60 rounded-full" style={{ width: ['80%', '60%', '45%'][i] }} />
            <span className="text-white/20 text-center px-1">{label}</span>
            <div className="h-1.5 bg-white/20 rounded-full ml-auto" style={{ width: ['60%', '90%', '30%'][i] }} />
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Newspaper,
    title: 'Card News & Deals',
    sub: 'Read Latest →',
    subLink: '/blogs',
    description: 'Stay updated with the latest offers, tips, and insights. Never miss a credit card trick again.',
    gradient: 'from-rose-500/10 via-transparent to-transparent',
    iconBg: 'bg-rose-500/10 text-rose-400',
    preview: (
      <div className="w-full rounded-2xl bg-[#0d0d0d] border border-white/5 p-3 space-y-2">
        {['HDFC Regalia now offers IndiGo miles', 'SBI new cashback limit change', 'Axis Atlas annual fee waiver update'].map((title, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-[#34d399] mt-1.5 shrink-0 animate-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
            <span className="text-[9px] text-white/50 leading-relaxed">{title}</span>
          </div>
        ))}
      </div>
    ),
  },
];

const HowYurekaHelps: React.FC = () => (
  <section className="relative bg-[#0a0a0a] py-16 md:py-24 border-t border-white/5 overflow-hidden">
    {/* Subtle dot grid background */}
    <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
      style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
    />

    <div className="relative z-10 max-w-6xl mx-auto px-6">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-10 md:mb-12"
      >
        <span className="inline-block text-[#34d399] text-[10px] font-black uppercase tracking-[0.5em] mb-3">
          The Full Stack
        </span>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading text-white tracking-tighter leading-[0.95] uppercase mb-4">
          How Yureka <span className="text-[#34d399]">Helps?</span>
        </h2>
        <p className="text-white/40 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Six precision tools built for one purpose — to help you make smarter financial decisions every single day.
        </p>
      </motion.div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="group relative bg-white/[0.01] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 flex flex-col gap-5 transition-all duration-700 hover:border-white/20 hover:bg-white/[0.04] overflow-hidden shadow-2xl"
            >
              {/* Gradient wash */}
              <div className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

              {/* Preview UI - Fixed height for consistency */}
              <div className="relative z-10 w-full h-[150px] flex items-center justify-center overflow-hidden">
                {f.preview}
              </div>

              {/* Icon + Title row */}
              <div className="relative z-10 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${f.iconBg}`}>
                  <Icon size={18} />
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm leading-tight group-hover:text-[#34d399] transition-colors truncate">
                    {f.title}
                  </h3>
                  {f.sub && (
                    <Link to={f.subLink} className="text-[#34d399] text-[10px] font-bold shrink-0 hover:underline flex items-center gap-0.5">
                      {f.sub} <ArrowUpRight size={10} />
                    </Link>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="relative z-10 text-white/40 text-xs leading-relaxed group-hover:text-white/60 transition-colors -mt-2">
                {f.description}
              </p>

              {/* Bottom shimmer */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#34d399]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full" />
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default HowYurekaHelps;
