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
    description: 'Your personal financial intelligence officer. Get instant audits on credit features, merchant exclusions, and hidden arbitrage strategies.',
    gradient: 'from-clay/20 via-transparent to-transparent',
    iconBg: 'bg-clay/10 text-clay',
    preview: (
      <div className="w-full rounded-2xl bg-gradient-to-b from-[#0d0d0d] to-[#050505] border border-white/10 p-4 text-left space-y-3 relative overflow-hidden shadow-2xl">
        <motion.div 
          animate={{ y: [10, 0], opacity: [0, 1] }} 
          transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 4 }}
          className="flex gap-2 items-start"
        >
          <div className="w-5 h-5 rounded-full bg-clay/20 shrink-0 flex items-center justify-center"><Bot size={10} className="text-clay" /></div>
          <div className="bg-[#141414] border border-white/5 text-white text-[10px] px-3.5 py-2 rounded-2xl rounded-tl-none font-medium shadow-md">Insurance on Atlas?</div>
        </motion.div>
        <motion.div 
          animate={{ y: [10, 0], opacity: [0, 1] }} 
          transition={{ duration: 0.4, delay: 2, repeat: Infinity, repeatDelay: 4 }}
          className="flex gap-2 items-start justify-end"
        >
          <div className="bg-clay/10 border border-clay/25 text-clay text-[10px] px-3.5 py-2 rounded-2xl rounded-tr-none font-semibold shadow-md shadow-clay/5">Use APay vouchers!</div>
        </motion.div>
      </div>
    ),
  },
  {
    icon: CreditCard,
    title: 'Find Your Perfect Card',
    sub: 'Discover →',
    subLink: '/cards',
    description: 'Discovery engine for high-yield financial instruments. Filter by systematic ROI, travel arbitrage, and elite lifestyle perks.',
    gradient: 'from-blue-500/10 via-transparent to-transparent',
    iconBg: 'bg-blue-500/10 text-blue-400',
    preview: (
      <div className="w-full rounded-2xl bg-gradient-to-b from-[#0d0d0d] to-[#050505] border border-white/10 overflow-hidden py-4 shadow-2xl">
        {/* Row 1: Left to Right */}
        <div className="flex gap-3 animate-marquee whitespace-nowrap mb-3 px-2 will-change-transform" style={{ animationDirection: 'reverse', animationDuration: '25s' }}>
           {[1,2,3,4,5,6].map((n, i) => (
             <div key={i} className="bg-white/5 border border-white/10 rounded-xl w-11 h-11 shrink-0 flex items-center justify-center p-2 shadow-lg backdrop-blur-md hover:border-white/20 transition-colors">
               <img src={`/assets/banks/${['hdfc','sbi','axis','amex'][i%4]}.png`} alt="" className="w-full h-full object-contain filter brightness-110" loading="lazy" />
             </div>
           ))}
        </div>
        {/* Row 2: Right to Left */}
        <div className="flex gap-3 animate-marquee whitespace-nowrap px-2 will-change-transform" style={{ animationDuration: '30s' }}>
           {[1,2,3,4,5,6].map((n, i) => (
             <div key={i} className="bg-white/5 border border-white/10 rounded-xl w-11 h-11 shrink-0 flex items-center justify-center p-2 shadow-lg backdrop-blur-md hover:border-white/20 transition-colors">
               <img src={`/assets/banks/${['icici','kotak','yesbank','idfc'][i%4]}.png`} alt="" className="w-full h-full object-contain filter brightness-110" loading="lazy" />
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
    description: 'Bypass marketing PDFs. Access deep audits on real-world benefits, exclusion triggers, and complex reward structures.',
    gradient: 'from-purple-500/10 via-transparent to-transparent',
    iconBg: 'bg-purple-500/10 text-purple-400',
    preview: (
      <div className="w-full rounded-2xl bg-gradient-to-b from-[#0d0d0d] to-[#050505] border border-white/10 p-4 space-y-3 relative overflow-hidden group shadow-2xl">
        {/* Scanning Line Effect */}
        <motion.div 
          animate={{ top: ['0%', '100%', '0%'] }} 
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-clay to-transparent shadow-[0_0_15px_#34d399] z-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-clay/0 via-clay/5 to-clay/0 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {['Lounge Access', 'Rewards Delta', 'Exclusion Risk'].map((item, i) => (
          <div key={i} className="space-y-1.5 relative z-10">
            <div className="flex justify-between text-[10px] text-white/90 uppercase tracking-widest font-semibold">
              <span>{item}</span>
              <span className="text-clay font-mono text-[9px] font-bold">{[95, 84, 12][i]}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: ['0%', `${[95, 84, 12][i]}%`] }} 
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
                className="h-full bg-clay rounded-full shadow-[0_0_8px_#34d399]" 
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
    description: 'Project your systematic reward yield. Know exactly how much financial delta each instrument adds to your portfolio.',
    gradient: 'from-amber-500/10 via-transparent to-transparent',
    iconBg: 'bg-amber-500/10 text-amber-400',
    preview: (
      <div className="w-full rounded-2xl bg-gradient-to-b from-[#0d0d0d] to-[#050505] border border-white/10 p-5 flex flex-col justify-center items-center gap-2 overflow-hidden shadow-2xl">
        <span className="text-[11px] text-white/80 font-bold uppercase tracking-widest mb-1">Estimated Savings</span>
        <div className="text-3xl font-heading font-black text-white tracking-tighter tabular-nums flex items-baseline drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
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
        <span className="text-[9px] uppercase tracking-wider text-white/40 font-mono">Based on ₹1.2L Spend/mo</span>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
           <motion.div 
             animate={{ scaleX: [0, 1] }} 
             transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
             className="h-full bg-clay rounded-full origin-left shadow-[0_0_8px_#34d399]" 
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
    description: 'Institutional-grade comparison engine. Rank your top picks by net effective yield, fees, and reward velocity.',
    gradient: 'from-cyan-500/10 via-transparent to-transparent',
    iconBg: 'bg-cyan-500/10 text-cyan-400',
    preview: (
      <div className="w-full rounded-2xl bg-gradient-to-b from-[#0d0d0d] to-[#050505] border border-white/10 p-4 relative overflow-hidden h-[120px] flex items-center justify-center">
        {/* Card 1 (HDFC) */}
        <motion.div 
          animate={{ rotate: [-8, -6, -8], x: [-20, -15, -20] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          className="absolute left-6 w-36 h-20 bg-gradient-to-br from-indigo-950 via-[#0c1844] to-slate-950 border border-white/10 rounded-xl p-3 shadow-2xl flex flex-col justify-between select-none"
        >
          <div className="flex justify-between items-start">
            <span className="text-[8px] font-black uppercase text-white/80 tracking-wider">HDFC Infinia</span>
            <div className="w-4 h-3 bg-amber-500/20 border border-amber-500/30 rounded-sm" />
          </div>
          <span className="text-[9px] font-black text-clay uppercase tracking-widest">3.3% Yield</span>
        </motion.div>
        {/* VS Badge */}
        <div className="absolute z-20 w-8 h-8 rounded-full bg-clay text-black flex items-center justify-center font-serif italic text-xs font-black shadow-2xl border border-black">VS</div>
        {/* Card 2 (Axis) */}
        <motion.div 
          animate={{ rotate: [8, 6, 8], x: [20, 15, 20] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          className="absolute right-6 w-36 h-20 bg-gradient-to-br from-purple-950 via-[#180b2c] to-zinc-950 border border-white/10 rounded-xl p-3 shadow-2xl flex flex-col justify-between select-none"
        >
          <div className="flex justify-between items-start">
            <span className="text-[8px] font-black uppercase text-white/80 tracking-wider">Axis Magnus</span>
            <div className="w-4 h-3 bg-amber-500/20 border border-amber-500/30 rounded-sm" />
          </div>
          <span className="text-[9px] font-black text-clay uppercase tracking-widest">4.8% Yield</span>
        </motion.div>
      </div>
    ),
  },
  {
    icon: Newspaper,
    title: 'Card News',
    sub: 'Read →',
    subLink: '/blogs',
    description: 'Real-time intelligence on reward devaluations, new arbitrage opportunities, and elite credit market shifts.',
    gradient: 'from-rose-500/10 via-transparent to-transparent',
    iconBg: 'bg-rose-500/10 text-rose-400',
    preview: (
      <div className="w-full rounded-2xl bg-gradient-to-b from-[#0d0d0d] to-[#050505] border border-white/10 p-3.5 relative overflow-hidden h-[120px] flex flex-col gap-2 shadow-2xl text-left">
        <div className="flex items-center justify-between border-b border-white/5 pb-1">
          <span className="text-[8px] text-white/40 uppercase tracking-widest font-mono">Live Intel Feed</span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        </div>
        <div className="flex-1 overflow-hidden relative">
          <motion.div 
            animate={{ y: [0, -75] }} 
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="space-y-2 absolute w-full"
          >
            {[
              { tag: 'DEVALUED', title: 'HDFC Atlas Miles', time: '10m ago', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
              { tag: 'ARBITRAGE', title: 'APay Voucher 5%', time: '1h ago', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
              { tag: 'UPDATED', title: 'SBI Cashback Cap', time: '3h ago', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
              { tag: 'LAUNCHED', title: 'Amex Gold Points', time: '5h ago', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
            ].map((news, i) => (
              <div key={i} className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`text-[6px] font-black px-1.5 py-0.5 rounded border tracking-wider ${news.color}`}>{news.tag}</span>
                  <span className="text-[9px] text-white font-medium truncate">{news.title}</span>
                </div>
                <span className="text-[7px] text-white/40 font-mono whitespace-nowrap">{news.time}</span>
              </div>
            ))}
          </motion.div>
        </div>
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
          How Yureka <span className="text-clay relative">Helps?<span className="absolute -bottom-1.5 left-0 w-full h-[3px] bg-clay/30 rounded-full" /></span>
        </h2>
        <p className="text-white/85 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
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
                  <h3 className="text-white font-bold text-[15px] leading-tight group-hover:text-clay transition-colors whitespace-normal">
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
              <p className="relative z-10 text-white/85 text-[13px] leading-relaxed group-hover:text-white transition-colors -mt-2 font-medium">
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
