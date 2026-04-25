import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll } from 'motion/react';
import { CheckCircle2, Search, Zap } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    label: 'Step 01',
    title: 'Securely link your accounts or upload your latest credit card statements for analysis.',
  },
  {
    id: 2,
    label: 'Step 02',
    title: 'Our neural engine audits your spending behavior and scans 200+ premium cards.',
  },
  {
    id: 3,
    label: 'Step 03',
    title: 'Review your personalized intelligence report. We match you with the exact cards that maximize your yield.',
  },
  {
    id: 4,
    label: 'Step 04',
    title: 'Apply seamlessly and start earning 15% more on every zero-fee transaction.',
  }
];

// ── Screen components (Same as before) ──────────────────────────────────
const ScanScreen = () => (
  <div className="w-full h-full flex flex-col justify-center items-center px-6 relative pointer-events-none">
    <motion.h3 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-serif text-[#047857] mb-4">
      Neural<br/><span className="text-[#242424]">Audit</span>
    </motion.h3>
    <p className="text-[10px] text-[#242424]/50 text-center mb-8 uppercase tracking-widest font-sans">Initializing protocol</p>
    <div className="w-full h-32 rounded-xl border border-ink/10 relative overflow-hidden bg-white/50 flex items-center justify-center">
      <div className="absolute inset-x-0 top-0 h-1 bg-[#047857] shadow-[0_0_15px_#047857] animate-[scan_2s_ease-in-out_infinite_alternate]" />
      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }}>
        <Search className="text-[#047857]/40 w-10 h-10" />
      </motion.div>
    </div>
    <div className="w-full bg-white border border-ink/5 shadow-sm rounded-xl mt-8 py-4 text-center text-xs text-[#242424]/50">Scanning...</div>
  </div>
);

