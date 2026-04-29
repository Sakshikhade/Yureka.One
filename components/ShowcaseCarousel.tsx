import React, { useRef } from 'react';
import { ArrowUpRight, MousePointer2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { featuredCards } from '../data';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import HowItWorksStepper from './HowItWorksStepper';

interface ShowcaseCarouselProps {
  cards: any[];
}

// ─────────────────────────────────────────────────────────────
// Pill data
// ─────────────────────────────────────────────────────────────
const WITH_ROW1 = [
  { icon: '⚡', text: 'AI-matched rewards',      bg: 'bg-[#34d399] text-[#0a0a0a]' },
  { icon: '🎯', text: 'Zero hidden fees',         bg: 'bg-white/10 text-white border border-white/10' },
  { icon: '💳', text: '200+ cards analyzed',      bg: 'bg-[#34d399] text-[#0a0a0a]' },
  { icon: '✅', text: 'Best card, guaranteed',    bg: 'bg-[#34d399] text-[#0a0a0a]' },
  { icon: '🔄', text: 'Instant comparison',       bg: 'bg-white/5 text-white/60 border border-white/5' },
  { icon: '🤖', text: 'Neural matching',          bg: 'bg-[#34d399] text-[#0a0a0a]' },
  { icon: '🎁', text: 'Max rewards unlocked',     bg: 'bg-[#34d399] text-[#0a0a0a]' },
];
const WITH_ROW2 = [
  { icon: '💰', text: '₹15k average savings',    bg: 'bg-white/10 text-white border border-white/10' },
  { icon: '📊', text: 'Reward math done for you', bg: 'bg-[#34d399] text-[#0a0a0a]' },
  { icon: '🏆', text: 'Top cluster match',        bg: 'bg-white/10 text-white border border-white/10' },
  { icon: '🔐', text: 'Unbiased, always',         bg: 'bg-white/5 text-white/60 border border-white/5' },
  { icon: '📱', text: 'Chrome auto-apply',        bg: 'bg-[#34d399] text-[#0a0a0a]' },
  { icon: '⚡', text: 'Real-time audit',          bg: 'bg-[#34d399] text-[#0a0a0a]' },
  { icon: '🎯', text: 'Spend-matched card',       bg: 'bg-[#34d399] text-[#0a0a0a]' },
];

const WITHOUT_ROW1 = [
  { icon: '😵', text: 'Hours of research',        bg: 'bg-red-500/10 text-red-400/80 border border-red-500/20' },
  { icon: '❓', text: 'Guessing the best card',   bg: 'bg-red-500/5 text-red-400/60 border border-red-500/10' },
  { icon: '💸', text: 'Missing cashback',          bg: 'bg-red-500/10 text-red-400/80 border border-red-500/20' },
  { icon: '😤', text: 'Bank rep bias',             bg: 'bg-red-500/5 text-red-400/60 border border-red-500/10' },
  { icon: '📋', text: '200+ cards to compare',    bg: 'bg-red-500/10 text-red-400/80 border border-red-500/20' },
  { icon: '⚠️', text: 'Wrong card fees',           bg: 'bg-red-500/5 text-red-400/60 border border-red-500/10' },
  { icon: '😓', text: 'Confusing reward math',    bg: 'bg-red-500/10 text-red-400/80 border border-red-500/20' },
];
const WITHOUT_ROW2 = [
  { icon: '🔍', text: 'Weeks of comparison',      bg: 'bg-red-500/5 text-red-400/60 border border-red-500/10' },
  { icon: '💀', text: 'Trapped in low rewards',   bg: 'bg-red-500/10 text-red-400/80 border border-red-500/20' },
  { icon: '📉', text: 'No savings strategy',      bg: 'bg-red-500/5 text-red-400/60 border border-red-500/10' },
  { icon: '🏦', text: 'Bank-first advice',        bg: 'bg-red-500/10 text-red-400/80 border border-red-500/20' },
  { icon: '❌', text: 'Missed joining bonus',     bg: 'bg-red-500/5 text-red-400/60 border border-red-500/10' },
  { icon: '📱', text: 'Manual reward tracking',   bg: 'bg-red-500/10 text-red-400/80 border border-red-500/20' },
  { icon: '😡', text: 'Hidden annual fees',       bg: 'bg-red-500/5 text-red-400/60 border border-red-500/10' },
];

// ─────────────────────────────────────────────────────────────
// PillRow — marquee strip
// ─────────────────────────────────────────────────────────────
const PillRow: React.FC<{
  pills: { icon: string; text: string; bg: string }[];
  reverse?: boolean;
  duration?: number;
}> = ({ pills, reverse = false, duration = 28 }) => (
  <div
    className="relative overflow-hidden flex w-full"
    style={{
      WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
      maskImage:        'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
    }}
  >
    <div
      className="flex gap-3 whitespace-nowrap animate-marquee w-max py-2"
      style={{ animationDuration: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
    >
      {[...pills, ...pills, ...pills].map((pill, i) => (
        <span
          key={i}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-bold whitespace-nowrap shadow-xl transition-all duration-500 hover:scale-105 ${pill.bg}`}
        >
          <span className="text-sm leading-none">{pill.icon}</span>
          {pill.text}
        </span>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// ComparisonWidget — the interactive centre panel
// ─────────────────────────────────────────────────────────────
const ComparisonWidget: React.FC = () => {
  const [mode, setMode] = React.useState<'with' | 'without'>('with');
  const [isShattered, setIsShattered] = React.useState(false);
  const [isScanning, setIsScanning] = React.useState(false);

  React.useEffect(() => {
    if (mode === 'without') {
      setIsShattered(false);
      const timer = setTimeout(() => setIsShattered(true), 1200); 
      return () => clearTimeout(timer);
    } else {
      setIsShattered(false);
      setIsScanning(true);
      const timer = setTimeout(() => setIsScanning(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 py-8 overflow-hidden select-none relative">

      {/* ── Toggle ── */}
      <div className="flex items-center bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full p-1 mb-8 shadow-2xl relative z-50">
        <button
          onClick={() => setMode('with')}
          className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
            mode === 'with'
              ? 'bg-[#34d399] text-[#0a0a0a] shadow-[0_0_20px_rgba(52,211,153,0.3)]'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          With Yureka
        </button>
        <button
          onClick={() => setMode('without')}
          className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
            mode === 'without'
              ? 'bg-white/10 text-white shadow-inner'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          Without Yureka
        </button>
      </div>

      <div className="w-full max-w-md relative">
        {/* ── Headline ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 16 }}
            animate={mode === 'without' && isShattered 
              ? { opacity: 1, y: 220, rotate: -3, scale: 0.95 } // Shattered position
              : { opacity: 1, y: 0, rotate: 0, scale: 1 }      // Ordered position
            }
            exit={{ opacity: 0, y: -16 }}
            transition={mode === 'without' && isShattered 
              ? { type: "spring", stiffness: 100, damping: 10 } // Gravity drop feel
              : { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
            }
            className="text-center mb-12 px-2 relative z-10"
          >
            {mode === 'with' ? (
              <>
                <h3 className="text-2xl md:text-3xl font-serif text-white leading-snug mb-1.5 uppercase tracking-tighter">
                  Just pick your card,<br />
                  <span className="italic font-light text-[#34d399]">and start earning.</span>
                </h3>
                <p className="text-[10px] text-white/20 font-sans uppercase tracking-[0.3em] font-bold">
                  The Protocol executes the complex math. You keep the yield.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-2xl md:text-3xl font-serif text-white leading-snug mb-1.5 uppercase tracking-tighter">
                  Why settle for<br />
                  <span className="italic font-light text-white/40 lowercase">sub-optimal?</span>
                </h3>
                <p className="text-[10px] text-white/20 font-sans uppercase tracking-[0.3em] font-bold">
                  Manual research is the slow lane to wealth.
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── CONTENT AREA ── */}
        <div className="relative w-full h-[260px] overflow-hidden">
          <AnimatePresence mode="wait">
            {mode === 'with' ? (
              <motion.div
                key="pills-with"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col gap-3 pt-4"
              >
                <PillRow pills={WITH_ROW1} duration={26} />
                <PillRow pills={WITH_ROW2} reverse duration={32} />
              </motion.div>
            ) : (
              <motion.div
                key="pills-without"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full pt-4 relative"
              >
                {[...WITHOUT_ROW1, ...WITHOUT_ROW2].slice(0, 8).map((pill, i) => {
                  // Constrained grid positions to stay within bounds
                  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                  const xOffset = isMobile ? (i % 2 === 0 ? -90 : 45) : (i % 2 === 0 ? -155 : 95);
                  const yOffset = Math.floor(i / 2) * (isMobile ? 45 : 55);
                  
                  // Constrained shattered positions
                  const shatterX = xOffset + ((Math.random() * 40) - 20);
                  const shatterY = (isMobile ? 110 : 140) + (Math.random() * 30);
                  const shatterRotate = (Math.random() * 30) - 15;

                  return (
                    <motion.span
                      key={pill.text}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isShattered 
                        ? { opacity: 1, x: shatterX, y: shatterY, rotate: shatterRotate, scale: 0.85 }
                        : { opacity: 1, x: xOffset, y: yOffset, rotate: 0, scale: 1 }
                      }
                      transition={isShattered 
                        ? { 
                            type: "spring", 
                            stiffness: 120, 
                            damping: 12,
                            delay: i * 0.03
                          } 
                        : { duration: 0.5, delay: i * 0.04, ease: "easeOut" }
                      }
                      style={{ 
                        left: '50%',
                        top: '10%',
                        transform: 'translate(-50%, -50%)' 
                      }}
                      className={`absolute inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[10px] font-bold shadow-sm whitespace-nowrap transition-colors border border-black/5 ${pill.bg}`}
                    >
                      <span className="text-xs">{pill.icon}</span>
                      {pill.text}
                    </motion.span>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// ShowcaseCarousel
// ─────────────────────────────────────────────────────────────
const ShowcaseCarousel: React.FC<ShowcaseCarouselProps> = ({ cards: cardsProp }) => {
  return (
    <section className="relative bg-[#0a0a0a] border-t border-white/5 z-10 w-full">
      <div className="w-full flex justify-center flex-col">
        <div className="relative w-full border-x-0 border-b border-white/5 bg-white/[0.02] flex flex-col shadow-2xl overflow-hidden">

          {/* Background Vellum Grid */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} 
          />
          
          <div className="w-full h-full relative z-10 text-white">
      <div className="flex flex-col lg:grid lg:grid-cols-2">

              {/* ── LEFT: copy ── */}
              <div className="flex flex-col justify-center px-6 lg:px-16 py-10 lg:py-14 relative z-20 border-b lg:border-b-0 lg:border-r border-white/5">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="block text-[#34d399] text-[11px] font-bold uppercase tracking-[0.4em] mb-4">
                    How It Works
                  </span>
                  <h2 className="text-4xl md:text-5xl lg:text-[clamp(1.5rem,3.5vw,4.5rem)] font-serif text-white mb-8 leading-[0.85] tracking-tighter uppercase">
                    We Compare <br />
                    <span className="italic font-light text-[#34d399]">For You.</span>
                  </h2>
                  <p className="text-white/60 text-base md:text-lg lg:text-xl font-serif italic leading-snug mb-10 border-l-2 border-[#34d399]/30 pl-8 max-w-md">
                    "We don't just list cards. We scan 200+ options to find the one that fits your life perfectly."
                  </p>
                  <div className="flex items-center gap-6 text-[11px] font-bold tracking-[0.3em] uppercase text-white/20">
                    <motion.div
                      animate={{ width: [40, 80, 40] }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                      className="h-px bg-[#34d399]/50"
                    />
                    Scroll to discover
                  </div>
                </motion.div>
              </div>

              {/* ── RIGHT: comparison widget ── */}
              <div className="flex items-center justify-center overflow-hidden bg-white/[0.01] py-8 px-6 lg:py-10">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                  className="w-full max-w-xl"
                >
                  <ComparisonWidget />
                </motion.div>
              </div>

          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

export default ShowcaseCarousel;