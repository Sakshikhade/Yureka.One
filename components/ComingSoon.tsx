import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Zap, Brain, Rocket, ArrowRight, Bell, 
  Smartphone, Globe, Shield, Coins, MousePointer, 
  ShoppingBag, CheckCircle2, ChevronRight, MessageSquare,
  Search, Cpu, Lock, Layout, Star, Users, CreditCard
} from 'lucide-react';

/* --- PREMIUM UI WRAPPERS --- */

const WindowFrame: React.FC<{ children: React.ReactNode, title?: string, color?: string, dark?: boolean }> = ({ children, title, color = "clay", dark = true }) => {
  return (
    <div className={`w-full h-full bg-cream rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl transition-all duration-500 group-hover:shadow-${color}/10 group-hover:border-${color}/20 flex flex-col`}>
      {/* Browser/OS Top Bar */}
      <div className={`px-4 py-3 md:px-6 md:py-4 border-b border-white/5 bg-white/5 flex justify-between items-center backdrop-blur-md`}>
        <div className="flex gap-1.5 md:gap-2">
          <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500/30`} />
          <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full bg-amber-500/30`} />
          <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full bg-emerald-500/30`} />
        </div>
        {title && (
          <div className="flex items-center gap-2">
            <span className={`text-[9px] md:text-[10px] font-medium uppercase tracking-[0.2em] text-white/40`}>{title}</span>
          </div>
        )}
        <div className={`text-[8px] md:text-[9px] font-medium italic tracking-wider text-white/10`}>V.2.4B</div>
      </div>
      <div className="flex-1 relative overflow-hidden">
        {children}
      </div>
    </div>
  );
};

/* --- ENHANCED ANIMATION COMPONENTS --- */

const TypewriterText: React.FC<{ text: string; delay?: number; onComplete?: () => void }> = ({ text, delay = 15, onComplete }) => {
    const [displayedText, setDisplayedText] = useState("");
    
    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            setDisplayedText(text.slice(0, i + 1));
            i++;
            if (i >= text.length) {
                clearInterval(timer);
                if (onComplete) onComplete();
            }
        }, delay);
        return () => clearInterval(timer);
    }, [text, delay]);

    return <span>{displayedText}</span>;
};

const YUREKA_MSGS = [
  { id: 1, type: 'user', text: "I'm buying a ₹1.5L MacBook Pro. Should I just swipe my Amex Platinum?", delay: 1200 },
  { id: 2, type: 'ai',   text: "Hold that swipe. Amex Platinum gives you 1 MR/₹50 here — fine, but not optimal. Your HDFC SmartBuy monthly cap isn't hit yet, which unlocks 10x Infinia points on this exact merchant.", delay: 4800 },
  { id: 3, type: 'user', text: "10x? That's ₹15,000 in points right?", delay: 13000 },
  { id: 4, type: 'ai',   text: "Exactly ₹15,000 in Infinia points. Stack a ₹1.5L Apple voucher via RewardX (6% off = ₹9,000 instant) and your effective spend is ₹1,41,000 — saving ₹24,000 total. Shall I map the stack?", delay: 17000 },
  { id: 5, type: 'user', text: "Yes. Also can I transfer the Infinia points to air miles?", delay: 28000 },
  { id: 6, type: 'ai',   text: "1:2 ratio to Air India Miles — that's 30,000 miles, enough for a Business Class upgrade on Delhi–Singapore. I've plotted the full yield path. Ready to apply?", delay: 32000 },
];

const YurekaAIAnimation = () => {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [inputActive, setInputActive] = useState(false);
  const [finishedTypingId, setFinishedTypingId] = useState<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timers: ReturnType<typeof setTimeout>[] = [];
    
    const runSequence = () => {
        setVisibleMessages([]);
        setFinishedTypingId([]);
        setIsThinking(false);
        setInputActive(false);

        YUREKA_MSGS.forEach((msg) => {
            const t = setTimeout(() => {
                if (msg.type === 'user') {
                    setInputActive(true);
                    setTimeout(() => {
                        setInputActive(false);
                        setVisibleMessages(prev => [...prev, msg.id]);
                    }, 1400);
                } else {
                    setIsThinking(true);
                    setTimeout(() => {
                        setIsThinking(false);
                        setVisibleMessages(prev => [...prev, msg.id]);
                    }, 2400);
                }
            }, msg.delay);
            timers.push(t);
        });
    };

    runSequence();
    const mainInterval = setInterval(runSequence, 40000); // Restart sequence every 40 seconds

    return () => {
        timers.forEach(clearTimeout);
        clearInterval(mainInterval);
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [visibleMessages, isThinking]);

  return (
    <WindowFrame title="Yureka Neural Engine" color="teal">
      <div className="h-full flex flex-col bg-cream relative overflow-hidden">
        {/* Ambient glow when AI thinks */}
        <AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(52,211,153,0.07) 0%, transparent 70%)' }}
            />
          )}
        </AnimatePresence>

        {/* Fade top edge */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-cream to-transparent z-20 pointer-events-none" />

        <div ref={scrollRef} className="flex-1 px-5 md:px-10 pt-10 pb-6 space-y-6 overflow-y-auto no-scrollbar relative z-10">
          <AnimatePresence mode="popLayout">
            {YUREKA_MSGS.filter(m => visibleMessages.includes(m.id)).map((msg) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.96, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                className={`flex items-end gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl shrink-0 flex items-center justify-center ${
                  msg.type === 'user' ? 'bg-clay shadow-lg shadow-clay/20' : 'bg-white/[0.06] border border-white/10'
                }`}>
                  {msg.type === 'user'
                    ? <Search size={14} className="text-cream" />
                    : <Cpu size={15} className="text-clay" />}
                </div>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[11px] md:text-[13px] leading-relaxed font-medium border ${
                  msg.type === 'user'
                    ? 'bg-white/[0.06] border-white/[0.08] text-white/80 rounded-br-[4px]'
                    : 'bg-clay border-clay text-cream font-semibold rounded-bl-[4px] shadow-lg shadow-clay/15'
                }`}>
                  {msg.type === 'ai' ? (
                    <TypewriterText text={msg.text} delay={14} onComplete={() => setFinishedTypingId(p => [...p, msg.id])} />
                  ) : msg.text}
                </div>
              </motion.div>
            ))}

            {isThinking && (
              <motion.div
                key="thinking"
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-end gap-3"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl shrink-0 bg-white/[0.06] border border-white/10 flex items-center justify-center">
                  <Cpu size={15} className="text-clay" />
                </div>
                <div className="px-5 py-3.5 bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-bl-[4px] flex gap-2 items-center">
                  {[0,1,2].map(i => (
                    <motion.div key={i}
                      animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.17, ease: 'easeInOut' }}
                      className="w-2 h-2 bg-clay rounded-full"
                    />
                  ))}
                  <span className="ml-2 text-[9px] text-clay/50 font-bold uppercase tracking-widest animate-pulse">Computing yield…</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input bar */}
        <div className="px-5 py-4 border-t border-white/[0.06] bg-cream/90 backdrop-blur-md">
          <div className="h-12 bg-white/[0.04] border border-white/[0.08] rounded-2xl flex items-center px-5 gap-3">
            <AnimatePresence mode="wait">
              {inputActive ? (
                <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 flex-1">
                  <motion.div animate={{ opacity: [1,0,1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-clay rounded-full shrink-0" />
                  <span className="text-[11px] text-clay font-medium">Analysing wallet matrix…</span>
                </motion.div>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 text-[11px] text-white/20">
                  Ask Yureka Neural Engine…
                </motion.span>
              )}
            </AnimatePresence>
            <Rocket size={16} className={`shrink-0 transition-colors ${inputActive ? 'text-clay' : 'text-white/10'}`} />
          </div>
          <div className="flex items-center gap-2 mt-2 px-1">
            <div className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse" />
            <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold">Neural Active</span>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
};


const RX_STEPS = [
  { label: 'MacBook Pro 16"', value: 150000, type: 'base', badge: null, icon: <ShoppingBag size={16} />, sub: 'Merchant Cart' },
  { label: 'Apple Voucher via RewardX', value: -9000, type: 'disc', badge: '6% INSTANT', icon: <Zap size={16} />, sub: 'Voucher Stack' },
  { label: 'HDFC Infinia SmartBuy', value: -15000, type: 'disc', badge: '10X POINTS', icon: <Star size={16} />, sub: 'Card Multiplier' },
  { label: 'Yureka Yield Optimizer', value: -3750, type: 'disc', badge: '2.5% EXTRA', icon: <Cpu size={16} />, sub: 'AI Stack Layer' },
  { label: 'Referral Credit', value: -1500, type: 'disc', badge: '1% BACK', icon: <Users size={16} />, sub: 'Loyalty Node' },
];

const RewardXAnimation = () => {
  const [step, setStep] = useState(0);
  const [displayCount, setDisplayCount] = useState(150000);
  const [displaySavings, setDisplaySavings] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const run = (s: number) => {
      const next = (s + 1) % (RX_STEPS.length + 2);
      timeout = setTimeout(() => { setStep(next); run(next); }, s >= RX_STEPS.length ? 9000 : 2600);
    };
    run(0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (step === 0) { setDisplayCount(150000); setDisplaySavings(0); return; }
    if (step > 0 && step <= RX_STEPS.length - 1) {
      const target = 150000 + RX_STEPS.slice(1, step + 1).reduce((a, c) => a + c.value, 0);
      const savedTarget = Math.abs(RX_STEPS.slice(1, step + 1).reduce((a, c) => a + c.value, 0));
      let c = displayCount, s = displaySavings;
      const t = setInterval(() => {
        let moved = false;
        if (c > target) { c = Math.max(c - 300, target); moved = true; }
        if (s < savedTarget) { s = Math.min(s + 300, savedTarget); moved = true; }
        setDisplayCount(c); setDisplaySavings(s);
        if (!moved) clearInterval(t);
      }, 16);
      return () => clearInterval(t);
    }
  }, [step]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [step]);

  const progress = step >= RX_STEPS.length ? 100 : Math.round((step / (RX_STEPS.length - 1)) * 100);

  return (
    <WindowFrame title="Adaptive Yield Engine" color="emerald">
      <div className="h-full flex flex-col bg-cream relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-clay/8 blur-[60px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="px-8 md:px-12 pt-8 pb-5 flex justify-between items-start shrink-0 relative z-10 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {[0,1,2].map(i => (
                <motion.div key={i} animate={{ opacity: [0.2,1,0.2], scale: [0.8,1,0.8] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.25 }}
                  className="w-1.5 h-1.5 rounded-full bg-clay" />
              ))}
              <span className="text-[9px] font-bold tracking-[0.3em] text-clay/60 uppercase">Yield Script Active</span>
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tighter uppercase leading-tight">Executive<br />Protocol</h3>
          </div>
          <div className="text-right">
            <div className="text-[8px] text-white/25 tracking-widest uppercase mb-1 font-bold">Total Saved</div>
            <motion.div className="text-xl md:text-2xl font-bold text-clay tracking-tighter tabular-nums">
              ₹{displaySavings.toLocaleString()}
            </motion.div>
            <div className="mt-2 h-1 w-24 bg-white/5 rounded-full overflow-hidden ml-auto">
              <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-clay rounded-full" />
            </div>
          </div>
        </div>

        {/* Steps */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar px-5 md:px-8 py-5 space-y-2.5 relative z-10">
          <AnimatePresence mode="popLayout">
            {RX_STEPS.map((s, i) => i <= step && (
              <motion.div key={i} layout
                initial={{ opacity: 0, x: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ type: 'spring', damping: 22, stiffness: 260, delay: 0.05 }}
                className={`flex items-center justify-between p-4 md:p-5 rounded-2xl border transition-colors duration-500 ${
                  i === step ? 'bg-white/[0.08] border-white/10 shadow-lg' : 'bg-white/[0.03] border-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <motion.div animate={i === step ? { scale: [1, 1.08, 1] } : {}}
                    transition={{ duration: 1.2, repeat: i === step ? Infinity : 0 }}
                    className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center shadow-md shrink-0 ${
                      i === 0 ? 'bg-white text-cream' : 'bg-clay text-cream shadow-clay/20'
                    }`}
                  >
                    {s.icon}
                  </motion.div>
                  <div>
                    <div className="text-[12px] md:text-[13px] font-semibold text-white leading-tight">{s.label}</div>
                    <div className="text-[9px] font-bold text-white/25 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                      {s.sub}
                      {i === step && (
                        <motion.span animate={{ opacity: [1,0,1] }} transition={{ duration: 1, repeat: Infinity }}
                          className="text-clay">●</motion.span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-sm md:text-base font-bold tracking-tight tabular-nums ${s.type === 'base' ? 'text-white' : 'text-clay'}`}>
                    {s.value > 0 ? '' : '−'}₹{Math.abs(s.value).toLocaleString()}
                  </div>
                  {s.badge && (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                      className="inline-block mt-1 px-2 py-0.5 bg-clay text-cream text-[8px] font-black rounded-md tracking-wide">
                      {s.badge}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}

            {step >= RX_STEPS.length && (
              <motion.div key="result"
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 220 }}
                className="mt-3 p-6 md:p-7 bg-clay/10 border border-clay/20 rounded-2xl flex items-center justify-between relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-clay/10 via-transparent to-transparent" />
                <div className="relative z-10">
                  <div className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em] mb-1">You Pay</div>
                  <div className="text-3xl md:text-4xl font-black text-white tracking-tighter tabular-nums">₹{displayCount.toLocaleString()}</div>
                  <div className="text-[10px] text-white/30 mt-1">vs ₹1,50,000 original</div>
                </div>
                <div className="relative z-10 bg-clay px-5 py-4 rounded-xl text-cream text-center shadow-xl shadow-clay/20">
                  <div className="text-[9px] font-black uppercase tracking-widest">Net Yield</div>
                  <div className="text-2xl font-black tabular-nums">19.5%</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-white/[0.06] bg-white/[0.02] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <motion.div animate={{ opacity: [0.5,1,0.5] }} transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-clay" />
            <span className="text-[9px] text-white/25 font-bold uppercase tracking-widest">Yield Path v5.1 Active</span>
          </div>
          <div className="text-[9px] text-white/20 font-mono uppercase tracking-widest">RX-VAULT</div>
        </div>
      </div>
    </WindowFrame>
  );
};


const ExtensionAnimation = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const seq = async () => {
      setPhase(0); await new Promise(r => setTimeout(r, 1800));
      setPhase(1); await new Promise(r => setTimeout(r, 2200));
      setPhase(2); await new Promise(r => setTimeout(r, 2000));
      setPhase(3); await new Promise(r => setTimeout(r, 2000));
      setPhase(4); await new Promise(r => setTimeout(r, 9000));
      seq();
    };
    seq();
    return () => clearTimeout(t);
  }, []);

  const CART = [
    { name: 'MacBook Pro 16"', spec: '512GB · Space Black', price: '₹2,49,900' },
    { name: 'AirPods Pro 2nd Gen', spec: 'USB-C · MagSafe Case', price: '₹24,900' },
  ];

  return (
    <WindowFrame title="Yureka+ Extension" color="teal">
      <div className="h-full bg-cream flex flex-col overflow-hidden">

        {/* Browser chrome */}
        <div className="bg-white/[0.04] px-3 py-2.5 border-b border-white/[0.06] flex items-center gap-2.5 shrink-0">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-clay/40" />
          </div>
          <div className="flex-1 h-6 bg-white/[0.04] border border-white/[0.08] rounded-full px-3 flex items-center gap-2">
            <Lock size={8} className="text-clay shrink-0" />
            <span className="text-[9px] text-white/30 font-mono truncate">amazon.in/cart/checkout</span>
          </div>
          <motion.div
            animate={phase > 0 ? { backgroundColor: '#34d399', boxShadow: '0 0 12px rgba(52,211,153,0.5)' } : {}}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-6 h-6 rounded-md bg-white/[0.06] flex items-center justify-center shrink-0"
          >
            <Sparkles size={12} className={phase > 0 ? 'text-cream' : 'text-white/20'} />
          </motion.div>
        </div>

        {/* Page */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden relative">
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-semibold text-white/50 uppercase tracking-widest mb-3">
              <span>Shopping Cart (2 items)</span>
              <span>Price</span>
            </div>
            {CART.map((item, i) => (
              <div key={i} className="flex gap-3 pb-3 border-b border-white/[0.05]">
                <div className="w-14 h-16 bg-white/[0.06] border border-white/[0.08] rounded-xl shrink-0" />
                <div className="flex-1 flex justify-between items-start">
                  <div>
                    <div className="text-[11px] font-semibold text-white">{item.name}</div>
                    <div className="text-[9px] text-white/25 mt-0.5">{item.spec}</div>
                    <div className="text-[9px] text-clay mt-1 font-medium">In Stock</div>
                  </div>
                  <div className="text-[11px] font-bold text-white">{item.price}</div>
                </div>
              </div>
            ))}
            <div className="pt-1 space-y-1.5">
              <div className="flex justify-between text-[10px] text-white/30"><span>Subtotal</span><span>₹2,74,800</span></div>
              <div className="flex justify-between text-[10px] text-white/30"><span>Shipping</span><span className="text-clay">FREE</span></div>
              <div className="flex justify-between text-[12px] font-bold text-white pt-1 border-t border-white/[0.06]"><span>Total</span><span>₹2,74,800</span></div>
            </div>
            <motion.div animate={phase === 4 ? { opacity: 0.4, scale: 0.98 } : { opacity: 1, scale: 1 }}
              className="w-full h-10 bg-clay rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-cream">
              Proceed to Pay
            </motion.div>
          </div>

          {/* Scan overlay on phase 1 */}
          <AnimatePresence>
            {phase === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="w-40 h-40 border-2 border-clay/40 rounded-full" />
                <motion.div animate={{ scale: [1.3, 1, 1.3], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
                  className="absolute w-24 h-24 border border-clay/30 rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 2 — analysing */}
          <AnimatePresence>
            {phase === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                className="absolute bottom-4 left-4 right-4 p-4 bg-white/5 border border-white/10 rounded-2xl z-20 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 border-2 border-clay/30 border-t-clay rounded-full animate-spin shrink-0" />
                  <div>
                    <div className="text-[9px] font-bold text-clay uppercase tracking-widest">Yureka+</div>
                    <div className="text-[11px] font-semibold text-white">Scanning 3 cards + 200 vouchers…</div>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div initial={{ width: '0%' }} animate={{ width: '85%' }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                    className="h-full bg-clay rounded-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 3 — found */}
          <AnimatePresence>
            {phase === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                transition={{ type: 'spring', damping: 18, stiffness: 260 }}
                className="absolute bottom-4 left-4 right-4 p-4 bg-white/5 border border-clay/20 rounded-2xl z-20 shadow-2xl shadow-clay/10"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 bg-clay rounded-md flex items-center justify-center shrink-0">
                    <Sparkles size={10} className="text-cream" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-clay">Yureka+</span>
                </div>
                <div className="text-[13px] font-bold text-white mb-3">Found <span className="text-clay">₹29,250</span> in hidden vouchers & points</div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="w-full h-10 bg-clay rounded-xl text-cream text-[10px] font-black uppercase tracking-widest flex items-center justify-center cursor-pointer shadow-lg shadow-clay/20">
                  Apply Yield Stack
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 4 — applied */}
          <AnimatePresence>
            {phase === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 240 }}
                className="absolute inset-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl z-20 flex flex-col items-center justify-center text-center p-6 shadow-2xl"
              >
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 14, stiffness: 300, delay: 0.1 }}
                  className="w-16 h-16 bg-clay rounded-2xl flex items-center justify-center text-cream shadow-xl shadow-clay/20 mb-4"
                >
                  <CheckCircle2 size={32} />
                </motion.div>
                <div className="text-[9px] font-bold text-clay uppercase tracking-[0.3em] mb-1">Yield Applied</div>
                <div className="text-3xl font-black text-white tracking-tighter mb-1">₹2,45,550</div>
                <div className="text-[10px] text-white/30">Saved <span className="text-clay font-bold">₹29,250</span> automatically</div>
                <div className="mt-4 flex gap-3 text-[9px] text-white/20 uppercase tracking-widest">
                  <span>HDFC Infinia 10x</span>
                  <span>·</span>
                  <span>Apple Voucher 6%</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status bar */}
        <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/[0.05] flex items-center gap-2 shrink-0">
          <motion.div animate={{ opacity: [0.5,1,0.5] }} transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-clay" />
          <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Stable Uplink · Yureka Neural v2</span>
        </div>
      </div>
    </WindowFrame>
  );
};

/* --- MAIN SECTION --- */

const ComingSoon: React.FC = () => {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });

    const features = [
        {
            title: 'Yureka AI',
            label: 'Pulse v2',
            desc: 'A neural layer for your wallet. It decodes thousands of rewards rules in milliseconds to find your optimal swipe.',
            component: <YurekaAIAnimation />,
            color: 'teal'
        },
        {
            title: 'RewardX',
            label: 'Yield Stack',
            desc: 'The definitive voucher engine. Stack institutional discounts with card multipliers for double-digit savings.',
            component: <RewardXAnimation />,
            color: 'emerald'
        },
        {
            title: 'Browser Extension',
            label: 'Ghostwriter',
            desc: 'Your checkout companion. It lives on your toolbar and applies the magic moment you hit any payment page.',
            component: <ExtensionAnimation />,
        }
    ];

    return (
        <section ref={containerRef} className="relative min-h-screen bg-cream font-sans selection:bg-clay selection:text-cream overflow-hidden py-16 md:py-32">
            
            {/* Premium Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[1000px] bg-gradient-to-b from-clay/5 to-transparent pointer-events-none" />
            <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-clay/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-5%] w-[800px] h-[800px] bg-teal-500/5 blur-[160px] rounded-full pointer-events-none" />

            <div className="w-full relative z-10 px-6 md:px-12 lg:px-20">
                {/* Tactical Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-24 md:mb-32">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 mb-6 md:mb-10 bg-white/5 border border-white/10 rounded-full shadow-sm backdrop-blur-xl">
                            <span className="w-2 h-2 rounded-full bg-clay animate-pulse" />
                            <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">Intelligence Pipeline / v0.9.4B</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl lg:text-[clamp(1.5rem,4vw,4.5rem)] font-heading font-extrabold tracking-tight leading-[0.9] text-white uppercase">
                            The <br />
                           <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-clay to-white/50 italic font-thin serif">Elite</span><br />
                           Standard.
                        </h2>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="lg:max-w-[280px] space-y-6 md:space-y-8 pb-4"
                    >
                        <div className="w-12 h-12 bg-white/5 rounded-[1.2rem] flex items-center justify-center shadow-2xl border border-white/10 rotate-3 hover:rotate-0 transition-transform duration-500 backdrop-blur-xl">
                            <Lock className="text-clay" size={24} />
                        </div>
                        <p className="text-white/40 text-xs md:text-sm font-medium leading-relaxed tracking-tight">
                           Our system interprets 10^7 variables per second to render "guessing" obsolete. This is the automation of superiority.
                        </p>
                    </motion.div>
                </div>

                {/* Vertical Feature Stack - Editorial Style */}
                <div className="space-y-16 md:space-y-32">
                    {features.map((feature, idx) => (
                        <div key={idx} className={`flex flex-col lg:flex-row gap-12 md:gap-20 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                            {/* Visual Mockup Container */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98, y: 60 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full lg:w-1/2 group relative"
                            >
                                <div className="relative w-full min-h-[480px] md:min-h-[560px] max-h-[680px] overflow-hidden rounded-[2rem] shadow-2xl">
                                   {/* Advanced Glow */}
                                   <div className={`absolute -inset-10 bg-gradient-to-br from-clay/5 to-transparent blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
                                   {feature.component}
                                </div>
                            </motion.div>

                            {/* Copy Content */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1 }}
                                className="w-full lg:w-1/2 space-y-6 md:space-y-8 px-4 flex flex-col items-center lg:items-start text-center lg:text-left"
                            >
                                <div className="space-y-4 flex flex-col items-center lg:items-start">
                                   <div className="flex items-center gap-3">
                                      <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-[0.3em] text-white/20">{feature.label}</span>
                                      <div className="h-[1px] w-8 md:w-12 bg-white/5" />
                                   </div>
                                   <h3 className="text-3xl md:text-4xl lg:text-[clamp(1.5rem,3vw,4rem)] font-heading font-extrabold text-white tracking-tight uppercase leading-none">
                                      {feature.title}
                                   </h3>
                                </div>
                                <p className="text-white/50 text-sm md:text-lg font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
                                   {feature.desc}
                                </p>
                                <div className="pt-4 flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-6 w-full lg:w-auto">
                                   <Link to="/join-waitlist" className="h-12 md:h-14 px-8 md:px-10 bg-white text-cream rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl shadow-black/10 hover:bg-clay hover:text-white hover:-translate-y-1 transition-all active:scale-95 group shrink-0 flex items-center justify-center w-full sm:w-auto">
                                      Join Internal Test <ChevronRight size={14} className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                                   </Link>
                                   <div className="flex flex-col text-center sm:text-left">
                                      <span className="text-[8px] md:text-[9px] font-medium text-white/10 uppercase tracking-widest">Availability</span>
                                      <span className="text-[9px] md:text-[10px] font-bold text-clay uppercase italic">Limited Access Nodes</span>
                                   </div>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>

                {/* Final CTA - "The Registry" */}
                <motion.div 
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-32 md:mt-48 p-8 md:p-24 glass-dark glass-shine-container rounded-[2.5rem] md:rounded-[5rem] text-center relative overflow-hidden group border border-white/5 shadow-2xl"
                >
                    {/* Dark Grain Overlay */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-clay/10 blur-[160px] rounded-full pointer-events-none" />
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <Sparkles className="mx-auto mb-8 text-clay" size={32} />
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white uppercase mb-8 leading-[0.85]">
                            Secure Your <br />
                            <span className="text-clay italic serif font-thin">Access.</span>
                        </h2>
                        <p className="text-white/50 text-xs md:text-sm font-medium uppercase tracking-[0.3em] mb-12 max-w-lg mx-auto leading-relaxed">
                            Phase 1 deployment is capped at 5,000 nodes. priority is given to institutional waitlist members.
                        </p>
                        <div className="flex flex-col items-center gap-6">
                            <button className="h-16 px-16 bg-cream text-ink rounded-full text-xs font-bold uppercase tracking-[0.4em] hover:bg-clay hover:text-cream hover:scale-105 transition-all duration-500 shadow-2xl group flex items-center gap-4">
                                Enter The Registry <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                             <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.5em] text-cream/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-clay" /> Encrypted Connection
                                <span className="w-1.5 h-1.5 rounded-full bg-clay" /> SSL 256-Bit
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Smarter Spends Grid (Image 2) */}
                <div className="mt-32 md:mt-48 space-y-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center space-y-4 mb-16"
                    >
                        <span className="text-clay text-[10px] font-black uppercase tracking-[0.4em]">Yield Categories</span>
                        <h2 className="text-4xl md:text-6xl font-heading text-white tracking-tighter uppercase">Smarter <span className="text-clay">Spends.</span></h2>
                        <p className="text-white/40 text-xs md:text-sm max-w-xl mx-auto uppercase tracking-widest font-bold">Strategic optimization for every major spend category in your lifestyle.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { 
                                category: 'Shopping', 
                                color: 'text-fuchsia-500', 
                                logo: 'https://logo.clearbit.com/myntra.com', 
                                savings: 'UPTO 20%', 
                                brands: 'Myntra and Nykaa', 
                                desc: 'orders just by using the right credit card combined with affiliate tools.' 
                            },
                            { 
                                category: 'Travel', 
                                color: 'text-blue-500', 
                                logo: 'https://logo.clearbit.com/goindigo.in', 
                                savings: 'UPTO 20%', 
                                brands: 'IndiGo tickets', 
                                desc: 'just by using the right credit card combined with airline membership programmes.' 
                            },
                            { 
                                category: 'Dining', 
                                color: 'text-orange-500', 
                                logo: 'https://logo.clearbit.com/eazydiner.com', 
                                savings: 'UPTO 30%', 
                                brands: 'Restaurant Bills', 
                                desc: 'just by using the right credit card with dining programs like EazyDiner.' 
                            },
                            { 
                                category: 'Business', 
                                color: 'text-red-500', 
                                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Emblem_of_India.svg/1200px-Emblem_of_India.svg.png', 
                                savings: 'UPTO 16.67%', 
                                brands: 'Tax payments', 
                                desc: 'just by using the right business credit cards with and max benefit redemption options.' 
                            },
                            { 
                                category: 'Hotel', 
                                color: 'text-amber-600', 
                                logo: 'https://logo.clearbit.com/accor.com', 
                                savings: 'FREE NIGHTS', 
                                brands: 'Accor Hotels', 
                                desc: 'on your stays by using the right credit card, the most rewarding redemption options and transfer bonuses.' 
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`group relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 hover:bg-white/[0.06] hover:border-clay/30 transition-all duration-500 shadow-2xl ${i >= 3 ? 'lg:col-span-1.5' : ''}`}
                            >
                                {/* Subtle Grid Background for Card */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                                
                                <div className="relative z-10 flex flex-col items-start gap-8 h-full">
                                    <div className="h-16 flex items-center">
                                        <img src={item.logo} alt={item.category} className="h-12 w-auto object-contain brightness-100 group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-white font-bold text-sm md:text-base tracking-tight leading-tight">
                                            Smarter <span className={item.color}>{item.category}</span> Spends
                                        </h3>
                                        <p className="text-white/40 text-[10px] md:text-xs leading-relaxed font-medium">
                                            Saving <span className="text-white font-bold">{item.savings}</span> on <span className="text-white font-bold">{item.brands}</span> {item.desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Hover Glow */}
                                <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-clay/10 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* App Download CTA - "Image 2" */}
                <motion.div 
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-6 p-8 md:p-12 lg:p-16 bg-white/5 rounded-[2.5rem] relative overflow-hidden group border border-cream/5 shadow-2xl"
                >
                    {/* Concentric Wireframe background */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                        <div className="absolute -left-[10%] -top-[50%] w-[600px] h-[600px] border border-white/10 rounded-full"></div>
                        <div className="absolute -left-[5%] -top-[45%] w-[550px] h-[550px] border border-white/10 rounded-full"></div>
                        <div className="absolute left-[0%] -top-[40%] w-[500px] h-[500px] border border-white/10 rounded-full"></div>
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                        {/* Top Row */}
                        <div className="flex justify-between items-start mb-16 lg:mb-24">
                           <h2 className="text-3xl md:text-4xl text-white/90 font-sans tracking-tight font-light">
                               Get the App
                           </h2>
                           <span className="text-4xl text-white font-serif font-bold italic leading-none">Y.</span>
                        </div>

                        {/* Bottom Row */}
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start lg:items-end">
                           {/* QR Box */}
                           <div className="w-48 h-48 bg-black rounded-3xl p-4 relative border border-white/10 flex items-center justify-center shrink-0 shadow-2xl">
                               <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://yureka.money&bgcolor=000&color=fff&margin=0" alt="App QR" className="w-full h-full object-contain opacity-90 rounded-xl" />
                               {/* Center Logo Cutout */}
                               <div className="absolute inset-0 m-auto w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.8)] border border-black/10">
                                   <span className="text-xl font-bold font-serif text-black italic">Y.</span>
                               </div>
                           </div>

                           {/* Copy and Buttons */}
                           <div className="flex flex-col flex-1 w-full gap-8">
                               <p className="text-white/60 text-sm md:text-base font-sans tracking-wide leading-relaxed max-w-lg">
                                   Get the Yureka app to make earning simpler, faster, and stress-free. Scan the QR or tap below to download and get started.
                               </p>
                               <div className="flex flex-col sm:flex-row items-center gap-8 w-full pt-6">
                                   <button className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/20 text-white/90 rounded-xl text-xs font-semibold hover:border-white/50 hover:bg-white/5 transition-all shadow-lg active:scale-95">
                                       Download on App store
                                   </button>
                                   <span className="text-xs text-white/30 cursor-not-allowed">
                                       Download on Play store (coming soon)
                                   </span>
                               </div>
                           </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default ComingSoon;