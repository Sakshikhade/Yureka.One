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
  { icon: '⚡', text: 'AI-matched rewards',      bg: 'bg-[#047857] text-cream' },
  { icon: '🎯', text: 'Zero hidden fees',         bg: 'bg-indigo-700 text-cream' },
  { icon: '💳', text: '200+ cards analyzed',      bg: 'bg-[#047857] text-cream' },
  { icon: '✅', text: 'Best card, guaranteed',    bg: 'bg-[#047857] text-cream' },
  { icon: '🔄', text: 'Instant comparison',       bg: 'bg-slate-800 text-cream' },
  { icon: '🤖', text: 'Neural matching',          bg: 'bg-violet-800 text-cream' },
  { icon: '🎁', text: 'Max rewards unlocked',     bg: 'bg-[#047857] text-cream' },
];
const WITH_ROW2 = [
  { icon: '💰', text: '₹15k average savings',    bg: 'bg-amber-700 text-cream' },
  { icon: '📊', text: 'Reward math done for you', bg: 'bg-[#047857] text-cream' },
  { icon: '🏆', text: 'Top cluster match',        bg: 'bg-indigo-600 text-cream' },
  { icon: '🔐', text: 'Unbiased, always',         bg: 'bg-slate-700 text-cream' },
  { icon: '📱', text: 'Chrome auto-apply',        bg: 'bg-[#047857] text-cream' },
  { icon: '⚡', text: 'Real-time audit',          bg: 'bg-purple-800 text-cream' },
  { icon: '🎯', text: 'Spend-matched card',       bg: 'bg-[#047857] text-cream' },
];

