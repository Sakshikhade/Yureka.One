import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { 
  Sparkles, Zap, Brain, Rocket, ArrowRight, Bell, 
  Smartphone, Globe, Shield, Coins, MousePointer, 
  ShoppingBag, CheckCircle2, ChevronRight, MessageSquare,
  Search, Cpu, Lock, Layout, Star, Users, CreditCard
} from 'lucide-react';

/* --- PREMIUM UI WRAPPERS --- */

const WindowFrame: React.FC<{ children: React.ReactNode, title?: string, color?: string, dark?: boolean }> = ({ children, title, color = "clay", dark = false }) => {
  return (
    <div className={`w-full h-full ${dark ? 'bg-slate-900' : 'bg-white'} rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-black/[0.08] shadow-2xl transition-all duration-500 group-hover:shadow-${color}/10 group-hover:border-${color}/20 flex flex-col`}>
      {/* Browser/OS Top Bar */}
      <div className={`px-4 py-3 md:px-6 md:py-4 border-b ${dark ? 'border-white/5 bg-white/5' : 'border-black/5 bg-slate-50/50'} flex justify-between items-center backdrop-blur-md`}>
        <div className="flex gap-1.5 md:gap-2">
          <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${dark ? 'bg-red-500/30' : 'bg-red-400/40'}`} />
          <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${dark ? 'bg-amber-500/30' : 'bg-amber-400/40'}`} />
          <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${dark ? 'bg-emerald-500/30' : 'bg-emerald-400/40'}`} />
        </div>
        {title && (
          <div className="flex items-center gap-2">
            <span className={`text-[9px] md:text-[10px] font-medium uppercase tracking-[0.2em] ${dark ? 'text-white/40' : 'text-ink/40'}`}>{title}</span>
          </div>
        )}
        <div className={`text-[8px] md:text-[9px] font-medium italic tracking-wider ${dark ? 'text-white/10' : 'text-ink/10'}`}>V.2.4B</div>
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

const YurekaAIAnimation = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'user', text: "Ready to pull the trigger on the MacBook 16. Should I stick with my Amex Gold?", delay: 1000 },
    { id: 2, type: 'ai', text: "Hold up! Love the upgrade, but let's be strategic. Direct swipe on Amex is okay, but I've found a much better yield path for your specific wallet.", delay: 4500 },
    { id: 3, type: 'user', text: "Better than 5x points? How?", delay: 11000 },
    { id: 4, type: 'ai', text: "You're forgetting your HDFC SmartBuy cap isn't hit yet! If we route this through RewardX for an Apple voucher, you stack 10x points + an upfront 7% corporate discount. That's ₹12,400 in total value back.", delay: 14000 },
    { id: 5, type: 'user', text: "That's huge. What about my Marriott points goal for the Japan trip?", delay: 24000 },
    { id: 6, type: 'ai', text: "Exactly why we're doing this. This move alone gets you 2 free nights in Osaka. Direct swipe won't get you even halfway there. Shall I apply the stack?", delay: 28000 },
  ]);

  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [userInputStatus, setUserInputStatus] = useState("Idle"); 
  const [finishedTypingId, setFinishedTypingId] = useState<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timers: any[] = [];
    setUserInputStatus("Typing");
    
    messages.forEach((msg, i) => {
      const t = setTimeout(() => {
        if (msg.type === 'user') {
            const typingMsg = i === 2 ? "Analyzing point multipliers..." : i === 4 ? "Calculating Japan trip yield..." : "Analyzing wallet...";
            setUserInputStatus("Typing");
            setTimeout(() => {
                setUserInputStatus("Done");
                setVisibleMessages(prev => [...prev, msg.id]);
            }, 1200);
        } else {
            setIsThinking(true);
            setTimeout(() => {
                setIsThinking(false);
                setVisibleMessages(prev => [...prev, msg.id]);
            }, 2200);
        }
      }, msg.delay);
      timers.push(t);
    });
    
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  // Auto-scroll logic - refined for sticky typing
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    // Scroll when messages appear or thinking state changes
    scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
    });

    // If AI is currently typing, we need to keep pinning to bottom as text grows
    let scrollInterval: any;
    if (isThinking || visibleMessages.length > finishedTypingId.length) {
        scrollInterval = setInterval(() => {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }, 100); // More frequent updates for smooth pinning
    }

    return () => {
        if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [visibleMessages, isThinking, finishedTypingId]);

  return (
    <WindowFrame title="Yureka Neural Engine" color="teal">
      <div className="h-full flex flex-col bg-[#FDFCF9] relative overflow-hidden">
        {/* Dynamic Compute Pulse */}
        <AnimatePresence>
            {isThinking && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#1B4D4B]/[0.05] pointer-events-none"
                    style={{ filter: 'blur(60px)' }}
                />
            )}
        </AnimatePresence>

        {/* Scroll Fade Indicator */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#FDFCF9] to-transparent z-20 pointer-events-none" />

        <div 
            ref={scrollRef}
            className="flex-1 p-6 md:p-14 pt-12 md:pt-16 space-y-8 md:space-y-12 overflow-y-auto no-scrollbar relative z-10"
        >
          <AnimatePresence mode="popLayout">
            {messages.filter(m => visibleMessages.includes(m.id)).map((msg) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`flex items-end gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <motion.div 
                    animate={msg.type === 'user' ? { scale: [1, 1.1, 1] } : {}}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xl ${msg.type === 'user' ? 'bg-[#1B4D4B]' : 'bg-[#111111]'}`}
                >
                  {msg.type === 'user' ? <Search size={16} className="text-white/60" /> : <Cpu size={18} className="text-white" />}
                </motion.div>
                <div className={`max-w-[85%] px-6 py-5 rounded-[2rem] tracking-tight text-[12px] md:text-[14px] font-medium leading-relaxed shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)] border ${
                  msg.type === 'user' ? 'bg-white border-black/5 text-[#111111] rounded-br-none' : 'bg-[#111111] border-transparent text-white rounded-bl-none'
                }`}>
                  {msg.type === 'ai' ? (
                      <TypewriterText 
                        text={msg.text} 
                        delay={15} 
                        onComplete={() => setFinishedTypingId(prev => [...prev, msg.id])} 
                      />
                  ) : (
                      msg.text
                  )}
                </div>
              </motion.div>
            ))}
            
            {isThinking && (
              <motion.div 
                layout 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="flex items-center gap-4 px-12"
              >
                <div className="flex gap-2 py-5 px-8 bg-slate-100 rounded-3xl rounded-bl-none border border-black/5">
                   {[0, 1, 2].map(i => (
                     <motion.div 
                        key={i} 
                        animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        className="w-2 h-2 bg-[#1B4D4B] rounded-full" 
                     />
                   ))}
                </div>
                <span className="text-[10px] font-medium uppercase text-[#1B4D4B]/40 tracking-[0.2em] animate-pulse">Computing Yield Path...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Chat Footer */}
        <div className="p-8 border-t border-black/[0.03] bg-white/80 backdrop-blur-md relative z-10">
          <div className="h-14 md:h-16 bg-white rounded-3xl flex items-center px-8 justify-between border border-black/[0.08] shadow-sm">
             <div className="flex items-center gap-4 overflow-hidden">
                {userInputStatus === "Typing" && (
                    <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2.5 h-2.5 bg-[#1B4D4B] rounded-full shrink-0" />
                )}
                <span className={`text-[12px] md:text-base font-medium transition-all duration-500 truncate ${userInputStatus === "Typing" ? 'text-[#1B4D4B]' : 'text-[#111111]/20'}`}>
                    {userInputStatus === "Typing" ? "Analyzing Reward Transfer Matrix..." : "Ask Yureka Neural Assistant..."}
                </span>
             </div>
             <div className="flex items-center gap-4">
                <div className="h-8 w-[1px] bg-black/[0.08]" />
                <Rocket size={20} className={`transition-colors ${userInputStatus === "Typing" ? 'text-[#1B4D4B]' : 'text-[#111111]/10'}`} />
             </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
};


const RewardXAnimation = () => {
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(50000);
  const [savings, setSavings] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const steps = [
    { label: 'Merchant Cart', value: 50000, type: 'base', icon: <ShoppingBag size={18} /> },
    { label: 'RewardX Voucher', value: -4500, badge: '9% INSTANT', type: 'disc', icon: <Zap size={18} /> },
    { label: 'Axis Magnus Multiplier', value: -3050, badge: '10X POINTS', type: 'disc', icon: <Star size={18} /> },
    { label: 'Yureka Yield Stack', value: -1450, badge: '2.5% EXTRA', type: 'disc', icon: <Cpu size={18} /> },
    { label: 'Referral Kickback', value: -500, badge: '1% UNLOCKED', type: 'disc', icon: <Users size={18} /> }
  ];

  useEffect(() => {
    let timeout: any;
    const runSequence = (currentStep: number) => {
        const nextStep = (currentStep + 1) % (steps.length + 2);
        const delay = currentStep >= steps.length ? 10000 : 2500; 
        timeout = setTimeout(() => {
            setStep(nextStep);
            runSequence(nextStep);
        }, delay);
    };
    runSequence(0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (step === 0) {
        setCount(50000);
        setSavings(0);
    } else if (step > 0 && step <= steps.length - 1) {
        const targetValue = 50000 + steps.slice(1, step + 1).reduce((acc, curr) => acc + curr.value, 0);
        const targetSavings = Math.abs(steps.slice(1, step + 1).reduce((acc, curr) => acc + curr.value, 0));
        
        let c = count;
        let s = savings;
        const t = setInterval(() => {
            let changed = false;
            if (c > targetValue) { c -= 200; changed = true; }
            if (s < targetSavings) { s += 200; changed = true; }
            
            if (!changed) {
                setCount(targetValue);
                setSavings(targetSavings);
                clearInterval(t);
            } else {
                setCount(Math.max(c, targetValue));
                setSavings(Math.min(s, targetSavings));
            }
        }, 16);
        return () => clearInterval(t);
    }
  }, [step]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [step]);

  return (
    <WindowFrame title="Adaptive Yield Engine" color="orange">
      <div className="h-full flex flex-col bg-white relative overflow-hidden">
        
        <div className="p-10 md:p-14 pb-4 flex justify-between items-start relative z-20 shrink-0">
            <div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-2">
                    <div className="flex gap-1">
                       {[0, 1, 2].map(i => <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} className="w-1 h-1 rounded-full bg-orange-600" />)}
                    </div>
                    <span className="text-[9px] font-medium tracking-[0.3em] text-orange-600 uppercase">Yield Script Pulse</span>
                </motion.div>
                <h3 className="text-2xl md:text-3xl font-medium text-[#111111] tracking-tighter uppercase leading-tight">Executive<br />Protocol</h3>
            </div>
            <div className="text-right">
                <div className="text-[9px] font-medium text-[#111111]/30 tracking-widest uppercase mb-1">Total Yield Unlocked</div>
                <div className="text-2xl font-medium text-orange-600 tracking-tighter tabular-nums">₹{savings.toLocaleString()}</div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 px-8 md:px-12 pt-4 pb-40" ref={scrollRef}>
          <div className="space-y-3">
            {steps.map((s, i) => (
              i <= step && (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  className={`flex items-center justify-between p-5 rounded-[2rem] border-2 transition-all duration-700 ${
                    i === step ? 'bg-orange-50/50 border-orange-500/20 shadow-xl shadow-orange-500/5' : 'bg-white border-[#111111]/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <motion.div 
                        animate={i === step ? { scale: [1, 1.1, 1] } : {}}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                            i === 0 ? 'bg-[#111111] text-white' : 'bg-orange-500 text-white shadow-orange-500/30'
                        }`}
                    >
                      {s.icon}
                    </motion.div>
                    <div>
                      <div className="text-[14px] font-medium text-[#111111] uppercase tracking-tight">{s.label}</div>
                      <div className="text-[10px] font-medium text-[#111111]/40 uppercase tracking-[0.2em] flex items-center gap-2">
                        {i === 0 ? 'Source Node' : i < step ? 'Yield Executed' : 'Optimizing Logic...'}
                        {i === step && <motion.span animate={{ opacity: [1, 0, 1] }} className="text-orange-500 font-medium">●</motion.span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-base font-medium tracking-tight ${s.type === 'base' ? 'text-[#111111]' : 'text-orange-600'}`}>
                      {s.value > 0 ? '' : '−'}₹{Math.abs(s.value).toLocaleString()}
                    </div>
                    {s.badge && (
                      <div className="inline-block px-2.5 py-1 mt-1 bg-orange-600 text-white text-[9px] font-medium rounded-lg tracking-tight shadow-sm">
                        {s.badge}
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            ))}

            {step >= steps.length && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="p-8 bg-[#111111] rounded-[3rem] text-white flex items-center justify-between shadow-2xl relative overflow-hidden group border-4 border-orange-500/10 mt-6"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent translate-x-[-100%] animate-[shimmer_3s_infinite]" />
                <div className="relative z-10">
                    <div className="text-[10px] font-medium text-white/40 uppercase tracking-[0.4em] mb-2">Settlement Pipeline Value</div>
                    <div className="text-4xl font-medium tracking-tight">₹{count.toLocaleString()}</div>
                </div>
                <div className="relative z-10 bg-orange-600 px-6 py-4 rounded-[1.5rem] shadow-xl rotate-3 group-hover:rotate-0 transition-all duration-500 border-2 border-white/10">
                   <div className="text-[10px] font-medium text-white/60 uppercase tracking-widest mb-1 text-center">Net Yield</div>
                   <div className="text-2xl font-medium tabular-nums tracking-tighter">19.2%</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="p-12 pt-8 relative z-10 flex items-center justify-between border-t border-[#111111]/[0.03] bg-slate-50/30 shrink-0">
            <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                            <div className="w-full h-full bg-gradient-to-br from-slate-400 to-slate-500" />
                        </div>
                    ))}
                </div>
                <div className="text-[9px] font-medium text-[#111111]/30 uppercase tracking-[0.3em] animate-pulse">Running Optimized Swipe Path v4.9.2</div>
            </div>
            <div className="text-[9px] font-medium text-[#111111] uppercase tracking-[0.3em]">Code: RX-VAULT-7</div>
        </div>
      </div>
    </WindowFrame>
  );
};


