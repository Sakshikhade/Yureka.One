import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'motion/react';
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
  <div className="w-full h-full bg-[#f8f7f2] p-6 flex flex-col font-sans">
    <div className="flex items-center justify-between mb-8">
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-red-400/20" />
        <div className="w-2 h-2 rounded-full bg-amber-400/20" />
        <div className="w-2 h-2 rounded-full bg-emerald-400/20" />
      </div>
      <span className="text-[10px] font-mono text-black/20 uppercase tracking-widest">Yureka Neural Engine  v.2.4b</span>
    </div>

    <div className="space-y-6">
      <AnimatePresence>
        {isActive && (
          <>
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="flex gap-3 items-start max-w-[90%]">
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200">
                <div className="w-1.5 h-1.5 rounded-full bg-[#047857]" />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-black/5">
                <p className="text-[11px] text-black/70 leading-relaxed font-medium">Ready to pull the trigger on the MacBook 16. Should I stick with my Amex Gold?</p>
              </div>
            </motion.div>

            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="flex gap-3 flex-row-reverse items-start max-w-[95%]">
              <div className="w-7 h-7 rounded-full bg-[#242424] flex items-center justify-center shrink-0 shadow-lg">
                <Cpu size={12} className="text-[#047857]" />
              </div>
              <div className="bg-[#242424] p-4 rounded-2xl rounded-tr-none shadow-xl text-white">
                <p className="text-[11px] leading-relaxed">Hold up! Love the upgrade, but let's be strategic. Direct swipe on Amex is okay, but I've found a much better yield path for your specific wallet.</p>
              </div>
            </motion.div>

            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="flex gap-3 items-start max-w-[90%]">
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200">
                <div className="w-1.5 h-1.5 rounded-full bg-[#047857]" />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-black/5">
                <p className="text-[11px] text-black/70 leading-relaxed font-medium">Better than 5x points? How?</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>

    <div className="mt-auto pt-4 flex items-center justify-between border-t border-black/5">
       <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#047857] animate-pulse" />
          <span className="text-[9px] font-bold text-black/20 uppercase tracking-widest">Neural Active</span>
       </div>
       <Search size={14} className="text-black/20" />
    </div>
  </div>
);

const RewardXScreen = ({ isActive }: { isActive: boolean }) => (
  <div className="w-full h-full bg-white p-6 flex flex-col">
    <div className="flex justify-between items-center mb-8">
      <span className="text-[10px] font-bold text-black/20 uppercase tracking-[0.3em]">Adaptive Yield Engine</span>
      <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white text-[10px] italic">Y</div>
    </div>

    <h3 className="text-2xl font-serif text-[#242424] mb-1">Executive Protocol</h3>
    <div className="flex justify-between items-center mb-8">
       <span className="text-[10px] font-mono text-[#047857] uppercase tracking-widest">Yield Script Pulse</span>
       <span className="text-xl font-medium text-[#047857]">₹9,500</span>
    </div>

    <div className="space-y-3">
      {[
        { icon: <Layers size={14}/>, label: 'Merchant Cart', sub: 'Source Node', val: '₹50,000', color: 'bg-black text-white' },
        { icon: <Zap size={14}/>, label: 'RewardX Voucher', sub: 'Yield Executed', val: '-₹4,500', color: 'bg-[#047857] text-white', tag: '9% Instant' },
        { icon: <Sparkles size={14}/>, label: 'Axis Magnus Multiplier', sub: 'Yield Executed', val: '-₹3,050', color: 'bg-emerald-500 text-white', tag: '10x Points' },
      ].map((item, i) => (
        <motion.div 
          key={item.label}
          initial={{ y: 20, opacity: 0 }}
          animate={isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ delay: i * 0.15, duration: 0.5 }}
          className="p-4 rounded-2xl bg-[#fcfcf9] border border-black/5 flex items-center gap-4"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>{item.icon}</div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-xs font-bold text-black/80">{item.label}</span>
              <span className={`text-xs font-medium ${item.val.startsWith('-') ? 'text-[#047857]' : 'text-black/40'}`}>{item.val}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-black/30 uppercase tracking-widest">{item.sub}</span>
              {item.tag && <span className="text-[8px] font-bold px-1.5 py-0.5 bg-[#047857]/10 text-[#047857] rounded uppercase">{item.tag}</span>}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const ExtensionScreen = ({ isActive }: { isActive: boolean }) => (
  <div className="w-full h-full bg-[#fcfcf9] p-6 flex flex-col">
    <div className="w-full h-8 bg-white border border-black/5 rounded-t-xl flex items-center px-4 gap-2 mb-6">
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-black/5" />
        <div className="w-1.5 h-1.5 rounded-full bg-black/5" />
      </div>
      <div className="flex-1 h-4 bg-black/5 rounded-full px-3 flex items-center">
        <span className="text-[7px] text-black/20 font-mono">amazon.in/cart/checkout</span>
      </div>
    </div>

    <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-black/5 relative overflow-hidden">
      <h4 className="text-xs font-bold text-black/30 uppercase tracking-widest mb-4">Shopping Cart (2 items)</h4>
      
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="w-12 h-12 bg-black/5 rounded-lg shrink-0" />
          <div className="flex-1">
            <div className="flex justify-between text-[10px] font-bold text-black/70">
              <span>iPhone 15 Pro</span>
              <span>₹1,24,900</span>
            </div>
            <span className="text-[8px] text-black/30 block mb-2">Natural Titanium • In Stock</span>
          </div>
        </div>

        <div className="pt-4 border-t border-black/5">
          <div className="flex justify-between items-center mb-1">
             <span className="text-[10px] text-black/40">Subtotal</span>
             <span className="text-[10px] font-medium">₹1,54,890</span>
          </div>
          <div className="flex justify-between items-center mb-4">
             <span className="text-[10px] text-black/40">Shipping</span>
             <span className="text-[10px] font-bold text-[#047857]">FREE</span>
          </div>
          <div className="flex justify-between items-center py-3 border-y border-black/5">
             <span className="text-xs font-bold">Total</span>
             <span className="text-sm font-bold text-[#242424]">₹1,54,890</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
            className="absolute top-1/2 -right-4 -translate-y-1/2 w-32 bg-[#242424] text-white p-4 rounded-2xl shadow-2xl z-20"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded bg-[#047857] flex items-center justify-center text-[8px] font-serif italic">Y</div>
              <span className="text-[8px] font-bold tracking-widest uppercase">Yureka+</span>
            </div>
            <p className="text-[9px] leading-tight mb-3">Found ₹5,400 in hidden vouchers.</p>
            <button className="w-full py-1.5 bg-[#047857] text-[8px] font-bold uppercase tracking-widest rounded-lg">Apply Yield</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

const WaitlistScreen = ({ isActive }: { isActive: boolean }) => (
  <div className="w-full h-full bg-[#242424] flex flex-col justify-center items-center p-8 text-center relative overflow-hidden">
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    
    <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center relative z-10">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-t border-[#047857] rounded-full"
      />
      <CheckCircle2 className="text-[#047857]" size={32} />
    </div>

    <h3 className="text-2xl font-serif text-white mt-8 mb-2">Protocol Access</h3>
    <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-mono">Status: Awaiting Node Allocation</p>
    
    <div className="mt-12 w-full space-y-2">
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div animate={isActive ? { width: '75%' } : { width: '0%' }} transition={{ duration: 1.5, delay: 0.2 }} className="h-full bg-[#047857]" />
      </div>
      <div className="flex justify-between text-[8px] font-mono text-white/20">
        <span>ENCRYPTING...</span>
        <span>75%</span>
      </div>
    </div>
  </div>
);

// ── Main Stepper Component ──────────────────────────────────────────────────

const HowItWorksStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      const step = Math.min(Math.floor(v * STEPS.length) + 1, STEPS.length);
      setActiveStep(step);
    });
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="relative w-full bg-cream" style={{ height: '500vh' }}>
      {STEPS.map((step, index) => {
        const start = index / STEPS.length;
        const end = (index + 1) / STEPS.length;
        
        // Refined transformations for a smooth fade-and-slide storytelling transition
        const opacity = useTransform(smoothProgress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0]);
        const y = useTransform(smoothProgress, [start, start + 0.1, end - 0.1, end], [30, 0, 0, -30]);
        const scale = useTransform(smoothProgress, [start, start + 0.1, end - 0.1, end], [0.98, 1, 1, 0.98]);

        // Entrance slide-in based on step side
        const contentX = useTransform(smoothProgress, [start, start + 0.1], [step.side === 'left' ? 40 : -40, 0]);
        const phoneX = useTransform(smoothProgress, [start, start + 0.1], [step.side === 'left' ? -40 : 40, 0]);

        return (
          <motion.section
            key={step.id}
            style={{ 
                opacity, 
                y, 
                scale,
                position: 'sticky',
                top: 0,
                height: '100vh',
                zIndex: activeStep === step.id ? 20 : 10,
                pointerEvents: activeStep === step.id ? 'auto' : 'none'
            }}
            className="w-full flex items-center justify-center overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
              
              {/* Phone Column */}
              <div className={`${step.side === 'right' ? 'lg:order-2' : 'lg:order-1'} flex justify-center`}>
                <motion.div style={{ x: phoneX }} className="relative">
                  <div className="absolute inset-0 bg-[#047857]/10 blur-[120px] rounded-full scale-110 opacity-30" />
                  
                  <div className="relative w-[280px] h-[580px] sm:w-[320px] sm:h-[640px] rounded-[3.5rem] border-[12px] border-[#242424] bg-white shadow-[0_60px_120px_-30px_rgba(0,0,0,0.3)] overflow-hidden ring-1 ring-white/10">
                    <div className="absolute inset-0 z-50 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08]" />
                    <div className="absolute top-0 inset-x-0 h-9 flex justify-center z-[60]">
                      <div className="w-28 h-7 bg-[#242424] rounded-b-[2rem]" />
                    </div>

                    <div className="absolute inset-0 pt-8">
                       <AnimatePresence mode="wait">
                         {activeStep === step.id && (
                           <motion.div 
                             initial={{ opacity: 0 }} 
                             animate={{ opacity: 1 }} 
                             exit={{ opacity: 0 }}
                             transition={{ duration: 0.4 }}
                             className="w-full h-full"
                           >
                             {step.id === 1 && <AIChatScreen isActive={activeStep === 1} />}
                             {step.id === 2 && <RewardXScreen isActive={activeStep === 2} />}
                             {step.id === 3 && <ExtensionScreen isActive={activeStep === 3} />}
                             {step.id === 4 && <WaitlistScreen isActive={activeStep === 4} />}
                           </motion.div>
                         )}
                       </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Text Column */}
              <div className={`${step.side === 'right' ? 'lg:order-1 text-right items-end' : 'lg:order-2 text-left items-start'} flex flex-col`}>
                <motion.div style={{ x: contentX }} className="max-w-xl">
                  <span className="block text-[#047857] text-[11px] font-bold uppercase tracking-[0.5em] mb-6">
                    {step.tag}
                  </span>
                  
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#242424] mb-8 leading-[0.95] tracking-tighter uppercase">
                    {step.title.split(' ').map((word, i) => (
                      <span key={i} className={i % 2 !== 0 ? 'italic font-light text-[#047857]' : ''}>
                        {word}{' '}
                      </span>
                    ))}
                  </h2>

                  <p className={`text-[#242424]/60 text-lg md:text-xl font-sans leading-relaxed mb-10 max-w-md ${step.side === 'right' ? 'ml-auto' : ''}`}>
                    {step.description}
                  </p>

                  <div className={`flex flex-col gap-6 ${step.side === 'right' ? 'items-end' : 'items-start'}`}>
                    <button className="group relative px-10 py-5 bg-[#242424] text-white rounded-full text-[10px] font-bold uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-105 shadow-2xl">
                      <span className="relative z-10 flex items-center gap-3">
                        {step.cta} <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-[#047857] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    </button>

                    <div className="flex items-center gap-3 mt-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#047857] animate-pulse" />
                       <span className="text-[10px] font-bold text-black/20 uppercase tracking-[0.3em]">
                         Availability: <span className="text-black/40">{step.availability}</span>
                       </span>
                    </div>
                  </div>
                </motion.div>
              </div>

            </div>
          </motion.section>
        );
      })}
    </div>
  );
};

export default HowItWorksStepper;
