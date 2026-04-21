import React, { useRef } from 'react';
import { ArrowUpRight, MousePointer2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { featuredCards } from '../data';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';

interface ShowcaseCarouselProps {
  cards: any[];
}

// ─────────────────────────────────────────────────────────────
// Pill data
// ─────────────────────────────────────────────────────────────
const WITH_ROW1 = [
  { icon: '⚡', text: 'AI-matched rewards',      bg: 'bg-[#047857] text-white' },
  { icon: '🎯', text: 'Zero hidden fees',         bg: 'bg-indigo-700 text-white' },
  { icon: '💳', text: '200+ cards analyzed',      bg: 'bg-[#1A5F54] text-white' },
  { icon: '✅', text: 'Best card, guaranteed',    bg: 'bg-[#047857] text-white' },
  { icon: '🔄', text: 'Instant comparison',       bg: 'bg-slate-800 text-white' },
  { icon: '🤖', text: 'Neural matching',          bg: 'bg-violet-800 text-white' },
  { icon: '🎁', text: 'Max rewards unlocked',     bg: 'bg-[#065F46] text-white' },
];
const WITH_ROW2 = [
  { icon: '💰', text: '₹15k average savings',    bg: 'bg-amber-700 text-white' },
  { icon: '📊', text: 'Reward math done for you', bg: 'bg-[#047857] text-white' },
  { icon: '🏆', text: 'Top cluster match',        bg: 'bg-indigo-600 text-white' },
  { icon: '🔐', text: 'Unbiased, always',         bg: 'bg-slate-700 text-white' },
  { icon: '📱', text: 'Chrome auto-apply',        bg: 'bg-[#1A5F54] text-white' },
  { icon: '⚡', text: 'Real-time audit',          bg: 'bg-purple-800 text-white' },
  { icon: '🎯', text: 'Spend-matched card',       bg: 'bg-[#047857] text-white' },
];

const WITHOUT_ROW1 = [
  { icon: '😵', text: 'Hours of research',        bg: 'bg-yellow-100 text-yellow-900 border border-yellow-200' },
  { icon: '❓', text: 'Guessing the best card',   bg: 'bg-yellow-50 text-yellow-900 border border-yellow-200' },
  { icon: '💸', text: 'Missing cashback',          bg: 'bg-amber-100 text-amber-900 border border-amber-200' },
  { icon: '😤', text: 'Bank rep bias',             bg: 'bg-yellow-100 text-yellow-900 border border-yellow-200' },
  { icon: '📋', text: '200+ cards to compare',    bg: 'bg-yellow-50 text-yellow-900 border border-yellow-200' },
  { icon: '⚠️', text: 'Wrong card fees',           bg: 'bg-orange-100 text-orange-900 border border-orange-200' },
  { icon: '😓', text: 'Confusing reward math',    bg: 'bg-yellow-100 text-yellow-900 border border-yellow-200' },
];
const WITHOUT_ROW2 = [
  { icon: '🔍', text: 'Weeks of comparison',      bg: 'bg-yellow-50 text-yellow-900 border border-yellow-200' },
  { icon: '💀', text: 'Trapped in low rewards',   bg: 'bg-amber-100 text-amber-900 border border-amber-200' },
  { icon: '📉', text: 'No savings strategy',      bg: 'bg-yellow-100 text-yellow-900 border border-yellow-200' },
  { icon: '🏦', text: 'Bank-first advice',        bg: 'bg-yellow-50 text-yellow-900 border border-yellow-200' },
  { icon: '❌', text: 'Missed joining bonus',     bg: 'bg-orange-100 text-orange-900 border border-orange-200' },
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

  const row1 = mode === 'with' ? WITH_ROW1 : WITHOUT_ROW1;
  const row2 = mode === 'with' ? WITH_ROW2 : WITHOUT_ROW2;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 py-10 overflow-hidden select-none">

      {/* ── Toggle ── */}
      <div className="flex items-center bg-white border border-ink/10 rounded-full p-1 mb-8 shadow-sm">
        <button
          onClick={() => setMode('with')}
          className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
            mode === 'with'
              ? 'bg-ink text-white shadow'
              : 'text-ink/40 hover:text-ink'
          }`}
        >
          With Yureka
        </button>
        <button
          onClick={() => setMode('without')}
          className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
            mode === 'without'
              ? 'bg-ink text-white shadow'
              : 'text-ink/40 hover:text-ink'
          }`}
        >
          Without Yureka
        </button>
      </div>

      {/* ── Headline ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: [0.25, 0.8, 0.25, 1] }}
          className="text-center mb-8 px-2"
        >
          {mode === 'with' ? (
            <>
              <h3 className="text-2xl md:text-3xl font-serif text-ink leading-snug mb-1.5">
                Just pick your card,<br />
                <span className="italic font-light text-clay">and start earning.</span>
              </h3>
              <p className="text-[10px] text-ink/35 font-sans uppercase tracking-[0.25em]">
                We do the heavy lifting. You earn more.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-2xl md:text-3xl font-serif text-ink leading-snug mb-1.5">
                Why go through<br />
                <span className="italic font-light text-ink/45">all this?</span>
              </h3>
              <p className="text-[10px] text-ink/35 font-sans uppercase tracking-[0.25em]">
                Weeks of research. Wrong card. Zero savings.
              </p>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Pill Rows / Chaotic Scattering ── */}
      <AnimatePresence mode="wait">
        {mode === 'with' ? (
          <motion.div
            key="pills-with"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col gap-2.5"
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
            transition={{ duration: 0.3 }}
            className="relative w-full h-[180px] mt-4"
          >
            {[...WITHOUT_ROW1, ...WITHOUT_ROW2].slice(0, 10).map((pill, i) => {
              // Deterministic "random" positions
              const angles = [-15, 12, -8, 15, -4, 9, -12, 6, -10, 14];
              const lefts = [5, 45, 15, 65, 35, 75, 10, 55, 25, 80];
              const tops = [10, 25, 45, 15, 65, 80, 50, 40, 75, 60];
              
              return (
                <motion.span
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`absolute inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold shadow-sm ${pill.bg}`}
                  style={{ 
                    left: `${lefts[i]}%`, 
                    top: `${tops[i]}%`, 
                    rotate: `${angles[i]}deg`,
                    transform: 'translate(-50%, -50%)' 
                  }}
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
  );
};

// ─────────────────────────────────────────────────────────────
// ShowcaseCarousel
// ─────────────────────────────────────────────────────────────
const ShowcaseCarousel: React.FC<ShowcaseCarouselProps> = ({ cards: cardsProp }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // CTA slide-in from right
  const ctaX       = useTransform(smoothProgress, [0.75, 0.95], [120, 0]);
  const ctaOpacity = useTransform(smoothProgress, [0.75, 0.88], [0, 1]);

  return (
    <section ref={containerRef} className="relative bg-cream h-[300vh] border-t border-ink/10 z-10">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center p-2 md:p-6 lg:p-8">

        <div className="relative w-full h-full max-w-[1700px] border border-ink/10 bg-paper flex flex-col shadow-xl">

          {/* column guide lines */}
          <div className="absolute top-0 bottom-0 left-[33%] w-px bg-ink/5 hidden lg:block z-0" />
          <div className="absolute top-0 bottom-0 right-[33%] w-px bg-ink/5 hidden lg:block z-0" />

          <div className="w-full h-full relative z-10 text-ink">
            <div className="flex flex-col lg:grid lg:grid-cols-2 h-full">

              {/* ── LEFT: copy ── */}
              <div className="h-[40%] lg:h-full flex flex-col justify-center px-6 lg:px-20 relative z-20 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="pointer-events-auto py-10"
                >
                  <span className="block text-clay text-[11px] font-bold uppercase tracking-[0.4em] mb-4">
                    How It Works
                  </span>
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-ink mb-8 leading-[0.82] tracking-tighter uppercase">
                    We Compare <br />
                    <span className="italic font-light text-clay">For You.</span>
                  </h2>
                  <p className="text-ink/80 text-lg md:text-xl font-serif italic leading-snug mb-10 border-l-2 border-clay/30 pl-8 max-w-md">
                    "We don't just list cards. We scan 200+ options to find the one that fits your life perfectly."
                  </p>
                  <div className="flex items-center gap-6 text-[11px] font-bold tracking-[0.3em] uppercase text-ink/30">
                    <motion.div
                      animate={{ width: [40, 80, 40] }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                      className="h-px bg-clay/50"
                    />
                    Scroll down
                  </div>
                </motion.div>
              </div>

              {/* ── RIGHT (Previously Centre): comparison widget ── */}
              <div className="h-[60%] lg:h-full flex items-center justify-center lg:border-l border-ink/10 overflow-hidden bg-cream/20">
                <div className="w-full max-w-xl scale-110 lg:scale-125">
                  <ComparisonWidget />
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