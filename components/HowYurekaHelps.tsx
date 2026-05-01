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
      <div className="w-full rounded-2xl bg-[#0d0d0d] border border-white/5 p-4 text-left space-y-2 relative overflow-hidden">
        <motion.div 
          animate={{ y: [20, 0], opacity: [0, 1] }} 
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          className="flex gap-2 items-start"
        >
          <div className="w-6 h-6 rounded-full bg-[#34d399]/20 shrink-0 flex items-center justify-center"><Bot size={12} className="text-[#34d399]" /></div>
          <div className="bg-[#34d399]/10 text-[#34d399] text-[10px] px-3 py-1.5 rounded-xl rounded-tl-none leading-relaxed">Insurance spends on Axis Atlas?</div>
        </motion.div>
        <motion.div 
          animate={{ y: [20, 0], opacity: [0, 1] }} 
          transition={{ duration: 0.5, delay: 1.5, repeat: Infinity, repeatDelay: 3 }}
          className="flex gap-2 items-start justify-end"
        >
          <div className="bg-white/5 text-white/60 text-[10px] px-3 py-1.5 rounded-xl rounded-tr-none">Use Amazon Pay vouchers!</div>
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
      <div className="w-full rounded-2xl bg-[#0d0d0d] border border-white/5 overflow-hidden py-3">
        {/* Row 1: Left to Right */}
        <div className="flex gap-2 animate-marquee whitespace-nowrap mb-2 px-2">
           {[1,2,3,4,1,2].map((n, i) => (
             <div key={i} className="bg-white/5 rounded-lg w-12 h-12 shrink-0 flex items-center justify-center p-2">
               <img src={`/assets/banks/${['hdfc','sbi','axis','amex'][i%4]}.png`} alt="" className="w-full h-full object-contain opacity-70" />
             </div>
           ))}
        </div>
        {/* Row 2: Right to Left */}
        <div className="flex gap-2 animate-marquee-reverse whitespace-nowrap px-2">
           {[1,2,3,4,1,2].map((n, i) => (
             <div key={i} className="bg-white/5 rounded-lg w-12 h-12 shrink-0 flex items-center justify-center p-2">
               <img src={`/assets/banks/${['icici','kotak','yesbank','idfc'][i%4]}.png`} alt="" className="w-full h-full object-contain opacity-70" />
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
      <div className="w-full rounded-2xl bg-[#0d0d0d] border border-white/5 p-3 space-y-2">
        {['Lounge Access', 'Rewards Rate', 'Annual Fee'].map((item, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-[8px] text-white/30 uppercase tracking-tighter">
              <span>{item}</span>
              <span>{80 + i * 5}%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                animate={{ width: ['0%', `${80 + i * 5}%`] }} 
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                className="h-full bg-[#34d399] rounded-full" 
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
      <div className="w-full rounded-2xl bg-[#0d0d0d] border border-white/5 p-4 flex flex-col justify-center items-center gap-3">
        <div className="text-center">
          <motion.span 
             animate={{ opacity: [0.5, 1, 0.5] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="text-[8px] text-white/30 uppercase tracking-[0.2em] mb-1 block"
          >
            Estimated Savings
          </motion.span>
          <div className="text-2xl font-heading font-black text-white tracking-tighter">
            ₹<motion.span 
               initial={{ children: 0 }}
               animate={{ children: 18700 }}
               transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
               // @ts-ignore
               onUpdate={(latest) => {
                 const el = document.getElementById('savings-counter');
                 if (el) el.textContent = Math.round(latest.children).toLocaleString();
               }}
            >
              <span id="savings-counter">0</span>
            </motion.span>
          </div>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
           <motion.div 
             animate={{ width: ['0%', '100%'] }} 
             transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
             className="h-full bg-[#34d399] rounded-full shadow-[0_0_10px_#34d399]" 
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
    description: 'Put your top picks head-to-head. See which card wins based on features, rewards, and more.',
    gradient: 'from-cyan-500/10 via-transparent to-transparent',
    iconBg: 'bg-cyan-500/10 text-cyan-400',
    preview: (
      <div className="w-full rounded-2xl bg-[#0d0d0d] border border-white/5 p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center px-2">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-8 h-8 rounded-full bg-white/5 p-1.5 flex items-center justify-center">
            <img src="/assets/banks/hdfc.png" alt="" className="w-full h-full object-contain" />
          </motion.div>
          <span className="text-[10px] text-white/20 font-black tracking-widest italic">VS</span>
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 1 }} className="w-8 h-8 rounded-full bg-white/5 p-1.5 flex items-center justify-center">
            <img src="/assets/banks/axis.png" alt="" className="w-full h-full object-contain" />
          </motion.div>
        </div>
        <div className="space-y-2">
           {[1,2].map((n, i) => (
             <div key={i} className="flex items-center gap-2 h-1.5">
               <motion.div animate={{ width: i === 0 ? ['40%', '90%', '40%'] : ['90%', '40%', '90%'] }} transition={{ repeat: Infinity, duration: 3 }} className="h-full bg-[#34d399] rounded-full" />
               <motion.div animate={{ width: i === 0 ? ['60%', '10%', '60%'] : ['10%', '60%', '10%'] }} transition={{ repeat: Infinity, duration: 3 }} className="h-full bg-white/10 rounded-full" />
             </div>
           ))}
        </div>
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
      <div className="w-full rounded-2xl bg-[#0d0d0d] border border-white/5 p-4 relative overflow-hidden">
        <motion.div 
          animate={{ y: [0, -80] }} 
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="space-y-4"
        >
          {['HDFC Regalia miles update', 'SBI cashback limit change', 'Axis Atlas fee waiver', 'Amex Platinum rewards', 'Kotak 811 benefits'].map((title, i) => (
            <div key={i} className="flex gap-2 items-center">
              <div className="w-1 h-1 rounded-full bg-[#34d399] shrink-0" />
              <span className="text-[10px] text-white/40 whitespace-nowrap">{title}</span>
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {['HDFC Regalia miles update', 'SBI cashback limit change'].map((title, i) => (
            <div key={i+10} className="flex gap-2 items-center">
              <div className="w-1 h-1 rounded-full bg-[#34d399] shrink-0" />
              <span className="text-[10px] text-white/40 whitespace-nowrap">{title}</span>
            </div>
          ))}
        </motion.div>
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#0d0d0d] to-transparent z-10" />
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#0d0d0d] to-transparent z-10" />
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