const WITHOUT_ROW1 = [
  { icon: '😵', text: 'Hours of research',        bg: 'bg-yellow-100 text-yellow-900 border border-yellow-200' },
  { icon: '❓', text: 'Guessing the best card',   bg: 'bg-yellow-50 text-yellow-900 border border-yellow-200' },
  { icon: '💸', text: 'Missing cashback',          bg: 'bg-amber-100 text-amber-900 border border-amber-200' },
  { icon: '😤', text: 'Bank rep bias',             bg: 'bg-yellow-100 text-yellow-900 border border-yellow-200' },
  { icon: '📋', text: '200+ cards to compare',    bg: 'bg-yellow-50 text-yellow-900 border border-yellow-200' },
  { icon: '⚠️', text: 'Wrong card fees',           bg: 'bg-emerald-100 text-emerald-900 border border-emerald-200' },
  { icon: '😓', text: 'Confusing reward math',    bg: 'bg-yellow-100 text-yellow-900 border border-yellow-200' },
];
const WITHOUT_ROW2 = [
  { icon: '🔍', text: 'Weeks of comparison',      bg: 'bg-yellow-50 text-yellow-900 border border-yellow-200' },
  { icon: '💀', text: 'Trapped in low rewards',   bg: 'bg-amber-100 text-amber-900 border border-amber-200' },
  { icon: '📉', text: 'No savings strategy',      bg: 'bg-yellow-100 text-yellow-900 border border-yellow-200' },
  { icon: '🏦', text: 'Bank-first advice',        bg: 'bg-yellow-50 text-yellow-900 border border-yellow-200' },
  { icon: '❌', text: 'Missed joining bonus',     bg: 'bg-emerald-100 text-emerald-900 border border-emerald-200' },
  { icon: '📱', text: 'Manual reward tracking',   bg: 'bg-yellow-100 text-yellow-900 border border-yellow-200' },
  { icon: '😡', text: 'Hidden annual fees',       bg: 'bg-amber-100 text-amber-900 border border-amber-200' },
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
      WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
      maskImage:        'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
    }}
  >
    <div
      className="flex gap-2.5 whitespace-nowrap animate-marquee w-max"
      style={{ animationDuration: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
    >
      {[...pills, ...pills].map((pill, i) => (
        <span
          key={i}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-semibold whitespace-nowrap shadow-sm ${pill.bg}`}
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

  // Reset/Trigger shatter effect when entering 'without' mode
  React.useEffect(() => {
    if (mode === 'without') {
      setIsShattered(false);
      const timer = setTimeout(() => setIsShattered(true), 2400); // 2s delay + buffer
      return () => clearTimeout(timer);
    } else {
      setIsShattered(false);
    }
  }, [mode]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 py-8 overflow-hidden select-none relative">

      {/* ── Toggle ── */}
      <div className="flex items-center bg-cream/40 backdrop-blur-xl border border-white/60 rounded-full p-1 mb-8 shadow-[0_8px_32px_rgba(36,36,36,0.05)] relative z-50">
        <button
          onClick={() => setMode('with')}
          className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
            mode === 'with'
              ? 'bg-[#242424] text-cream shadow'
              : 'text-[#242424]/40 hover:text-[#242424]'
          }`}
        >
          With Yureka
        </button>
        <button
          onClick={() => setMode('without')}
          className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
            mode === 'without'
              ? 'bg-[#242424] text-cream shadow'
              : 'text-[#242424]/40 hover:text-[#242424]'
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
                <h3 className="text-2xl md:text-3xl font-serif text-[#242424] leading-snug mb-1.5">
                  Just pick your card,<br />
                  <span className="italic font-light text-[#047857]">and start earning.</span>
                </h3>
                <p className="text-[10px] text-[#242424]/35 font-sans uppercase tracking-[0.25em]">
                  We do the heavy lifting. You earn more.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-2xl md:text-3xl font-serif text-[#242424] leading-snug mb-1.5">
                  Why go through<br />
                  <span className="italic font-light text-[#242424]/45 lowercase">all this?</span>
                </h3>
                <p className="text-[10px] text-[#242424]/35 font-sans uppercase tracking-[0.25em]">
                  Weeks of research. Wrong card. Zero savings.
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
                  // Ordered layout positions (center grid)
                  const gridX = (i % 2 === 0 ? -140 : 10);
                  const gridY = Math.floor(i / 2) * 50;
                  
                  // Shattered layout positions (random on bottom, constrained)
                  const shatterX = gridX + ((Math.random() * 120) - 60);
                  const shatterY = 100 + (Math.random() * 40);
                  const shatterRotate = (Math.random() * 40) - 20;

                  return (
                    <motion.span
                      key={pill.text}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isShattered 
                        ? { opacity: 1, x: shatterX, y: shatterY, rotate: shatterRotate, scale: 0.9 }
                        : { opacity: 1, x: gridX, y: gridY, rotate: 0, scale: 1 }
                      }
                      transition={isShattered 
                        ? { 
                            type: "spring", 
                            stiffness: 80, 
                            damping: 10,
                            delay: i * 0.05 // Staggered drop
                          } 
                        : { duration: 0.6, delay: i * 0.05, ease: "easeOut" }
                      }
                      style={{ 
                        left: '50%',
                        top: '15%',
                        transform: 'translate(-50%, -50%)' 
                      }}
                      className={`absolute inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold shadow-sm whitespace-nowrap transition-colors border border-black/5 ${pill.bg}`}
                    >
                      <span className="text-sm">{pill.icon}</span>
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
    <section className="relative bg-cream border-t border-ink/10 z-10 w-full">
      <div className="w-full flex justify-center flex-col">
        <div className="relative w-full border-x-0 border-b border-ink/10 bg-paper flex flex-col shadow-xl overflow-hidden">

          {/* Background Vellum Grid */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(to right, #242424 1px, transparent 1px), linear-gradient(to bottom, #242424 1px, transparent 1px)', backgroundSize: '60px 60px' }} 
          />
          
          <div className="w-full h-full relative z-10 text-[#242424]">
      <div className="flex flex-col lg:grid lg:grid-cols-2">

              {/* ── LEFT: copy ── */}
              <div className="flex flex-col justify-center px-6 lg:px-16 py-10 lg:py-14 relative z-20 border-b lg:border-b-0 lg:border-r border-ink/5">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="block text-[#047857] text-[11px] font-bold uppercase tracking-[0.4em] mb-4">
                    How It Works
                  </span>
                  <h2 className="text-4xl md:text-5xl lg:text-[clamp(1.5rem,3.5vw,4.5rem)] font-serif text-[#242424] mb-8 leading-[0.85] tracking-tighter uppercase">
                    We Compare <br />
                    <span className="italic font-light text-[#047857]">For You.</span>
                  </h2>
                  <p className="text-[#242424]/80 text-base md:text-lg lg:text-xl font-serif italic leading-snug mb-10 border-l-2 border-clay/30 pl-8 max-w-md">
                    "We don't just list cards. We scan 200+ options to find the one that fits your life perfectly."
                  </p>
                  <div className="flex items-center gap-6 text-[11px] font-bold tracking-[0.3em] uppercase text-[#242424]/30">
                    <motion.div
                      animate={{ width: [40, 80, 40] }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                      className="h-px bg-[#047857]/50"
                    />
                    Scroll to discover
                  </div>
                </motion.div>
              </div>

              {/* ── RIGHT: comparison widget ── */}
              <div className="flex items-center justify-center overflow-hidden bg-cream/20 py-8 px-6 lg:py-10">
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
      </div>
    </section>
  );
};

export default ShowcaseCarousel;