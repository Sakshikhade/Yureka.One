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

      <div className="w-full max-w-md relative min-h-[400px]">
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
        <div className="relative w-full h-[300px] overflow-hidden">
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
                  const gridX = (i % 2 === 0 ? -170 : 10);
                  const gridY = Math.floor(i / 2) * 45;
                  
                  // Shattered layout positions (random on bottom, constrained)
                  const shatterX = (Math.random() * 140) - 70;
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
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-full border-x-0 border-b border-ink/10 bg-paper flex flex-col shadow-xl overflow-hidden">

          {/* Background Vellum Grid */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(to right, #242424 1px, transparent 1px), linear-gradient(to bottom, #242424 1px, transparent 1px)', backgroundSize: '60px 60px' }} 
          />
          
          <div className="w-full h-full relative z-10 text-[#242424]">
            <div className="flex flex-col lg:grid lg:grid-cols-2">

              {/* ── LEFT: copy ── */}
              <div className="flex flex-col justify-start px-6 lg:px-16 pt-10 pb-8 lg:pt-12 lg:pb-12 relative z-20 border-b lg:border-b-0 lg:border-r border-ink/5">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className=""
                >
                  <span className="block text-[#047857] text-[11px] font-bold uppercase tracking-[0.4em] mb-4">
                    How It Works
                  </span>
                  <h2 className="text-4xl md:text-5xl lg:text-[clamp(1.5rem,4.5vw,5.5rem)] font-serif text-[#242424] mb-8 leading-[0.85] tracking-tighter uppercase">
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
              <div className="flex items-start justify-center overflow-hidden bg-cream/20 pt-8 pb-10 px-6 lg:pt-10 lg:pb-12">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-xl scale-100 lg:scale-110"
                >
                  <ComparisonWidget />
                </motion.div>
              </div>

            </div>

             {/* ── BOTTOM: REAL CARD CAROUSEL (The "Lookbook") ── */}
             <div className="border-t border-ink/5 bg-paper/50 py-12 md:py-20">
                <div className="px-6 lg:px-16 mb-12 flex justify-between items-end">
                    <div>
                        <span className="text-[#047857] text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">Intelligence Portfolio</span>
                        <h3 className="text-3xl md:text-5xl font-serif text-[#242424] leading-none uppercase">Matched <br /><span className="italic font-light opacity-40 lowercase">For You.</span></h3>
                    </div>
                    <div className="hidden md:flex gap-4">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#242424]/20">Slide to explore 200+ cards</div>
                    </div>
                </div>

                <div className="relative">
                    {/* Seamless Gradient Fades */}
                    <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-paper to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-paper to-transparent z-10 pointer-events-none" />

                    <div className="overflow-x-auto no-scrollbar pb-12">
                        <div className="flex gap-4 md:gap-8 px-6 lg:px-40 w-max">
                            {cardsProp.length > 0 ? (
                                cardsProp.slice(0, 8).map((card, idx) => (
                                    <motion.div
                                        key={card.id || idx}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1, duration: 0.8 }}
                                        whileHover={{ y: -15 }}
                                        className="w-[280px] md:w-[360px] group cursor-pointer"
                                    >
                                        {/* Card Visual */}
                                        <div className="aspect-[1.58/1] relative rounded-2xl overflow-hidden shadow-xl group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] transition-all duration-700 mb-6">
                                            <img 
                                                src={card.image_url || 'https://images.unsplash.com/photo-1540066019607-e5f69323a801?q=80&w=1000&auto=format&fit=crop'} 
                                                alt={card.name} 
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                            
                                            {/* Top Left Badge */}
                                            <div className="absolute top-4 left-4">
                                                <div className="bg-cream/30 backdrop-blur-2xl border border-white/40 px-3 py-1 rounded-full text-[9px] font-bold text-white shadow-lg shadow-black/20 uppercase tracking-widest">
                                                    Match {92 + (idx % 6)}%
                                                </div>
                                            </div>

                                            {/* Bottom Details */}
                                            <div className="absolute bottom-6 left-6 right-6">
                                                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-1">{card.bank || 'Premium Banking'}</div>
                                                <h4 className="text-xl md:text-2xl font-serif text-white tracking-tight uppercase group-hover:translate-x-2 transition-transform duration-500">{card.name}</h4>
                                            </div>
                                        </div>

                                        {/* Metadata */}
                                        <div className="space-y-4 px-2">
                                            <div className="flex justify-between items-center border-b border-ink/5 pb-4">
                                                <div>
                                                    <p className="text-[9px] font-bold text-[#242424]/30 uppercase tracking-widest mb-1">Max Rewards</p>
                                                    <p className="text-lg font-serif text-[#242424]">{card.max_rewards || '4.5%'}<span className="text-xs ml-1 italic opacity-40">yield</span></p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] font-bold text-[#242424]/30 uppercase tracking-widest mb-1">Annual Fee</p>
                                                    <p className="text-lg font-serif text-[#242424]">₹{card.annual_fee || '0'}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between group/link">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#242424] group-hover/link:text-[#047857] transition-colors">Analyze Intelligence</span>
                                                <ArrowUpRight size={16} className="text-[#242424]/20 group-hover/link:text-[#047857] group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-all" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                // Skeleton Cards if no data
                                [...Array(4)].map((_, i) => (
                                    <div key={i} className="w-[300px] h-40 bg-ink/5 animate-pulse rounded-2xl" />
                                ))
                            )}
                        </div>
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