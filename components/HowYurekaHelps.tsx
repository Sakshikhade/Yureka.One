import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Bot, CreditCard, ScanLine, Calculator, ArrowRightLeft, Newspaper, ArrowUpRight } from 'lucide-react';

const FEATURES = [
  {
    icon: Bot,
    title: 'Research Assistant',
    sub: 'Try Now →',
    subLink: '/yureka-ai',
    description: 'Your personal credit card expert. Instantly get answers on features, exclusions, strategies, and the best ways to save.',
    gradient: 'from-clay/20 via-transparent to-transparent',
    iconBg: 'bg-clay/10 text-clay',
    preview: (
      <div className="w-full rounded-2xl bg-white/[0.03] border border-white/5 p-4 text-left space-y-2 relative overflow-hidden">
        <motion.div 
          animate={{ y: [10, 0], opacity: [0, 1] }} 
          transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 4 }}
          className="flex gap-2 items-start"
        >
          <div className="w-5 h-5 rounded-full bg-clay/20 shrink-0 flex items-center justify-center"><Bot size={10} className="text-clay" /></div>
          <div className="bg-clay/10 text-clay text-[9px] px-3 py-1 rounded-xl rounded-tl-none">Insurance on Atlas?</div>
        </motion.div>
        <motion.div 
          animate={{ y: [10, 0], opacity: [0, 1] }} 
          transition={{ duration: 0.4, delay: 2, repeat: Infinity, repeatDelay: 4 }}
          className="flex gap-2 items-start justify-end"
        >
          <div className="bg-white/5 text-white/60 text-[9px] px-3 py-1 rounded-xl rounded-tr-none">Use APay vouchers!</div>
        </motion.div>
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
      <div className="w-full rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden py-3">
        {/* Row 1: Left to Right */}
        <div className="flex gap-2 animate-marquee whitespace-nowrap mb-2 px-2 will-change-transform" style={{ animationDirection: 'reverse', animationDuration: '25s' }}>
           {[1,2,3,4,5,6].map((n, i) => (
             <div key={i} className="bg-white rounded-lg w-10 h-10 shrink-0 flex items-center justify-center p-1.5 shadow-sm">
               <img src={`/assets/banks/${['hdfc','sbi','axis','amex'][i%4]}.png`} alt="" className="w-full h-full object-contain" loading="lazy" />
             </div>
           ))}
        </div>
        {/* Row 2: Right to Left */}
        <div className="flex gap-2 animate-marquee whitespace-nowrap px-2 will-change-transform" style={{ animationDuration: '30s' }}>
           {[1,2,3,4,5,6].map((n, i) => (
             <div key={i} className="bg-white rounded-lg w-10 h-10 shrink-0 flex items-center justify-center p-1.5 shadow-sm">
               <img src={`/assets/banks/${['icici','kotak','yesbank','idfc'][i%4]}.png`} alt="" className="w-full h-full object-contain" loading="lazy" />
             </div>
           ))}
        </div>
      </div>
    ),
  },
  {
    icon: ScanLine,
    title: 'Strategic Analysis',
    sub: null,
    subLink: '/cards',
    description: 'Skip the fine print. Get straight to the key benefits, offers, and detailed terms.',
    gradient: 'from-purple-500/10 via-transparent to-transparent',
    iconBg: 'bg-purple-500/10 text-purple-400',
    preview: (
      <div className="w-full rounded-2xl bg-white/[0.03] border border-white/5 p-3 space-y-2 relative overflow-hidden group">
        {/* Scanning Line Effect */}
        <motion.div 
          animate={{ top: ['0%', '100%', '0%'] }} 
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[2px] bg-clay shadow-[0_0_15px_#34d399] z-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-clay/0 via-clay/5 to-clay/0 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {['Lounge', 'Rewards', 'Fees'].map((item, i) => (
          <div key={i} className="space-y-1 relative z-10">
            <div className="flex justify-between text-[7px] text-white/20 uppercase tracking-widest">
              <span>{item}</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: ['0%', `${70 + i * 10}%`] }} 
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
                className="h-full bg-clay rounded-full" 
              />
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
      <div className="w-full rounded-2xl bg-white/[0.03] border border-white/5 p-4 flex flex-col justify-center items-center gap-2 overflow-hidden">
        <span className="text-[7px] text-white/20 uppercase tracking-widest mb-1">Estimated Savings</span>
        <div className="text-xl font-heading font-black text-white tracking-tighter tabular-nums flex items-baseline">
          ₹
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.span
              animate={{ count: [0, 18700] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              onUpdate={(latest) => {
                const span = document.getElementById('savings-counter');
                if (span) span.innerText = Math.round(Number(latest.count)).toLocaleString();
              }}
              id="savings-counter"
            >
              0
            </motion.span>
          </motion.span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
           <motion.div 
             animate={{ scaleX: [0, 1] }} 
             transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
             className="h-full bg-clay rounded-full origin-left" 
           />
        </div>
      </div>
    ),
  },
  {
    icon: ArrowRightLeft,
    title: 'Compare Cards',
    sub: 'Compare →',
    subLink: '/cards',
    description: 'Put your top picks head-to-head. See which card wins based on features and rewards.',
    gradient: 'from-cyan-500/10 via-transparent to-transparent',
    iconBg: 'bg-cyan-500/10 text-cyan-400',
    preview: (
      <div className="w-full rounded-2xl bg-white/[0.03] border border-white/5 p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center px-4">
          <div className="w-7 h-7 rounded-full bg-white/5 p-1.5"><img src="/assets/banks/hdfc.png" alt="" className="w-full h-full object-contain opacity-50" /></div>
          <span className="text-[8px] text-white/10 font-black italic">VS</span>
          <div className="w-7 h-7 rounded-full bg-white/5 p-1.5"><img src="/assets/banks/axis.png" alt="" className="w-full h-full object-contain opacity-50" /></div>
        </div>
        <div className="space-y-1.5">
           {[1,2].map((n, i) => (
             <div key={i} className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
               <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 2, delay: i }} className="h-full w-1/2 bg-clay rounded-full" />
             </div>
           ))}
        </div>
      </div>
    ),
  },
  {
    icon: Newspaper,
    title: 'Card News',
    sub: 'Read →',
    subLink: '/blogs',
    description: 'Stay updated with the latest offers, tips, and insights. Never miss a trick.',
    gradient: 'from-rose-500/10 via-transparent to-transparent',
    iconBg: 'bg-rose-500/10 text-rose-400',
    preview: (
      <div className="w-full rounded-2xl bg-white/[0.03] border border-white/5 p-4 relative overflow-hidden h-[80px]">
        <motion.div 
          animate={{ y: [0, -40] }} 
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="space-y-2"
        >
          {['HDFC miles update', 'SBI limit change', 'Atlas fee waiver'].map((title, i) => (
            <div key={i} className="flex gap-2 items-center">
              <div className="w-1 h-1 rounded-full bg-clay shrink-0" />
              <span className="text-[9px] text-white/20 whitespace-nowrap">{title}</span>
            </div>
          ))}
        </motion.div>
      </div>
    ),
  },
];

const HowYurekaHelps: React.FC = () => (
  <section className="relative bg-cream py-16 md:py-24 border-t border-white/5 overflow-hidden">
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
        <span className="inline-block text-clay text-[10px] font-black uppercase tracking-[0.5em] mb-3">
          The Full Stack
        </span>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading text-white tracking-tighter leading-[0.95] uppercase mb-4">
          How Yureka <span className="text-clay">Helps?</span>
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
                  <h3 className="text-white font-bold text-sm leading-tight group-hover:text-clay transition-colors truncate">
                    {f.title}
                  </h3>
                  {f.sub && (
                    <Link to={f.subLink} className="text-clay text-[10px] font-bold shrink-0 hover:underline flex items-center gap-0.5">
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
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-clay/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full" />
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default HowYurekaHelps;
