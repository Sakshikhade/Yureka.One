import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Search, Zap, ArrowRight, ShieldCheck, Cpu, Globe, MessageSquare, Layers, Sparkles } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    tag: 'Pulse V2',
    title: 'Yureka AI',
    description: 'A neural layer for your wallet. It decodes thousands of rewards rules in milliseconds to find your optimal swipe.',
    cta: 'Join Internal Test',
    availability: 'Limited Access Nodes',
    side: 'left'
  },
  {
    id: 2,
    tag: 'Yield Stack',
    title: 'RewardX',
    description: 'The definitive voucher engine. Stack institutional discounts with card multipliers for double-digit savings.',
    cta: 'Join Internal Test',
    availability: 'Limited Access Nodes',
    side: 'right'
  },
  {
    id: 3,
    tag: 'Ghostwriter',
    title: 'Browser Extension',
    description: 'Your checkout companion. It lives on your toolbar and applies the magic moment you hit any payment page.',
    cta: 'Join Internal Test',
    availability: 'Limited Access Nodes',
    side: 'left'
  },
  {
    id: 4,
    tag: 'The Registry',
    title: 'Waitlist',
    description: 'Secure your spot in the ecosystem. We are rolling out access in controlled nodes to maintain protocol integrity.',
    cta: 'Join Waitlist',
    availability: 'Open Protocol',
    side: 'right'
  }
];

// ── UI Components for the "Phones" ────────────────────────────────────────

const AIChatScreen = ({ isActive }: { isActive: boolean }) => (
  <div className="w-full h-full bg-[#111] p-6 flex flex-col font-sans">
    <div className="flex items-center justify-between mb-8">
      <div className="flex gap-1.5">
        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2 h-2 rounded-full bg-red-400" />
        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 2, delay: 0.2 }} className="w-2 h-2 rounded-full bg-amber-400" />
        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 2, delay: 0.4 }} className="w-2 h-2 rounded-full bg-[#34d399]" />
      </div>
      <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Yureka Neural Engine  v.2.4b</span>
    </div>

    <div className="space-y-6 flex-1">
      <AnimatePresence>
        {isActive && (
          <div className="space-y-6">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="flex gap-3 items-start max-w-[90%]">
              <div className="w-7 h-7 rounded-full bg-[#34d399]/10 flex items-center justify-center shrink-0 border border-[#34d399]/20">
                <div className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
              </div>
              <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none shadow-sm border border-white/5">
                <p className="text-[11px] text-white/70 leading-relaxed font-medium">Ready to pull the trigger on the MacBook 16. Should I stick with my Amex Gold?</p>
              </div>
            </motion.div>

            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1, duration: 0.5 }} className="flex gap-3 flex-row-reverse items-start max-w-[95%]">
              <div className="w-7 h-7 rounded-full bg-[#34d399] flex items-center justify-center shrink-0 shadow-lg">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <Cpu size={12} className="text-[#0a0a0a]" />
                </motion.div>
              </div>
              <div className="bg-[#34d399] p-4 rounded-2xl rounded-tr-none shadow-xl text-[#0a0a0a]">
                <p className="text-[11px] leading-relaxed font-bold">Hold up! Love the upgrade, but let's be strategic. Direct swipe on Amex is okay, but I've found a much better yield path for your specific wallet.</p>
              </div>
            </motion.div>

            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 2.5, duration: 0.5 }} className="flex gap-3 items-start max-w-[90%]">
              <div className="w-7 h-7 rounded-full bg-[#34d399]/10 flex items-center justify-center shrink-0 border border-[#34d399]/20">
                <div className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
              </div>
              <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none shadow-sm border border-white/5">
                <p className="text-[11px] text-white/70 leading-relaxed font-medium">Better than 5x points? How?</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>

    <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
       <div className="flex items-center gap-2">
          <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 rounded-full bg-[#34d399]" />
          <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Neural Active</span>
       </div>
       <Search size={14} className="text-white/20" />
    </div>
  </div>
);

