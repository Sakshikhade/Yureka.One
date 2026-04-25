import React, { useState, useEffect, useRef } from 'react';
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

// ── Screen 1 ──────────────────────────────────────────────────────────────
const ScanScreen = () => (
  <div className="w-full h-full flex flex-col justify-center items-center px-6 relative pointer-events-none">
    <motion.h3
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-3xl font-serif text-[#047857] mb-4"
    >
      Neural<br/><span className="text-[#242424]">Audit</span>
    </motion.h3>
    <p className="text-[10px] text-[#242424]/50 text-center mb-8 uppercase tracking-widest font-sans">
      Initializing protocol
    </p>
    <div className="w-full h-32 rounded-xl border border-ink/10 relative overflow-hidden bg-white/50 flex items-center justify-center">
      <div className="absolute inset-x-0 top-0 h-1 bg-[#047857] shadow-[0_0_15px_#047857] animate-[scan_2s_ease-in-out_infinite_alternate]" />
      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }}>
        <Search className="text-[#047857]/40 w-10 h-10" />
      </motion.div>
    </div>
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      className="w-full bg-white border border-ink/5 shadow-sm rounded-xl mt-8 py-4 text-center text-xs text-[#242424]/50"
    >
      Scanning statements...
    </motion.div>
  </div>
);

