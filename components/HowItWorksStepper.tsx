import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { CheckCircle2, Search, Zap, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    label: 'Step 01',
    tag: 'Neural Intake',
    title: 'Securely link your accounts or upload statements.',
    description: 'Our system uses bank-grade encryption to ingest your spending patterns without ever storing sensitive credentials.',
  },
  {
    id: 2,
    label: 'Step 02',
    tag: 'Matrix Audit',
    title: 'Our neural engine audits 200+ premium cards.',
    description: 'We scan the entire Indian credit landscape in real-time, calculating exact reward yields against your actual spend.',
  },
  {
    id: 3,
    label: 'Step 03',
    tag: 'Yield Mapping',
    title: 'Review your personalized intelligence report.',
    description: 'No generic lists. You get a precision-mapped portfolio designed to extract maximum value from every Rupee.',
  },
  {
    id: 4,
    label: 'Step 04',
    tag: 'Deployment',
    title: 'Apply seamlessly and start earning 15% more.',
    description: 'One-click application with pre-filled intelligence. Your new elite status is just a signature away.',
  }
];

// ── Premium Screen 1: Intake ─────────────────────────────────────────────
const ScanScreen = () => (
  <div className="w-full h-full flex flex-col justify-center items-center px-6 relative overflow-hidden">
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 bg-gradient-to-br from-[#047857]/5 to-transparent pointer-events-none" 
    />
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute -top-20 -right-20 w-40 h-40 border border-[#047857]/10 rounded-full"
    />
    
    <div className="relative z-10 text-center">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#047857]/10 border border-[#047857]/20 text-[9px] font-bold text-[#047857] uppercase tracking-widest mb-6"
      >
        <ShieldCheck size={10} />
        Bank-Grade Secure
      </motion.div>
      
      <h3 className="text-3xl font-serif text-[#242424] mb-2 leading-tight">
        Neural<br/><span className="text-[#047857] italic font-light">Intake</span>
      </h3>
      
      <div className="w-full max-w-[160px] mx-auto h-32 rounded-2xl border border-black/5 bg-white shadow-sm mt-8 relative overflow-hidden flex items-center justify-center group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/[0.02] to-transparent" />
        <motion.div 
          className="absolute inset-x-0 h-0.5 bg-[#047857] shadow-[0_0_15px_#047857] z-20"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <Search className="text-[#047857]/20 w-12 h-12 group-hover:scale-110 transition-transform duration-700" />
      </div>
      
      <p className="mt-8 text-[10px] text-[#242424]/40 font-mono tracking-tighter animate-pulse">
        WAITING FOR SOURCE...
      </p>
    </div>
  </div>
);

// ── Premium Screen 2: Audit ──────────────────────────────────────────────
const ProcessingScreen = () => (
  <div className="w-full h-full flex flex-col justify-center px-6 relative bg-[#0a0a0a] text-white overflow-hidden">
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
    
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-8">
        <Cpu size={14} className="text-[#047857]" />
        <span className="text-[10px] font-mono tracking-widest text-[#047857]">MATRIX_AUDIT.v2</span>
      </div>
      
      <div className="space-y-5">
        {[
          { label: 'Ingesting Statements', val: 100 },
          { label: 'Scanning 200+ Cards', val: 74 },
          { label: 'Yield Simulation', val: 0 },
        ].map((item, i) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between text-[9px] uppercase tracking-widest text-white/40">
              <span>{item.label}</span>
              <span className="font-mono">{item.val}%</span>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${item.val}%` }}
                transition={{ duration: 1.5, delay: i * 0.2 }}
                className="h-full bg-[#047857]" 
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 flex justify-center">
        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-t-2 border-[#047857] rounded-full" 
          />
          <Zap size={16} className="text-[#047857]" />
        </div>
      </div>
    </div>
  </div>
);

// ── Premium Screen 3: Result ─────────────────────────────────────────────
const MatchScreen = () => (
  <div className="w-full h-full flex flex-col justify-center px-6 bg-cream relative">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute top-0 right-0 p-8 text-[60px] font-serif italic text-black/[0.03] pointer-events-none"
    >
      98
    </motion.div>
    
    <div className="relative z-10">
      <p className="text-[10px] font-bold text-[#047857] uppercase tracking-[0.3em] mb-8">Intelligence Report</p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-3xl p-6 shadow-2xl border border-black/5 relative"
      >
        <div className="w-10 h-10 bg-black rounded-xl mb-6 flex items-center justify-center text-white font-serif italic">Y</div>
        <h4 className="text-xl font-serif text-[#242424] leading-tight mb-2">HDFC Diners Club Black Metal</h4>
        <p className="text-[10px] text-black/40 uppercase tracking-widest mb-6">Elite Tier • Unlimited Lounge</p>
        
        <div className="pt-6 border-t border-black/5 flex justify-between items-end">
          <div>
            <p className="text-[9px] text-black/30 uppercase mb-1">Annual Value</p>
            <p className="text-lg font-medium text-[#047857]">₹54,200</p>
          </div>
          <ArrowRight className="text-[#047857]/40" size={18} />
        </div>
      </motion.div>
    </div>
  </div>
);

// ── Premium Screen 4: Success ────────────────────────────────────────────
const SuccessScreen = () => (
  <div className="w-full h-full flex flex-col justify-center items-center px-8 text-center bg-white relative">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#047857]/5 via-transparent to-transparent opacity-50" />
    
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-20 h-20 rounded-full bg-[#047857] flex items-center justify-center mb-8 shadow-[0_20px_40px_rgba(4,120,87,0.3)]"
    >
      <CheckCircle2 size={32} className="text-white" />
    </motion.div>
    
    <h3 className="text-3xl font-serif text-[#242424] mb-4">You're In.</h3>
    <p className="text-xs text-[#242424]/50 leading-relaxed mb-10">
      Your neural strategy is deployed. Welcome to the elite 1% of earners.
    </p>
    
    <button className="w-full py-4 bg-[#242424] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#047857] transition-colors shadow-lg">
      Enter Dashboard
    </button>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────
const HowItWorksStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Use springs for smoother motion
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const updateStep = (v: number) => {
    const step = Math.min(Math.floor(v * 4) + 1, 4);
    setActiveStep(step);
  };

  useLayoutEffect(() => {
    updateStep(scrollYProgress.get());
  }, [scrollYProgress]);

  useEffect(() => {
    return scrollYProgress.on('change', updateStep);
  }, [scrollYProgress]);

  // Parallax transform for the text list to keep active item prominent
  const listY = useTransform(smoothProgress, [0, 1], ['0%', '-75%']);

  const screens: Record<number, React.ReactNode> = {
    1: <ScanScreen />,
    2: <ProcessingScreen />,
    3: <MatchScreen />,
    4: <SuccessScreen />,
  };

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '350vh' }}>
      <div
        style={{ position: 'sticky', top: '0', height: '100vh' }}
        className="w-full bg-paper border-y border-ink/10 overflow-hidden z-40 flex flex-col pt-20"
      >
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" 
             style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/p6.png")' }} />

        <div className="max-w-[1400px] mx-auto px-6 w-full h-full flex flex-col relative z-10">
          {/* Header */}
          <div className="mb-12 text-center lg:text-left">
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="inline-block px-4 py-1.5 rounded-full border border-black/5 bg-white/50 backdrop-blur-sm text-[10px] font-bold text-black/30 uppercase tracking-[0.4em] mb-6"
            >
              The Yureka Protocol
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-serif text-[#242424] leading-tight tracking-tighter">
              Master your yield in <span className="italic font-light text-[#047857]">minutes.</span>
            </h2>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center pb-20">
            {/* LEFT: Phone - Premium Depth */}
            <div className="lg:col-span-5 flex justify-center items-center relative">
              {/* Dynamic Glow behind phone */}
              <motion.div 
                className="absolute w-[300px] h-[500px] bg-[#047857]/10 blur-[100px] rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              
              <div className="relative w-[240px] h-[480px] sm:w-[260px] sm:h-[520px] rounded-[3.5rem] border-[10px] border-[#242424] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden ring-1 ring-white/20">
                {/* Screen reflection/glass effect */}
                <div className="absolute inset-0 z-50 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.05] to-white/[0.1]" />
                
                {/* Notch */}
                <div className="absolute top-0 inset-x-0 h-8 flex justify-center z-[60]">
                  <div className="w-24 h-6 bg-[#242424] rounded-b-3xl" />
                </div>
                
                {/* Status Bar */}
                <div className="absolute top-0 inset-x-0 h-14 flex justify-between items-center px-8 z-[55] pointer-events-none text-[10px] font-bold text-black/20">
                  <span>9:41</span>
                  <div className="flex gap-1.5 items-center">
                    <div className="w-4 h-2 bg-black/10 rounded-sm" />
                    <div className="w-2.5 h-2.5 bg-black/10 rounded-full" />
                  </div>
                </div>

                {/* Internal Screen Content */}
                <div className="absolute inset-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full h-full"
                    >
                      {screens[activeStep]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* RIGHT: Sophisticated List with Parallax / Sliding Lens */}
            <div className="lg:col-span-7 h-[400px] relative overflow-hidden flex flex-col justify-center">
              {/* Vertical Guide Line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-black/5" />
              
              <motion.div 
                className="space-y-24"
                style={{ y: listY }}
              >
                {STEPS.map((step, index) => {
                  const isActive = activeStep === step.id;
                  const isPast = activeStep > step.id;
                  
                  return (
                    <motion.div
                      key={step.id}
                      animate={{
                        opacity: isActive ? 1 : 0.15,
                        scale: isActive ? 1 : 0.95,
                        x: isActive ? 0 : 20,
                        filter: isActive ? 'blur(0px)' : 'blur(2px)'
                      }}
                      transition={{ duration: 0.6 }}
                      className="flex gap-10 items-start pl-1.5"
                    >
                      {/* Sophisticated Index */}
                      <div className="relative shrink-0 mt-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${isActive ? 'bg-[#242424] border-[#242424] shadow-xl' : 'bg-transparent border-black/10'}`}>
                           {isPast && !isActive ? (
                             <CheckCircle2 size={16} className="text-[#047857]" />
                           ) : (
                             <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-black/20'}`}>{String(index + 1).padStart(2, '0')}</span>
                           )}
                        </div>
                        {isActive && (
                          <motion.div 
                            layoutId="lens"
                            className="absolute -inset-4 border border-black/5 rounded-full pointer-events-none"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1 max-w-md">
                        <motion.span 
                          animate={{ opacity: isActive ? 1 : 0 }}
                          className="inline-block text-[9px] font-bold text-[#047857] uppercase tracking-[0.4em] mb-3"
                        >
                          {step.tag}
                        </motion.span>
                        <h3 className={`text-2xl md:text-3xl font-serif mb-4 transition-all duration-700 ${isActive ? 'text-[#242424]' : 'text-black/10'}`}>
                          {step.title}
                        </h3>
                        <p className={`text-sm leading-relaxed font-sans transition-all duration-700 ${isActive ? 'text-[#242424]/60' : 'text-black/5'}`}>
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Sophisticated Scroll Hint */}
              <AnimatePresence>
                {activeStep === 1 && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="absolute bottom-4 left-24 flex items-center gap-4"
                  >
                    <div className="w-12 h-px bg-black/10" />
                    <span className="text-[9px] font-bold text-black/20 uppercase tracking-[0.4em] animate-pulse">Scroll to Initiate</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 98%; opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default HowItWorksStepper;