const RewardXScreen = ({ isActive }: { isActive: boolean }) => (
  <div className="w-full h-full bg-[#0a0a0a] p-6 flex flex-col border border-white/5">
    <div className="flex justify-between items-center mb-8">
      <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Adaptive Yield Engine</span>
      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white text-[10px] italic border border-white/10">Y</div>
    </div>

    <h3 className="text-2xl font-serif text-white mb-1">Executive Protocol</h3>
    <div className="flex justify-between items-center mb-8">
       <span className="text-[10px] font-mono text-[#34d399] uppercase tracking-widest">Yield Script Pulse</span>
       <motion.span animate={{ opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 2 }} className="text-xl font-medium text-[#34d399]">₹9,500</motion.span>
    </div>

    <div className="space-y-3">
      {[
        { icon: <Layers size={14}/>, label: 'Merchant Cart', sub: 'Source Node', val: '₹50,000', color: 'bg-white/10 text-white' },
        { icon: <Zap size={14}/>, label: 'RewardX Voucher', sub: 'Yield Executed', val: '-₹4,500', color: 'bg-[#34d399] text-[#0a0a0a]', tag: '9% Instant' },
        { icon: <Sparkles size={14}/>, label: 'Axis Magnus Multiplier', sub: 'Yield Executed', val: '-₹3,050', color: 'bg-white/20 text-white', tag: '10x Points' },
      ].map((item, i) => (
        <motion.div 
          key={item.label}
          initial={{ y: 20, opacity: 0 }}
          animate={isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ delay: i * 0.15, duration: 0.5 }}
          className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 relative overflow-hidden"
        >
          {isActive && i === 1 && (
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
            />
          )}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>{item.icon}</div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-xs font-bold text-white/90">{item.label}</span>
              <span className={`text-xs font-medium ${item.val.startsWith('-') ? 'text-[#34d399]' : 'text-white/40'}`}>{item.val}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-white/20 uppercase tracking-widest">{item.sub}</span>
              {item.tag && <span className="text-[8px] font-bold px-1.5 py-0.5 bg-[#34d399]/10 text-[#34d399] rounded uppercase">{item.tag}</span>}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const ExtensionScreen = ({ isActive }: { isActive: boolean }) => (
  <div className="w-full h-full bg-[#111] p-6 flex flex-col">
    <div className="w-full h-8 bg-white/5 border border-white/10 rounded-t-xl flex items-center px-4 gap-2 mb-6">
      <div className="flex gap-1">
        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-white/10" />
        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.5 }} className="w-1.5 h-1.5 rounded-full bg-white/10" />
      </div>
      <div className="flex-1 h-4 bg-white/5 rounded-full px-3 flex items-center">
        <span className="text-[7px] text-white/20 font-mono">amazon.in/cart/checkout</span>
      </div>
    </div>

    <div className="flex-1 bg-white/[0.03] rounded-2xl p-4 shadow-sm border border-white/5 relative overflow-hidden">
      <h4 className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Shopping Cart (2 items)</h4>
      
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="w-12 h-12 bg-white/5 rounded-lg shrink-0 relative overflow-hidden">
            <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-[#34d399]/5" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-[10px] font-bold text-white/70">
              <span>iPhone 15 Pro</span>
              <span>₹1,24,900</span>
            </div>
            <span className="text-[8px] text-white/20 block mb-2">Natural Titanium • In Stock</span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <div className="flex justify-between items-center mb-1">
             <span className="text-[10px] text-white/40">Subtotal</span>
             <span className="text-[10px] font-medium text-white/80">₹1,54,890</span>
          </div>
          <div className="flex justify-between items-center mb-4">
             <span className="text-[10px] text-white/40">Shipping</span>
             <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-[10px] font-bold text-[#34d399]">FREE</motion.span>
          </div>
          <div className="flex justify-between items-center py-3 border-y border-white/5">
             <span className="text-xs font-bold text-white">Total</span>
             <span className="text-sm font-bold text-white">₹1,54,890</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 100 }}
            className="absolute top-1/2 -right-4 -translate-y-1/2 w-32 bg-white text-[#0a0a0a] p-4 rounded-2xl shadow-2xl z-20"
          >
            <div className="flex items-center gap-2 mb-3">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="w-5 h-5 rounded bg-[#0a0a0a] flex items-center justify-center text-[8px] font-serif italic text-white">Y</motion.div>
              <span className="text-[8px] font-bold tracking-widest uppercase">Yureka+</span>
            </div>
            <p className="text-[9px] leading-tight mb-3 font-bold">Found ₹5,400 in hidden vouchers.</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full py-1.5 bg-[#34d399] text-[#0a0a0a] text-[8px] font-bold uppercase tracking-widest rounded-lg shadow-lg">Apply Yield</motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

const WaitlistScreen = ({ isActive }: { isActive: boolean }) => (
  <div className="w-full h-full bg-[#0a0a0a] flex flex-col justify-center items-center p-8 text-center relative overflow-hidden border border-white/5">
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    
    <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center relative z-10">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-t border-[#34d399] rounded-full"
      />
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3 }}>
        <CheckCircle2 className="text-[#34d399]" size={32} />
      </motion.div>
    </div>

    <h3 className="text-2xl font-serif text-white mt-8 mb-2">Protocol Access</h3>
    <motion.p animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 4 }} className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-mono">Status: Awaiting Node Allocation</motion.p>
    
    <div className="mt-12 w-full space-y-2">
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div animate={isActive ? { width: '75%' } : { width: '0%' }} transition={{ duration: 2, delay: 0.5 }} className="h-full bg-[#34d399]" />
      </div>
      <div className="flex justify-between text-[8px] font-mono text-white/20">
        <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}>ENCRYPTING...</motion.span>
        <span>75%</span>
      </div>
    </div>
  </div>
);

