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
    <div className={`w-full h-full bg-[#0a0a0a] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl transition-all duration-500 group-hover:shadow-${color}/10 group-hover:border-${color}/20 flex flex-col`}>
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
      <div className="h-full flex flex-col bg-[#0a0a0a] relative overflow-hidden">
        {/* Dynamic Compute Pulse */}
        <AnimatePresence>
            {isThinking && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#34d399]/[0.05] pointer-events-none"
                    style={{ filter: 'blur(60px)' }}
                />
            )}
        </AnimatePresence>

        {/* Scroll Fade Indicator */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#0a0a0a] to-transparent z-20 pointer-events-none" />

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
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xl ${msg.type === 'user' ? 'bg-[#34d399]' : 'bg-white/5'}`}
                >
                  {msg.type === 'user' ? <Search size={16} className="text-[#0a0a0a]" /> : <Cpu size={18} className="text-white/60" />}
                </motion.div>
                <div className={`max-w-[90%] md:max-w-[85%] px-4 py-3 md:px-6 md:py-5 rounded-[1.5rem] md:rounded-[2rem] tracking-tight text-[11px] md:text-[14px] font-medium leading-relaxed shadow-[0_15px_35px_-5px_rgba(0,0,0,0.4)] border ${
                  msg.type === 'user' ? 'bg-white/5 border-white/5 text-white rounded-br-none' : 'bg-[#34d399] border-[#34d399] text-[#0a0a0a] rounded-bl-none shadow-lg shadow-[#34d399]/20'
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
                <div className="flex gap-2 py-5 px-8 bg-white/5 rounded-3xl rounded-bl-none border border-white/5">
                   {[0, 1, 2].map(i => (
                     <motion.div 
                        key={i} 
                        animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        className="w-2 h-2 bg-[#34d399] rounded-full" 
                     />
                   ))}
                </div>
                <span className="text-[10px] font-medium uppercase text-[#34d399]/40 tracking-[0.2em] animate-pulse">Computing Yield Path...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Chat Footer */}
        <div className="p-8 border-t border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md relative z-10">
          <div className="h-14 md:h-16 bg-white/5 rounded-3xl flex items-center px-8 justify-between border border-white/5 shadow-sm">
             <div className="flex items-center gap-4 overflow-hidden">
                {userInputStatus === "Typing" && (
                    <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2.5 h-2.5 bg-[#34d399] rounded-full shrink-0" />
                )}
                <span className={`text-[10px] md:text-base font-medium transition-all duration-500 truncate ${userInputStatus === "Typing" ? 'text-[#34d399]' : 'text-white/20'}`}>
                    {userInputStatus === "Typing" ? "Analyzing Reward Matrix..." : "Ask Yureka Neural Assistant..."}
                </span>
             </div>
             <div className="flex items-center gap-4">
                <div className="h-8 w-[1px] bg-white/5" />
                <Rocket size={20} className={`transition-colors ${userInputStatus === "Typing" ? 'text-[#34d399]' : 'text-white/10'}`} />
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
    <WindowFrame title="Adaptive Yield Engine" color="emerald">
      <div className="h-full flex flex-col bg-[#0a0a0a] relative overflow-hidden">
        
        <div className="p-10 md:p-14 pb-4 flex justify-between items-start relative z-20 shrink-0">
            <div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-2">
                    <div className="flex gap-1">
                       {[0, 1, 2].map(i => <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} className="w-1 h-1 rounded-full bg-[#34d399]" />)}
                    </div>
                    <span className="text-[9px] font-medium tracking-[0.3em] text-[#34d399] uppercase">Yield Script Pulse</span>
                </motion.div>
                <h3 className="text-2xl md:text-3xl font-medium text-white tracking-tighter uppercase leading-tight">Executive<br />Protocol</h3>
            </div>
            <div className="text-right">
                <div className="text-[9px] font-medium text-white/30 tracking-widest uppercase mb-1">Total Yield Unlocked</div>
                <div className="text-2xl font-medium text-[#34d399] tracking-tighter tabular-nums">₹{savings.toLocaleString()}</div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 px-8 md:px-12 pt-4 pb-6" ref={scrollRef}>
          <div className="space-y-3">
            {steps.map((s, i) => (
              i <= step && (
                <motion.div
                  key={i}
                  layout
                  initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  className={`flex items-center justify-between p-5 rounded-[2rem] border transition-all duration-700 ${
                    i === step ? 'bg-white/10 border-white/10 shadow-xl' : 'bg-white/5 border-white/5'
                  }`}
                >
                    <div className="flex items-center gap-5">
                      <motion.div 
                          animate={i === step ? { scale: [1, 1.1, 1] } : {}}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                              i === 0 ? 'bg-white text-[#0a0a0a]' : 'bg-[#34d399] text-[#0a0a0a] shadow-[#34d399]/20'
                          }`}
                      >
                      {s.icon}
                    </motion.div>
                    <div>
                      <div className="text-[14px] font-medium text-white uppercase tracking-tight">{s.label}</div>
                      <div className="text-[10px] font-medium text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                        {i === 0 ? 'Source Node' : i < step ? 'Yield Executed' : 'Optimizing Logic...'}
                        {i === step && <motion.span animate={{ opacity: [1, 0, 1] }} className="text-[#34d399] font-medium">●</motion.span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-base font-medium tracking-tight ${s.type === 'base' ? 'text-white' : 'text-[#34d399]'}`}>
                      {s.value > 0 ? '' : '−'}₹{Math.abs(s.value).toLocaleString()}
                    </div>
                    {s.badge && (
                      <div className="inline-block px-2.5 py-1 mt-1 bg-[#34d399] text-[#0a0a0a] text-[9px] font-bold rounded-lg tracking-tight shadow-sm">
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
                className="p-8 bg-white/5 rounded-[3rem] text-white flex items-center justify-between shadow-2xl relative overflow-hidden group border border-white/10 mt-6"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#34d399]/20 to-transparent translate-x-[-100%] animate-[shimmer_3s_infinite]" />
                <div className="relative z-10">
                    <div className="text-[10px] font-medium text-white/40 uppercase tracking-[0.4em] mb-2">Settlement Pipeline Value</div>
                    <div className="text-4xl font-medium tracking-tight">₹{count.toLocaleString()}</div>
                </div>
                <div className="relative z-10 bg-[#34d399] px-6 py-4 rounded-[1.5rem] shadow-xl rotate-3 group-hover:rotate-0 transition-all duration-500 border border-white/10 text-[#0a0a0a]">
                   <div className="text-[10px] font-bold uppercase tracking-widest mb-1 text-center">Net Yield</div>
                   <div className="text-2xl font-bold tabular-nums tracking-tighter">19.2%</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="p-12 pt-8 relative z-10 flex items-center justify-between border-t border-white/5 bg-white/5 shrink-0">
            <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-4 border-[#0a0a0a] bg-white/10 overflow-hidden shadow-sm">
                            <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/30" />
                        </div>
                    ))}
                </div>
                <div className="text-[9px] font-medium text-white/30 uppercase tracking-[0.3em] animate-pulse">Running Optimized Swipe Path v4.9.2</div>
            </div>
            <div className="text-[9px] font-medium text-white/40 uppercase tracking-[0.3em]">Code: RX-VAULT-7</div>
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
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="w-10 h-10 border-2 border-[#34d399]/20 border-t-[#34d399] rounded-full animate-spin" />
                            <div>
                                <div className="text-[10px] font-medium uppercase text-white/40 tracking-widest">Protocol 1</div>
                                <div className="text-[12px] font-medium text-white">Scanning Merchant Data...</div>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 2.5 }} className="h-full bg-[#34d399] w-full" />
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 py-4">
                        <div className="flex gap-4 items-center mb-4">
                            {[0, 1, 2].map(i => (
                                <motion.div key={i} animate={{ rotateY: [0, 360], y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }} className="w-12 h-8 bg-white/10 rounded-md border border-white/10" />
                            ))}
                        </div>
                        <div>
                            <div className="text-[10px] font-medium uppercase text-white/40 tracking-widest">Protocol 2</div>
                            <div className="text-[14px] font-medium text-white">Analyzing 4 saved Credit Cards...</div>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 py-4">
                         <div className="flex flex-col gap-2">
                            {[0, 1, 2].map(i => (
                                <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.3 }} className="h-8 bg-white/5 border border-white/10 rounded-xl flex items-center px-4 justify-between">
                                    <div className="text-[9px] font-medium text-white/60 uppercase">Voucher Node #{i+102}</div>
                                    <Zap size={10} className="text-[#34d399]" />
                                </motion.div>
                            ))}
                        </div>
                        <div>
                            <div className="text-[10px] font-medium uppercase text-white/40 tracking-widest">Protocol 3</div>
                            <div className="text-[14px] font-medium text-white">Auditing institutional gift cards...</div>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 py-4 text-center">
                        <motion.div animate={{ scale: [1, 1.2, 1] }} className="w-20 h-20 bg-[#34d399] rounded-full mx-auto flex items-center justify-center text-[#0a0a0a] shadow-2xl shadow-[#34d399]/20">
                            <Star size={32} />
                        </motion.div>
                        <div>
                            <div className="text-[11px] font-bold uppercase text-[#34d399] tracking-widest mb-2">Optimal Path Logged</div>
                            <div className="text-lg font-medium text-white leading-tight">Match: HDFC Infinia + High-Yield Voucher</div>
                        </div>
                    </motion.div>
                );
            case 5:
                return (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="p-5 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-between shadow-sm">
                            <div>
                                <div className="text-[10px] font-bold text-[#34d399] uppercase tracking-widest mb-1">Final Result</div>
                                <div className="text-2xl font-medium text-white tracking-tighter">₹12,840.00</div>
                            </div>
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 text-[#34d399]">
                                <Sparkles size={20} />
                            </motion.div>
                        </div>

                        <div className="space-y-2">
                             {[
                                { label: 'Best Card', val: 'HDFC Infinia (16.2%)', icon: <CreditCard size={12} /> },
                                { label: 'Gift Card Stack', val: 'Amazon Prime (₹4,500)', icon: <Zap size={12} /> }
                             ].map((row, i) => (
                                <div key={i} className="flex justify-between items-center p-3.5 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="text-[#34d399]">{row.icon}</div>
                                        <span className="text-[10px] font-medium text-white/30 uppercase tracking-tight">{row.label}</span>
                                    </div>
                                    <span className="text-[11px] font-medium text-white">{row.val}</span>
                                </div>
                             ))}
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full h-16 bg-[#34d399] text-[#0a0a0a] rounded-[1.5rem] text-[11px] font-bold uppercase tracking-[0.2em] shadow-2xl shadow-emerald-900/30 flex items-center justify-center gap-3 relative group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            Apply Protocol <MousePointer size={14} className="opacity-40" />
                        </motion.button>
                    </motion.div>
                );
            default:
                return (
                    <div className="py-12 text-center space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-3xl mx-auto flex items-center justify-center text-white/10">
                            <Sparkles size={32} />
                        </div>
                        <div className="text-[11px] font-medium text-white/20 uppercase tracking-[0.3em]">Agent in standby</div>
                    </div>
                );
        }
    };

    return (
        <WindowFrame title="Hyper-Extension Protocol" color="teal">
            <div className="h-full bg-[#0a0a0a] relative flex flex-col overflow-hidden">
                {/* BROWSER HEADER */}
                <div className="bg-white/5 p-3 border-b border-white/10 flex items-center gap-3 md:gap-5 shrink-0">
                    <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/5 shadow-sm flex items-center justify-center"><ChevronRight size={12} className="rotate-180 text-white/20" /></div>
                        <div className="w-6 h-6 rounded-full bg-white/5 shadow-sm flex items-center justify-center"><ChevronRight size={12} className="text-white/20" /></div>
                    </div>
                    {/* Address Bar */}
                    <div className="flex-1 h-8 bg-white/5 rounded-full border border-white/10 px-4 flex items-center justify-between group">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <Lock size={10} className="text-emerald-500" />
                            <span className="text-[11px] font-medium text-white/40 truncate">amazon.in/cart/checkout/review</span>
                        </div>
                        <Star size={12} className="text-white/10 group-hover:text-amber-400 transition-colors cursor-pointer" />
                    </div>
                    {/* Extension Toolbar */}
                    <div className="flex items-center gap-3">
                        <motion.div 
                            animate={journeyStep > 0 ? { 
                                scale: [1, 1.1, 1],
                                backgroundColor: '#34d399',
                                boxShadow: '0 10px 20px -5px rgba(52, 211, 153, 0.4)'
                            } : {}}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-white/5"
                        >
                            <Sparkles size={16} className={journeyStep > 0 ? 'text-[#0a0a0a]' : 'text-white/20'} />
                        </motion.div>
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/10 shadow-sm">
                            <div className="w-full h-full bg-white/10" />
                        </div>
                    </div>
                </div>

                {/* MERCHANT CART BACKGROUND */}
                <div className="flex-1 p-6 md:p-10 relative overflow-hidden">
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div className="text-sm font-medium text-white/80 tracking-tight mb-4 flex justify-between">
                                <span>Shopping Cart (2 items)</span>
                                <span className="text-white/20">Price</span>
                            </div>
                            {[
                                { name: 'iPhone 15 Pro', spec: '128GB, Natural Titanium', price: '₹1,24,900', img: 'bg-white/10' },
                                { name: 'Sony WH-1000XM5', spec: 'Noise Canceling, Black', price: '₹29,990', img: 'bg-white/10' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 border-b border-white/5 pb-6">
                                    <div className={`w-20 h-24 ${item.img} rounded-xl shadow-sm flex items-center justify-center border border-white/10`}>
                                        <div className="w-10 h-10 bg-white/20 rounded-full blur-md" />
                                    </div>
                                    <div className="flex-1 justify-between flex">
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium text-white">{item.name}</div>
                                            <div className="text-[10px] font-medium text-white/30 uppercase tracking-widest">{item.spec}</div>
                                            <div className="text-[10px] text-[#34d399] font-medium mt-2 lowercase">In Stock</div>
                                        </div>
                                        <div className="text-sm font-medium text-white">{item.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/5 shadow-sm h-fit space-y-6">
                             <div className="text-xs font-medium text-white uppercase tracking-widest">Order Summary</div>
                             <div className="space-y-3">
                                <div className="flex justify-between text-[11px] font-medium text-white/40 uppercase"><span>Subtotal</span><span>₹1,54,890</span></div>
                                <div className="flex justify-between text-[11px] font-medium text-white/40 uppercase"><span>Shipping</span><span className="text-[#34d399]">FREE</span></div>
                             </div>
                             <div className="h-[1px] bg-white/5" />
                             <div className="flex justify-between items-end">
                                <div className="text-[10px] font-medium text-white uppercase tracking-widest leading-none mb-1">Total</div>
                                <div className="text-xl font-medium text-white tracking-tight">₹1,54,890</div>
                             </div>
                             <motion.div animate={journeyStep === 5 ? { opacity: 0.5, scale: 0.95 } : {}} className="w-full h-12 bg-[#34d399] rounded-xl flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-[#0a0a0a] shadow-lg shadow-[#34d399]/20">
                                Proceed to Buy
                             </motion.div>
                        </div>
                    </div>

                    {/* Scanning Journey Overlays */}
                    <AnimatePresence>
                        {journeyStep === 1 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                                <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-64 h-64 border-4 border-[#34d399]/30 rounded-full blur-md" />
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
                            className="absolute top-[68px] right-3 w-[320px] sm:w-[340px] bg-[#121212] backdrop-blur-3xl rounded-[2rem] shadow-[0_48px_100px_-15px_rgba(0,0,0,0.6)] border border-white/10 z-50 overflow-hidden flex flex-col max-h-[calc(100%-80px)]"
                        >
                            <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between flex-shrink-0 backdrop-blur-md">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 bg-[#34d399] rounded-2xl flex items-center justify-center text-[#0a0a0a] shadow-2xl shadow-teal-900/40 relative group">
                                        <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Sparkles size={20} className="relative z-10" />
                                    </div>
                                    <div>
                                       <span className="text-[14px] font-bold uppercase tracking-widest text-[#34d399] block leading-none mb-1">Hyperagent v2</span>
                                       <span className="text-[9px] font-medium text-white/30 uppercase tracking-[0.3em] font-mono">Neural Node Audit</span>
                                    </div>
                                </div>
                                <div className="px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-[#34d399] text-[#0a0a0a] shadow-lg shadow-[#34d399]/20">
                                   Protocol {journeyStep}/5
                                </div>
                            </div>
                            <div className="flex-1 p-6 md:p-8 overflow-y-auto">
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
                <div className="p-5 bg-white/5 border-t border-white/5 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
                        <span className="text-[10px] font-medium uppercase tracking-widest text-white/30">Stable Uplink</span>
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
        <section ref={containerRef} className="relative min-h-screen bg-[#0a0a0a] font-sans selection:bg-[#34d399] selection:text-[#0a0a0a] overflow-hidden py-16 md:py-32">
            
            {/* Premium Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[1000px] bg-gradient-to-b from-[#34d399]/5 to-transparent pointer-events-none" />
            <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-[#34d399]/5 blur-[120px] rounded-full pointer-events-none" />
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
                            <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
                            <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">Intelligence Pipeline / v0.9.4B</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl lg:text-[clamp(1.5rem,4vw,4.5rem)] font-heading font-extrabold tracking-tight leading-[0.9] text-white uppercase">
                            The <br />
                           <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#34d399] to-white/50 italic font-thin serif">Elite</span><br />
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
                            <Lock className="text-[#34d399]" size={24} />
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
                                   <div className={`absolute -inset-10 bg-gradient-to-br from-[#34d399]/5 to-transparent blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
                                   {feature.component}
                                </div>
                            </motion.div>

                            {/* Copy Content */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1 }}
                                className="w-full lg:w-1/2 space-y-6 md:space-y-8 px-4"
                            >
                                <div className="space-y-4">
                                   <div className="flex items-center gap-3">
                                      <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-[0.3em] text-white/20">{feature.label}</span>
                                      <div className="h-[1px] w-8 md:w-12 bg-white/5" />
                                   </div>
                                   <h3 className="text-3xl md:text-4xl lg:text-[clamp(1.5rem,3vw,4rem)] font-heading font-extrabold text-white tracking-tight uppercase leading-none">
                                      {feature.title}
                                   </h3>
                                </div>
                                <p className="text-white/50 text-sm md:text-lg font-medium leading-relaxed max-w-md">
                                   {feature.desc}
                                </p>
                                <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                   <Link to="/join-waitlist" className="h-12 md:h-14 px-8 md:px-10 bg-white text-[#0a0a0a] rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl shadow-black/10 hover:bg-[#34d399] hover:text-white hover:-translate-y-1 transition-all active:scale-95 group shrink-0 flex items-center justify-center">
                                      Join Internal Test <ChevronRight size={14} className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                                   </Link>
                                   <div className="flex flex-col">
                                      <span className="text-[8px] md:text-[9px] font-medium text-white/10 uppercase tracking-widest">Availability</span>
                                      <span className="text-[9px] md:text-[10px] font-bold text-[#34d399] uppercase italic">Limited Access Nodes</span>
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
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#34d399]/10 blur-[160px] rounded-full pointer-events-none" />
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <Sparkles className="mx-auto mb-8 text-[#34d399]" size={32} />
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white uppercase mb-8 leading-[0.85]">
                            Secure Your <br />
                            <span className="text-clay italic serif font-thin">Access.</span>
                        </h2>
                        <p className="text-cream/50 text-xs md:text-sm font-medium uppercase tracking-[0.3em] mb-12 max-w-lg mx-auto leading-relaxed">
                            Phase 1 deployment is capped at 5,000 nodes. priority is given to institutional waitlist members.
                        </p>
                        <div className="flex flex-col items-center gap-6">
                            <button className="h-16 px-16 bg-cream text-ink rounded-full text-xs font-bold uppercase tracking-[0.4em] hover:bg-[#34d399] hover:text-cream hover:scale-105 transition-all duration-500 shadow-2xl group flex items-center gap-4">
                                Enter The Registry <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                             <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.5em] text-cream/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" /> Encrypted Connection
                                <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" /> SSL 256-Bit
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* App Download CTA - "Image 2" */}
                <motion.div 
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-6 p-8 md:p-12 lg:p-16 bg-[#1a1a1a] rounded-[2.5rem] relative overflow-hidden group border border-cream/5 shadow-2xl"
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
                                   <button className="w-full sm:w-auto px-10 py-4 bg-[#111] border border-white/20 text-white/90 rounded-xl text-xs font-semibold hover:border-white/50 hover:bg-white/5 transition-all shadow-lg active:scale-95">
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