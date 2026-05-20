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
  { icon: '⚡', text: 'AI-matched rewards',      bg: 'bg-clay text-black' },
  { icon: '🎯', text: 'Zero hidden fees',         bg: 'bg-clay text-black' },
  { icon: '💳', text: '200+ cards analyzed',      bg: 'bg-clay text-black' },
  { icon: '✅', text: 'Best card, guaranteed',    bg: 'bg-clay text-black' },
  { icon: '🔄', text: 'Instant comparison',       bg: 'bg-clay text-black' },
  { icon: '🤖', text: 'Neural matching',          bg: 'bg-clay text-black' },
  { icon: '🎁', text: 'Max rewards unlocked',     bg: 'bg-clay text-black' },
];
const WITH_ROW2 = [
  { icon: '💰', text: '₹15k average savings',    bg: 'bg-clay text-black' },
  { icon: '📊', text: 'Reward math done for you', bg: 'bg-clay text-black' },
  { icon: '🏆', text: 'Top cluster match',        bg: 'bg-clay text-black' },
  { icon: '🔐', text: 'Unbiased, always',         bg: 'bg-clay text-black' },
  { icon: '📱', text: 'Chrome auto-apply',        bg: 'bg-clay text-black' },
  { icon: '⚡', text: 'Real-time audit',          bg: 'bg-clay text-black' },
  { icon: '🎯', text: 'Spend-matched card',       bg: 'bg-clay text-black' },
];

const WITHOUT_ROW1 = [
  { icon: '😵', text: 'Hours of research',        bg: 'bg-red-950/60 text-red-200 border border-red-900/60' },
  { icon: '❓', text: 'Guessing the best card',   bg: 'bg-red-950/40 text-red-200 border border-red-900/40' },
  { icon: '💸', text: 'Missing cashback',          bg: 'bg-red-950/60 text-red-200 border border-red-900/60' },
  { icon: '😤', text: 'Bank rep bias',             bg: 'bg-red-950/40 text-red-200 border border-red-900/40' },
  { icon: '📋', text: '200+ cards to compare',    bg: 'bg-red-950/60 text-red-200 border border-red-900/60' },
  { icon: '⚠️', text: 'Wrong card fees',           bg: 'bg-red-950/40 text-red-200 border border-red-900/40' },
  { icon: '😓', text: 'Confusing reward math',    bg: 'bg-red-950/60 text-red-200 border border-red-900/60' },
];
const WITHOUT_ROW2 = [
  { icon: '🔍', text: 'Weeks of comparison',      bg: 'bg-red-950/40 text-red-200 border border-red-900/40' },
  { icon: '💀', text: 'Trapped in low rewards',   bg: 'bg-red-950/60 text-red-200 border border-red-900/60' },
  { icon: '📉', text: 'No savings strategy',      bg: 'bg-red-950/40 text-red-200 border border-red-900/40' },
  { icon: '🏦', text: 'Bank-first advice',        bg: 'bg-red-950/60 text-red-200 border border-red-900/60' },
  { icon: '❌', text: 'Missed joining bonus',     bg: 'bg-red-950/40 text-red-200 border border-red-900/40' },
  { icon: '📱', text: 'Manual reward tracking',   bg: 'bg-red-950/60 text-red-200 border border-red-900/60' },
  { icon: '😡', text: 'Hidden annual fees',       bg: 'bg-red-950/40 text-red-200 border border-red-900/40' },
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
  const [isScanning, setIsScanning] = React.useState(false);

  React.useEffect(() => {
    if (mode === 'with') {
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
              ? 'bg-clay text-cream shadow-[0_0_20px_rgba(52,211,153,0.3)]'
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
            animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="text-center mb-12 px-2 relative z-10"
          >
            {mode === 'with' ? (
              <>
                <h3 className="text-2xl md:text-3xl font-serif text-white leading-snug mb-1.5 uppercase tracking-tighter">
                  Just pick your card,<br />
                  <span className="italic font-light text-clay">and start earning.</span>
                </h3>
                <p className="text-[11px] text-white/80 font-sans uppercase tracking-[0.3em] font-bold">
                  The Protocol executes the complex math. You keep the yield.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-2xl md:text-3xl font-serif text-white leading-snug mb-1.5 uppercase tracking-tighter">
                  Why settle for<br />
                  <span className="italic font-light text-white/45 lowercase">sub-optimal?</span>
                </h3>
                <p className="text-[11px] text-white/80 font-sans uppercase tracking-[0.3em] font-bold">
                  Manual research is the slow lane to wealth.
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── CONTENT AREA ── */}
        <div className="relative w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full pt-4 grid grid-cols-2 gap-4"
            >
              {(mode === 'with' ? [...WITH_ROW1, ...WITH_ROW2] : [...WITHOUT_ROW1, ...WITHOUT_ROW2]).slice(0, 8).map((pill, i) => (
                <div
                  key={pill.text}
                  className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-bold shadow-sm border border-white/5 transition-all hover:scale-[1.02] ${pill.bg}`}
                >
                  <span className="text-xs">{pill.icon}</span>
                  <span className="truncate">{pill.text}</span>
                </div>
              ))}
            </motion.div>
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
    <section className="relative bg-cream border-t border-white/5 z-10 w-full">
      <div className="w-full flex justify-center flex-col">
        <div className="relative w-full border-x-0 border-b border-white/5 bg-white/[0.02] flex flex-col shadow-2xl overflow-hidden">

          {/* Background Vellum Grid */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} 
          />
          
          <div className="w-full h-full relative z-10 text-white">
      <div className="flex flex-col lg:grid lg:grid-cols-2">

              {/* ── LEFT: copy ── */}
              <div className="flex flex-col justify-center px-6 lg:px-12 py-8 lg:py-10 relative z-20 border-b lg:border-b-0 lg:border-r border-white/5">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="block text-clay text-[11px] font-bold uppercase tracking-[0.4em] mb-4">
                    How It Works
                  </span>
                  <h2 className="text-4xl md:text-5xl lg:text-[clamp(1.5rem,3.5vw,4.5rem)] font-serif text-white mb-8 leading-[0.85] tracking-tighter uppercase">
                    We Compare <br />
                    <span className="italic font-light text-clay">For You.</span>
                  </h2>
                  <p className="text-white/60 text-base md:text-lg lg:text-xl font-serif italic leading-snug mb-6 border-l-2 border-clay/30 pl-8 max-w-md">
                    "We don't just list cards. We scan 200+ options to find the one that fits your life perfectly."
                  </p>
                  <div className="flex items-center gap-6 text-[11px] font-bold tracking-[0.3em] uppercase text-white/20">
                    <motion.div
                      animate={{ width: [40, 80, 40] }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                      className="h-px bg-clay/50"
                    />
                    Scroll to discover
                  </div>
                </motion.div>
              </div>

              {/* ── RIGHT: comparison widget ── */}
              <div className="flex items-center justify-center overflow-hidden bg-white/[0.01] py-6 px-6 lg:py-8">
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