const ProcessingScreen = () => (
  <div className="w-full h-full flex flex-col justify-center items-start px-6 relative pointer-events-none">
    <motion.h3 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-[28px] font-serif text-[#242424] mb-8 leading-tight">
      We're currently<br/><span className="text-[#047857] italic">crunching data</span>
    </motion.h3>
    <div className="space-y-6 w-full relative">
      <div className="absolute left-[9px] top-4 bottom-4 w-px bg-ink/10" />
      {['Upload Received', 'Matrix Audit', 'Yield Mapping'].map((label, i) => (
        <div key={label} className="flex gap-4 relative">
          <div className={`w-5 h-5 rounded-full border-4 border-cream z-10 shrink-0 ${i === 0 ? 'bg-[#047857]' : i === 1 ? 'bg-[#047857]/40 animate-pulse' : 'bg-ink/10'}`} />
          <div>
            <div className="text-xs text-[#242424] font-medium">{label}</div>
            <div className="text-[10px] text-[#242424]/40">{i === 1 ? 'Scanning...' : 'Status'}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MatchScreen = () => (
  <div className="w-full h-full flex flex-col justify-center px-6 pointer-events-none relative">
    <motion.h3 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-serif text-[#242424] mb-8">
      Your<br/><span className="text-[#047857]">optimized portfolio</span>
    </motion.h3>
    <div className="w-full rounded-2xl bg-white border border-ink/5 p-5 shadow-sm relative overflow-hidden">
      <p className="text-[9px] uppercase tracking-widest text-[#047857] font-bold mb-4">Top Match 98%</p>
      <h4 className="text-lg font-serif text-[#242424] mb-1">HDFC Diners Black</h4>
      <div className="p-3 bg-cream rounded-xl flex justify-between items-center mt-4">
        <span className="text-[9px] text-[#242424]/40 uppercase">Projected Yield</span>
        <Zap className="text-emerald-500 w-4 h-4" />
      </div>
    </div>
  </div>
);

const SuccessScreen = () => (
  <div className="w-full h-full flex flex-col justify-center items-center px-6 pointer-events-none text-center">
    <div className="w-16 h-16 rounded-full bg-[#047857]/5 flex items-center justify-center mb-6">
      <CheckCircle2 className="text-[#047857] w-8 h-8" />
    </div>
    <h3 className="text-2xl font-serif text-[#242424] mb-2">Unlocked</h3>
    <p className="text-xs text-[#242424]/50 max-w-[200px]">Your strategy is active and your card is dispatched.</p>
  </div>
);

const HowItWorksStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const updateStep = (v: number) => {
    if (v < 0.25) setActiveStep(1);
    else if (v < 0.5) setActiveStep(2);
    else if (v < 0.75) setActiveStep(3);
    else setActiveStep(4);
  };

  useLayoutEffect(() => {
    updateStep(scrollYProgress.get());
  }, [scrollYProgress]);

  useEffect(() => {
    return scrollYProgress.on('change', updateStep);
  }, [scrollYProgress]);

  const screens: Record<number, React.ReactNode> = {
    1: <ScanScreen />,
    2: <ProcessingScreen />,
    3: <MatchScreen />,
    4: <SuccessScreen />,
  };

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '300vh' }}>
      <div
        style={{ position: 'sticky', top: '80px', height: 'calc(100vh - 80px)' }}
        className="w-full bg-paper border-y border-ink/10 overflow-hidden z-40 flex flex-col"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] aspect-square pointer-events-none opacity-10">
          <div className="absolute inset-0 m-auto w-[60%] h-[60%] rounded-full border border-ink/10" />
          <div className="absolute inset-0 m-auto w-[100%] h-[100%] rounded-full border border-dashed border-ink/5" />
        </div>

        <div className="absolute top-0 left-0 right-0 h-1 bg-ink/5 z-50">
          <motion.div className="h-full bg-[#047857] origin-left" style={{ scaleX: scrollYProgress }} />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 w-full h-full flex flex-col relative z-10">
          <div className="pt-12 pb-4 text-center lg:text-left shrink-0">
            <p className="text-[10px] text-[#242424]/30 uppercase tracking-[0.3em] font-bold mb-2 font-sans">Process Flow</p>
            <h2 className="text-3xl md:text-4xl font-serif text-[#242424]">
              Optimize in <span className="italic font-light text-[#047857]">&lt;5 Minutes</span>
            </h2>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-12">
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="relative w-[210px] h-[440px] rounded-[2.5rem] border-[8px] border-white bg-cream shadow-2xl overflow-hidden ring-1 ring-ink/5">
                <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
                  <div className="w-24 h-5 bg-white rounded-b-2xl border-b border-x border-ink/5" />
                </div>
                <div className="absolute inset-0 pt-10 bg-gradient-to-b from-white to-cream/50">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full"
                    >
                      {screens[activeStep]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col h-full justify-center relative px-4">
               <div className="space-y-12">
                  {STEPS.map((step, index) => {
                    const isActive = activeStep === step.id;
                    const isPast = activeStep > step.id;
                    
                    return (
                      <motion.div
                        key={step.id}
                        initial={false}
                        animate={{
                          opacity: isActive ? 1 : 0.2,
                          x: isActive ? 0 : -10,
                          filter: isActive ? 'blur(0px)' : 'blur(1px)'
                        }}
                        transition={{ duration: 0.5 }}
                        className="flex gap-6 items-start"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-500 ${isActive ? 'bg-[#047857] border-[#047857]' : isPast ? 'bg-[#047857]/20 border-[#047857]/40' : 'bg-transparent border-ink/10'}`}>
                           {isPast && !isActive ? (
                             <CheckCircle2 size={16} className="text-[#047857]" />
                           ) : (
                             <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-[#242424]/40'}`}>{String(index + 1).padStart(2, '0')}</span>
                           )}
                        </div>
                        
                        <div className="flex-1">
                          <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-1 transition-colors ${isActive ? 'text-[#047857]' : 'text-ink/20'}`}>{step.label}</p>
                          <h3 className={`text-lg md:text-xl font-sans transition-all duration-500 ${isActive ? 'text-[#242424] font-medium' : 'text-[#242424]/40'}`}>
                            {step.title}
                          </h3>
                        </div>
                      </motion.div>
                    );
                  })}
               </div>

               <AnimatePresence>
                 {activeStep === 1 && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute bottom-0 left-4 text-[10px] text-[#242424]/20 uppercase tracking-[0.4em] flex items-center gap-2">
                     <span className="animate-bounce">↓</span> Keep scrolling
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