// ── Main Stepper Component ──────────────────────────────────────────────────

const HowItWorksStepper: React.FC = () => {
  const [loopKey, setLoopKey] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLoopKey(prev => prev + 1);
    }, 8000); // 8 second cycle for all animations
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full bg-[#0a0a0a] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 space-y-24 md:space-y-36">
        {STEPS.map((step, index) => {
          return (
            <motion.section
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex items-center justify-center"
            >
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">
                
                {/* Phone Column */}
                <div className={`flex justify-center ${step.side === 'right' ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="relative">
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
                      transition={{ repeat: Infinity, duration: 10 }}
                      className="absolute inset-0 bg-[#34d399]/10 blur-[120px] rounded-full scale-110" 
                    />
                    
                    <div className="relative w-[280px] h-[580px] sm:w-[320px] sm:h-[640px] rounded-[3.5rem] border-[12px] border-[#1a1a1a] bg-[#0a0a0a] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/10">
                      <div className="absolute inset-0 z-50 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.01] to-white/[0.04]" />
                      <div className="absolute top-0 inset-x-0 h-9 flex justify-center z-[60]">
                        <div className="w-28 h-7 bg-[#1a1a1a] rounded-b-[2rem]" />
                      </div>

                      <div className="absolute inset-0 pt-8">
                        <div className="w-full h-full">
                          <AnimatePresence mode="wait">
                            <motion.div 
                                key={loopKey}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="w-full h-full"
                            >
                                {step.id === 1 && <AIChatScreen isActive={true} />}
                                {step.id === 2 && <RewardXScreen isActive={true} />}
                                {step.id === 3 && <ExtensionScreen isActive={true} />}
                                {step.id === 4 && <WaitlistScreen isActive={true} />}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Column */}
                <div className={`flex flex-col items-center ${step.side === 'right' ? 'lg:order-1 lg:items-end text-center lg:text-right' : 'lg:order-2 lg:items-start text-center lg:text-left'}`}>
                  <div className={`max-w-xl flex flex-col items-center ${step.side === 'right' ? 'lg:items-end' : 'lg:items-start'}`}>
                    <span className="block text-[#34d399] text-[11px] font-bold uppercase tracking-[0.5em] mb-4">
                      {step.tag}
                    </span>
                    
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-4 leading-[0.95] tracking-tighter uppercase">
                      {step.title.split(' ').map((word, i) => (
                        <span key={i} className={i % 2 !== 0 ? 'italic font-light text-[#34d399]' : ''}>
                          {word}{' '}
                        </span>
                      ))}
                    </h2>

                    <p className={`text-white/60 text-lg md:text-xl font-sans leading-relaxed mb-6 max-w-md ${step.side === 'right' ? 'lg:ml-auto' : ''}`}>
                      {step.description}
                    </p>

                    <div className={`flex flex-col gap-6 items-center ${step.side === 'right' ? 'lg:items-end' : 'lg:items-start'}`}>
                      <button className="group relative px-10 py-5 bg-white text-[#0a0a0a] rounded-full text-[10px] font-bold uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-105 shadow-2xl">
                        <span className="relative z-10 flex items-center justify-center gap-3 w-full">
                          {step.cta} <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-[#34d399] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                      </button>

                      <div className="flex items-center gap-3 mt-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                         <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
                           Availability: <span className="text-white/40">{step.availability}</span>
                         </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
};

export default HowItWorksStepper;