// ── Screen 2 ──────────────────────────────────────────────────────────────
const ProcessingScreen = () => (
  <div className="w-full h-full flex flex-col justify-center items-start px-6 relative pointer-events-none">
    <motion.h3
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-[28px] font-serif text-[#242424] mb-8 leading-tight"
    >
      We're currently<br/>
      <span className="text-[#047857] italic">crunching the data</span>
    </motion.h3>
    <div className="space-y-6 w-full relative">
      <div className="absolute left-[9px] top-4 bottom-4 w-px bg-ink/10" />
      {[
        { label: 'Upload Received', sub: 'Secure hash verified', done: true },
        { label: 'Matrix Audit', sub: 'Scanning 42,000 data points...', pulse: true },
        { label: 'Yield Mapping', sub: 'Pending', dim: true },
      ].map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: item.dim ? 0.4 : 1, x: 0 }}
          transition={{ delay: i * 0.15, duration: 0.4 }}
          className="flex gap-4 relative"
        >
          <div className={`w-5 h-5 rounded-full border-4 border-cream z-10 shrink-0 ${item.done ? 'bg-[#047857]' : item.pulse ? 'bg-[#047857]/40 animate-pulse' : 'bg-ink/10'}`} />
          <div>
            <div className="text-xs text-[#242424] font-medium mb-1">{item.label}</div>
            <div className="text-[10px] text-[#242424]/40">{item.sub}</div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// ── Screen 3 ──────────────────────────────────────────────────────────────
const MatchScreen = () => (
  <div className="w-full h-full flex flex-col justify-center px-6 pointer-events-none relative">
    <motion.h3
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-2xl font-serif text-[#242424] leading-snug mb-8"
    >
      Here is your<br/>
      <span className="text-[#047857]">optimized portfolio</span>
    </motion.h3>
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="w-full rounded-2xl bg-white border border-ink/5 p-5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#047857]/10 blur-2xl rounded-full" />
      <p className="text-[9px] uppercase tracking-widest text-[#047857] font-bold mb-6">Top Match 98%</p>
      <h4 className="text-lg font-serif text-[#242424] mb-1 uppercase tracking-tight">HDFC Diners Black</h4>
      <p className="text-xs text-[#242424]/50 mb-6">Premium Travel &amp; Lounge</p>
      <div className="p-3 bg-cream rounded-xl flex justify-between items-center border border-ink/5">
        <div>
          <div className="text-[9px] text-[#242424]/40 uppercase tracking-widest mb-1">Projected VIP Yield</div>
          <div className="text-sm font-medium text-emerald-600">₹45,000 /yr</div>
        </div>
        <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <Zap className="text-emerald-500 w-4 h-4" />
        </motion.div>
      </div>
    </motion.div>
  </div>
);

// ── Screen 4 ──────────────────────────────────────────────────────────────
const SuccessScreen = () => (
  <div className="w-full h-full flex flex-col justify-center items-center px-6 pointer-events-none relative text-center">
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="w-20 h-20 rounded-full border border-dashed border-[#047857]/30 flex items-center justify-center mb-8 relative"
    >
      <div className="absolute inset-0 bg-[#047857]/5 rounded-full animate-ping opacity-50" />
      <CheckCircle2 className="text-[#047857] w-10 h-10" />
    </motion.div>
    <motion.h3
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-2xl font-serif text-[#242424] mb-2"
    >
      Unlocked
    </motion.h3>
    <p className="text-xs text-[#242424]/50 font-sans tracking-wide mb-10 max-w-[200px]">
      Your card application is approved and yield strategy is active.
    </p>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="w-full rounded-xl bg-white border border-ink/5 shadow-sm p-4 text-left"
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs text-[#242424]/60">New Card Status</span>
        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Dispatched</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-[#242424]/60">Lifetime Value</span>
        <span className="text-sm text-[#242424] font-medium">+15% base yield</span>
      </div>
    </motion.div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────
const HowItWorksStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  // The tall outer container drives the sticky scroll effect
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress through the 500vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      // Map [0,1] into 4 equal bands → steps 1-4
      if (v < 0.25)       setActiveStep(1);
      else if (v < 0.5)   setActiveStep(2);
      else if (v < 0.75)  setActiveStep(3);
      else                setActiveStep(4);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  const screens: Record<number, React.ReactNode> = {
    1: <ScanScreen />,
    2: <ProcessingScreen />,
    3: <MatchScreen />,
    4: <SuccessScreen />,
  };

  return (
    /**
     * OUTER: 500vh tall — creates the scrollable "runway" that keeps the
     * sticky inner section locked on screen across 4 steps.
     */
    <div ref={containerRef} style={{ height: '500vh' }}>
      {/**
       * INNER: sticky at top:0, exactly 100vh — this is what the user sees.
       * It doesn't move; the outer container scrolls under it.
       */}
      <div
        style={{ position: 'sticky', top: 0, height: '100vh' }}
        className="w-full bg-paper border-y border-ink/10 overflow-hidden relative flex flex-col"
      >
        {/* ── Background rings ── */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] aspect-square pointer-events-none opacity-20">
          <div className="absolute inset-0 m-auto w-[40%] h-[40%] rounded-full border border-ink/10" />
          <div className="absolute inset-0 m-auto w-[60%] h-[60%] rounded-full border border-dashed border-ink/10" />
          <div className="absolute inset-0 m-auto w-[80%] h-[80%] rounded-full border border-ink/5" />
          <div className="absolute inset-0 m-auto w-[100%] h-[100%] rounded-full border border-dashed border-ink/5" />
        </div>

        {/* ── Progress bar across the top ── */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-ink/5 z-50">
          <motion.div
            className="h-full bg-[#047857] origin-left"
            style={{ scaleX: scrollYProgress }}
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 w-full h-full flex flex-col relative z-10">

          {/* ── Section header ── */}
          <div className="pt-10 pb-6 text-center lg:text-left shrink-0">
            <p className="text-[10px] text-[#242424]/30 uppercase tracking-[0.3em] font-bold mb-2 font-sans">
              How does it work?
            </p>
            <h2 className="text-2xl md:text-3xl font-serif text-[#242424] leading-tight">
              Optimize Your Yield in{' '}
              <span className="italic font-light text-[#047857]">&lt;5 Minutes</span>
            </h2>
          </div>

          {/* ── Two-column layout fills the remaining height ── */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-8 min-h-0">

            {/* ── LEFT: Phone mockup ── */}
            <div className="lg:col-span-5 flex justify-center items-center h-full">
              <div className="relative w-[220px] sm:w-[240px] h-[420px] sm:h-[460px] rounded-[3rem] border-[8px] border-white bg-cream shadow-[0_30px_80px_-15px_rgba(0,0,0,0.15)] overflow-hidden ring-1 ring-ink/5 shrink-0">
                {/* Notch */}
                <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
                  <div className="w-28 h-6 bg-white rounded-b-3xl border-b border-x border-ink/5" />
                </div>
                {/* Status bar */}
                <div className="absolute top-0 inset-x-0 h-12 flex justify-between items-center px-5 z-40 pointer-events-none text-[10px] font-medium text-[#242424]/50">
                  <span>13:13</span>
                  <div className="flex gap-1.5 items-center">
                    <div className="w-4 h-3 bg-[#242424]/50 rounded-sm" />
                    <div className="w-3 h-3 bg-[#242424]/50 rounded-full" />
                  </div>
                </div>
                {/* Screen */}
                <div className="absolute inset-0 pt-12 pb-8 bg-gradient-to-b from-white to-cream/50">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, y: 20, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.97 }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full"
                    >
                      {screens[activeStep]}
                    </motion.div>
                  </AnimatePresence>
                </div>
                {/* Progress dots */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-50">
                  {STEPS.map((s) => (
                    <motion.div
                      key={s.id}
                      animate={{ width: activeStep === s.id ? 18 : 5, opacity: activeStep === s.id ? 1 : 0.3 }}
                      transition={{ duration: 0.3 }}
                      className="h-1.5 rounded-full bg-[#047857]"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Steps list ── */}
            <div className="lg:col-span-7 flex flex-col gap-0 h-full justify-center">
              {STEPS.map((step, index) => {
                const isActive = activeStep === step.id;
                const isPast = activeStep > step.id;
                return (
                  <div
                    key={step.id}
                    className="py-6 border-b border-ink/5 last:border-0"
                  >
                    <div className="flex gap-5 items-start">
                      {/* Number bubble */}
                      <motion.div
                        animate={{
                          backgroundColor: isActive ? '#047857' : isPast ? '#047857' : 'rgba(36,36,36,0.06)',
                          scale: isActive ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.4 }}
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      >
                        {isPast && !isActive ? (
                          <CheckCircle2 size={16} className="text-white" />
                        ) : (
                          <span className={`text-[11px] font-bold ${isActive ? 'text-white' : 'text-[#242424]/40'}`}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        )}
                      </motion.div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <motion.p
                          animate={{ opacity: isActive ? 0.6 : 0.25 }}
                          className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#047857] mb-1"
                        >
                          {step.label}
                        </motion.p>
                        <motion.p
                          animate={{ opacity: isActive ? 1 : 0.3 }}
                          transition={{ duration: 0.35 }}
                          className={`text-sm md:text-base leading-relaxed font-sans ${isActive ? 'font-medium text-[#242424]' : 'font-normal text-[#242424]'}`}
                        >
                          {step.title}
                        </motion.p>
                        {/* Active underline */}
                        <motion.div
                          animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                          initial={{ scaleX: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="h-0.5 bg-[#047857]/30 mt-3 origin-left rounded-full w-2/5"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Scroll hint — fades out after step 1 */}
              <AnimatePresence>
                {activeStep === 1 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 text-[10px] text-[#242424]/20 uppercase tracking-[0.3em] flex items-center gap-2"
                  >
                    <span className="animate-bounce">↓</span> Scroll to continue
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scan {
            0%   { top: 0%;  opacity: 0; }
            10%  { opacity: 1; }
            90%  { opacity: 1; }
            100% { top: 98%; opacity: 0; }
          }
        `}} />
      </div>
    </div>
  );
};

export default HowItWorksStepper;