const ExtensionAnimation = () => {
    const [journeyStep, setJourneyStep] = useState(0); // 0: Idle, 1: Page Scan, 2: Card Scan, 3: Voucher Scan, 4: Suggestion, 5: Result
    const [activeTab, setActiveTab] = useState('Home');

    useEffect(() => {
        const sequence = async () => {
            setJourneyStep(0);
            await new Promise(r => setTimeout(r, 2000));
            setJourneyStep(1); // Page Scan
            await new Promise(r => setTimeout(r, 2500));
            setJourneyStep(2); // Card Scan
            await new Promise(r => setTimeout(r, 2500));
            setJourneyStep(3); // Voucher Scan
            await new Promise(r => setTimeout(r, 2500));
            setJourneyStep(4); // Suggestion
            await new Promise(r => setTimeout(r, 2500));
            setJourneyStep(5); // Result
            await new Promise(r => setTimeout(r, 10000));
            sequence(); // Loop
        };
        sequence();
    }, []);

    const renderJourneyContent = () => {
        switch(journeyStep) {
            case 1:
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 py-4">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-black/[0.03]">
                            <div className="w-10 h-10 border-2 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
                            <div>
                                <div className="text-[10px] font-medium uppercase text-ink/40 tracking-widest">Protocol 1</div>
                                <div className="text-[12px] font-medium text-ink">Scanning Merchant Data...</div>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 2.5 }} className="h-full bg-teal-500 w-full" />
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 py-4">
                        <div className="flex gap-4 items-center mb-4">
                            {[0, 1, 2].map(i => (
                                <motion.div key={i} animate={{ rotateY: [0, 360], y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }} className="w-12 h-8 bg-slate-900 rounded-md border border-white/10" />
                            ))}
                        </div>
                        <div>
                            <div className="text-[10px] font-medium uppercase text-ink/40 tracking-widest">Protocol 2</div>
                            <div className="text-[14px] font-medium text-ink">Analyzing 4 saved Credit Cards...</div>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 py-4">
                         <div className="flex flex-col gap-2">
                            {[0, 1, 2].map(i => (
                                <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.3 }} className="h-8 bg-amber-50 border border-amber-100 rounded-xl flex items-center px-4 justify-between">
                                    <div className="text-[9px] font-medium text-amber-700 uppercase">Voucher Node #{i+102}</div>
                                    <Zap size={10} className="text-amber-500" />
                                </motion.div>
                            ))}
                        </div>
                        <div>
                            <div className="text-[10px] font-medium uppercase text-ink/40 tracking-widest">Protocol 3</div>
                            <div className="text-[14px] font-medium text-ink">Auditing institutional gift cards...</div>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 py-4 text-center">
                        <motion.div animate={{ scale: [1, 1.2, 1] }} className="w-20 h-20 bg-emerald-500 rounded-full mx-auto flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30">
                            <Star size={32} />
                        </motion.div>
                        <div>
                            <div className="text-[11px] font-medium uppercase text-emerald-600 tracking-widest mb-2">Optimal Path Logged</div>
                            <div className="text-lg font-medium text-ink leading-tight">Match: HDFC Infinia + High-Yield Voucher</div>
                        </div>
                    </motion.div>
                );
            case 5:
                return (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="p-5 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center justify-between shadow-sm">
                            <div>
                                <div className="text-[10px] font-medium text-emerald-700 uppercase tracking-widest mb-1">Final Result</div>
                                <div className="text-2xl font-medium text-emerald-900 tracking-tighter">₹12,840.00</div>
                            </div>
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-emerald-100 text-emerald-600">
                                <Sparkles size={20} />
                            </motion.div>
                        </div>

                        <div className="space-y-2">
                             {[
                                { label: 'Best Card', val: 'HDFC Infinia (16.2%)', icon: <CreditCard size={12} /> },
                                { label: 'Gift Card Stack', val: 'Amazon Prime (₹4,500)', icon: <Zap size={12} /> }
                             ].map((row, i) => (
                                <div key={i} className="flex justify-between items-center p-3.5 bg-slate-50/50 rounded-2xl border border-black/[0.03]">
                                    <div className="flex items-center gap-3">
                                        <div className="text-teal-600">{row.icon}</div>
                                        <span className="text-[10px] font-medium text-ink/30 uppercase tracking-tight">{row.label}</span>
                                    </div>
                                    <span className="text-[11px] font-medium text-ink">{row.val}</span>
                                </div>
                             ))}
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full h-16 bg-[#1B4D4B] text-white rounded-[1.5rem] text-[11px] font-medium uppercase tracking-[0.2em] shadow-2xl shadow-teal-900/30 flex items-center justify-center gap-3 relative group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            Apply Protocol <MousePointer size={14} className="opacity-40" />
                        </motion.button>
                    </motion.div>
                );
            default:
                return (
                    <div className="py-12 text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-3xl mx-auto flex items-center justify-center text-slate-200">
                            <Sparkles size={32} />
                        </div>
                        <div className="text-[11px] font-medium text-ink/20 uppercase tracking-[0.3em]">Agent in standby</div>
                    </div>
                );
        }
    };

    return (
        <WindowFrame title="Hyper-Extension Protocol" color="teal">
            <div className="h-full bg-slate-50 relative flex flex-col overflow-hidden">
                {/* BROWSER HEADER */}
                <div className="bg-[#f1f3f4] p-3 border-b border-black/[0.08] flex items-center gap-3 md:gap-5 shrink-0">
                    <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center"><ChevronRight size={12} className="rotate-180 text-black/20" /></div>
                        <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center"><ChevronRight size={12} className="text-black/20" /></div>
                    </div>
                    {/* Address Bar */}
                    <div className="flex-1 h-8 bg-white rounded-full border border-black/[0.04] px-4 flex items-center justify-between group">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <Lock size={10} className="text-emerald-500" />
                            <span className="text-[11px] font-medium text-black/40 truncate">amazon.in/cart/checkout/review</span>
                        </div>
                        <Star size={12} className="text-black/10 group-hover:text-amber-400 transition-colors cursor-pointer" />
                    </div>
                    {/* Extension Toolbar */}
                    <div className="flex items-center gap-3">
                        <motion.div 
                            animate={journeyStep > 0 ? { 
                                scale: [1, 1.1, 1],
                                backgroundColor: '#1B4D4B',
                                boxShadow: '0 10px 20px -5px rgba(27, 77, 75, 0.4)'
                            } : {}}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-black/5"
                        >
                            <Sparkles size={16} className={journeyStep > 0 ? 'text-white' : 'text-black/20'} />
                        </motion.div>
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
                            <div className="w-full h-full bg-slate-300" />
                        </div>
                    </div>
                </div>

                {/* MERCHANT CART BACKGROUND */}
                <div className="flex-1 p-6 md:p-10 relative overflow-hidden">
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div className="text-sm font-medium text-ink/80 tracking-tight mb-4 flex justify-between">
                                <span>Shopping Cart (2 items)</span>
                                <span className="text-ink/20">Price</span>
                            </div>
                            {[
                                { name: 'iPhone 15 Pro', spec: '128GB, Natural Titanium', price: '₹1,24,900', img: 'bg-slate-900' },
                                { name: 'Sony WH-1000XM5', spec: 'Noise Canceling, Black', price: '₹29,990', img: 'bg-slate-200' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 border-b border-black/[0.04] pb-6">
                                    <div className={`w-20 h-24 ${item.img} rounded-xl shadow-sm flex items-center justify-center`}>
                                        <div className="w-10 h-10 bg-white/20 rounded-full blur-xl" />
                                    </div>
                                    <div className="flex-1 justify-between flex">
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium text-ink">{item.name}</div>
                                            <div className="text-[10px] font-medium text-ink/30 uppercase tracking-widest">{item.spec}</div>
                                            <div className="text-[10px] text-emerald-500 font-medium mt-2 lowercase">In Stock</div>
                                        </div>
                                        <div className="text-sm font-medium text-ink">{item.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-black/[0.05] shadow-sm h-fit space-y-6">
                             <div className="text-xs font-medium text-ink uppercase tracking-widest">Order Summary</div>
                             <div className="space-y-3">
                                <div className="flex justify-between text-[11px] font-medium text-ink/40 uppercase"><span>Subtotal</span><span>₹1,54,890</span></div>
                                <div className="flex justify-between text-[11px] font-medium text-ink/40 uppercase"><span>Shipping</span><span className="text-emerald-500">FREE</span></div>
                             </div>
                             <div className="h-[1px] bg-black/5" />
                             <div className="flex justify-between items-end">
                                <div className="text-[10px] font-medium text-ink uppercase tracking-widest leading-none mb-1">Total</div>
                                <div className="text-xl font-medium text-ink tracking-tight">₹1,54,890</div>
                             </div>
                             <motion.div animate={journeyStep === 5 ? { opacity: 0.5, scale: 0.95 } : {}} className="w-full h-12 bg-amber-400 rounded-xl flex items-center justify-center text-[10px] font-medium uppercase tracking-widest text-ink shadow-lg shadow-amber-400/20">
                                Proceed to Buy
                             </motion.div>
                        </div>
                    </div>

                    {/* Scanning Journey Overlays */}
                    <AnimatePresence>
                        {journeyStep === 1 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-64 h-64 border-4 border-teal-500/30 rounded-full blur-md" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {journeyStep > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: -40, x: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                            className="absolute top-[68px] right-6 w-[360px] bg-white/70 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_48px_100px_-15px_rgba(0,0,0,0.35)] border border-white/50 z-50 overflow-hidden flex flex-col"
                        >
                            <div className="p-6 bg-white/20 border-b border-black/[0.03] flex items-center justify-between flex-shrink-0 backdrop-blur-md">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 bg-[#1B4D4B] rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-teal-900/40 relative group">
                                        <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Sparkles size={20} className="relative z-10" />
                                    </div>
                                    <div>
                                       <span className="text-[14px] font-medium uppercase tracking-widest text-[#1B4D4B] block leading-none mb-1">Hyperagent v2</span>
                                       <span className="text-[9px] font-medium text-black/30 uppercase tracking-[0.3em] font-mono">Neural Node Audit</span>
                                    </div>
                                </div>
                                <div className="px-5 py-2 rounded-xl text-[10px] font-medium uppercase tracking-widest bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                                   Protocol {journeyStep}/5
                                </div>
                            </div>
                            <div className="flex-1 p-10 min-h-[340px] flex flex-col justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.div key={journeyStep} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                                        {renderJourneyContent()}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Status Bar */}
                <div className="p-5 bg-white border-t border-black/[0.03] flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-medium uppercase tracking-widest text-black/30">Stable Uplink</span>
                    </div>
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
            color: 'orange'
        },
        {
            title: 'Browser Extension',
            label: 'Ghostwriter',
            desc: 'Your checkout companion. It lives on your toolbar and applies the magic moment you hit any payment page.',
            component: <ExtensionAnimation />,
        }
    ];

    return (
        <section ref={containerRef} className="relative min-h-screen bg-[#FDFCF9] font-sans selection:bg-clay selection:text-white overflow-hidden py-16 md:py-32">
            
            {/* Premium Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[1000px] bg-gradient-to-b from-[#1B4D4B]/5 to-transparent pointer-events-none" />
            <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-clay/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-5%] w-[800px] h-[800px] bg-teal-500/5 blur-[160px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                {/* Tactical Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 md:gap-16 mb-24 md:mb-32">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 mb-6 md:mb-10 bg-white border border-black/5 rounded-full shadow-sm backdrop-blur-xl">
                            <span className="w-2 h-2 rounded-full bg-clay animate-pulse" />
                            <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-[0.2em] text-ink/60">Intelligence Pipeline / v0.9.4B</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[0.9] text-ink uppercase">
                            The <br />
                           <span className="text-transparent bg-clip-text bg-gradient-to-r from-clay via-[#1B4D4B] to-ink italic font-thin serif">Elite</span><br />
                           Standard.
                        </h2>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="lg:max-w-xs space-y-6 md:space-y-8 pb-4"
                    >
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-[1.2rem] md:rounded-3xl flex items-center justify-center shadow-2xl border border-black/5 rotate-3 hover:rotate-0 transition-transform duration-500 backdrop-blur-xl">
                            <Lock className="text-clay" size={24} />
                        </div>
                        <p className="text-ink/40 text-xs md:text-sm font-medium leading-relaxed tracking-tight max-w-xs">
                           Our system interprets 10^7 variables per second to render "guessing" obsolete. This is the automation of financial superiority.
                        </p>
                    </motion.div>
                </div>

                {/* Vertical Feature Stack - Editorial Style */}
                <div className="space-y-16 md:space-y-24">
                    {features.map((feature, idx) => (
                        <div key={idx} className={`flex flex-col lg:flex-row gap-12 md:gap-32 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                            {/* Visual Mockup Container */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98, y: 60 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full lg:w-3/5 group relative"
                            >
                                <div className="relative aspect-[3/4] md:aspect-[4/5] max-w-full">
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
                                className="w-full lg:w-2/5 space-y-6 md:space-y-10"
                            >
                                <div className="space-y-4">
                                   <div className="flex items-center gap-3">
                                      <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-[0.3em] text-ink/20">{feature.label}</span>
                                      <div className="h-[1px] w-8 md:w-12 bg-ink/5" />
                                   </div>
                                   <h3 className="text-3xl md:text-4xl font-medium text-ink tracking-tight uppercase leading-none">
                                      {feature.title}
                                   </h3>
                                </div>
                                <p className="text-ink/50 text-sm md:text-lg font-medium leading-relaxed max-w-sm">
                                   {feature.desc}
                                </p>
                                <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                   <button className="h-12 md:h-14 px-8 md:px-10 bg-ink text-white rounded-full text-[9px] md:text-[10px] font-medium uppercase tracking-[0.2em] shadow-2xl shadow-black/10 hover:bg-clay hover:-translate-y-1 transition-all active:scale-95 group shrink-0">
                                      Join Internal Test <ChevronRight size={14} className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                                   </button>
                                   <div className="flex flex-col">
                                      <span className="text-[8px] md:text-[9px] font-medium text-ink/10 uppercase tracking-widest">Availability</span>
                                      <span className="text-[9px] md:text-[10px] font-medium text-clay uppercase italic">Limited Access Nodes</span>
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
                    className="mt-32 md:mt-64 p-8 md:p-32 bg-ink rounded-[2.5rem] md:rounded-[4rem] text-center relative overflow-hidden group border border-white/5"
                >
                    {/* Dark Grain Overlay */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-clay/10 blur-[160px] rounded-full pointer-events-none" />
                    
                    <div className="relative z-10 max-w-4xl mx-auto">
                        <Sparkles className="mx-auto mb-8 md:mb-12 text-clay" size={32} />
                        <h4 className="text-3xl md:text-6xl font-medium text-white mb-8 md:mb-10 tracking-tight leading-[1] uppercase">
                            Secure the <span className="italic font-thin serif text-clay">Neural Node</span> before public release.
                        </h4>
                        
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            <div className="w-full md:flex-1 relative">
                                <input 
                                    type="email" 
                                    placeholder="Enter institutional email..." 
                                    className="w-full h-14 md:h-16 px-8 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-clay/50 transition-all text-xs uppercase tracking-widest"
                                />
                            </div>
                            <button className="w-full md:w-auto h-14 md:h-16 px-10 md:px-12 bg-white text-ink font-medium uppercase tracking-widest text-[9px] md:text-[10px] rounded-xl md:rounded-2xl hover:bg-clay hover:text-white transition-all shadow-2xl active:scale-95 shrink-0">
                                Register Interest
                            </button>
                        </div>
                        
                        <div className="mt-16 md:mt-20 pt-10 md:pt-16 border-t border-white/5 flex flex-wrap justify-center gap-6 md:gap-12 text-[8px] md:text-[10px] font-medium uppercase tracking-[0.3em] text-white/10">
                            <div className="flex items-center gap-2 md:gap-3"><Shield size={14} /> Encrypted</div>
                            <div className="flex items-center gap-2 md:gap-3"><Cpu size={14} /> Accelerated</div>
                            <div className="flex items-center gap-2 md:gap-3"><Globe size={14} /> Priority</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ComingSoon;