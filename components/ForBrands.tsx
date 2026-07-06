import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, TrendingUp, Users, Zap, Package, ChevronRight } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import SEO from './SEO';

/* ─── Global CSS ─────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @keyframes marquee-fwd { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes marquee-rev { from { transform: translateX(-50%); } to { transform: translateX(0); } }
  @keyframes float-a { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-18px) rotate(2deg); } }
  @keyframes float-b { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-12px) rotate(-1.5deg); } }
  @keyframes pulse-glow { 0%,100% { box-shadow: 0 0 40px -10px rgba(52,211,153,0.3); } 50% { box-shadow: 0 0 70px -5px rgba(52,211,153,0.55); } }
  @keyframes shimmer { from { background-position: -200% center; } to { background-position: 200% center; } }
  @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes grain { 0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)} 20%{transform:translate(3%,2%)} 30%{transform:translate(-1%,4%)} 40%{transform:translate(2%,-1%)} 50%{transform:translate(-3%,3%)} 60%{transform:translate(1%,-2%)} 70%{transform:translate(-2%,1%)} 80%{transform:translate(3%,-3%)} 90%{transform:translate(-1%,2%)} }
  .fwd-marquee  { animation: marquee-fwd 40s linear infinite; display:flex; width:max-content; }
  .rev-marquee  { animation: marquee-rev 35s linear infinite; display:flex; width:max-content; }
  .float-a      { animation: float-a 7s ease-in-out infinite; }
  .float-b      { animation: float-b 9s ease-in-out infinite; }
  .cta-glow     { animation: pulse-glow 3s ease-in-out infinite; }
  .logo-pill    { border: 1px solid rgba(255,255,255,0.11); border-radius: 8px; width: 36px; height: 36px; overflow:hidden; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; transition: opacity 0.3s; }
  .logo-pill:hover { opacity: 0.85; }
  .logo-img     { width: 36px; height: 36px; object-fit: cover; display:block; }

  .shimmer-text {
    background: linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,1) 40%, rgba(52,211,153,1) 55%, rgba(255,255,255,1) 70%, rgba(255,255,255,0.5) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 5s linear infinite;
  }
  .noise::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 128px 128px;
    opacity: 0.025;
    pointer-events: none;
    z-index: 0;
  }
  .grid-bg {
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 64px 64px;
  }
`;

/* ─── Data ───────────────────────────────────────────────────────── */
const BRAND_ROW1 = [
  { src: '/assets/brand-logos/amazon-logo.png', alt: 'Amazon' },
  { src: '/assets/brand-logos/myntra-logo.jpeg', alt: 'Myntra' },
  { src: '/assets/brand-logos/nykaa-logo.jpeg', alt: 'Nykaa' },
  { src: '/assets/brand-logos/ajio-logo.jpeg', alt: 'Ajio' },
  { src: '/assets/brand-logos/bookmyshow-logo.png', alt: 'BookMyShow' },
  { src: '/assets/brand-logos/starbucks-logo.png', alt: 'Starbucks' },
  { src: '/assets/brand-logos/zepto-logo.png', alt: 'Zepto' },
  { src: '/assets/brand-logos/manyavar-logo.jpeg', alt: 'Manyavar' },
  { src: '/assets/brand-logos/snitch-logo.png', alt: 'Snitch' },
  { src: '/assets/brand-logos/westside-logo.png', alt: 'Westside' },
];
const BRAND_ROW2 = [
  { src: '/assets/brand-logos-2/blinkit-logo.png', alt: 'Blinkit' },
  { src: '/assets/brand-logos-2/cleartrip-logo.png', alt: 'Cleartrip' },
  { src: '/assets/brand-logos-2/boat-logo.jpeg', alt: 'boAt' },
  { src: '/assets/brand-logos-2/cinepolis-logo.jpeg', alt: 'Cinepolis' },
  { src: '/assets/brand-logos-2/caratlane-logo.jpeg', alt: 'CaratLane' },
  { src: '/assets/brand-logos-2/air-india-logo.png', alt: 'Air India' },
  { src: '/assets/brand-logos-2/cult-fit-logo.jpeg', alt: 'Cult.fit' },
  { src: '/assets/brand-logos-2/birkenstock-logo.png', alt: 'Birkenstock' },
  { src: '/assets/brand-logos-2/cafe-coffee-day-logo.webp', alt: 'CCD' },
  { src: '/assets/brand-logos-2/dailyobjects-logo.png', alt: 'DailyObjects' },
];

const D2C_BRANDS = [
  { src: '/assets/brand-logos/amazon-logo.png', alt: 'Amazon' },
  { src: '/assets/brand-logos/myntra-logo.jpeg', alt: 'Myntra' },
  { src: '/assets/brand-logos/nykaa-logo.jpeg', alt: 'Nykaa' },
  { src: '/assets/brand-logos/ajio-logo.jpeg', alt: 'Ajio' },
  { src: '/assets/brand-logos-2/blinkit-logo.png', alt: 'Blinkit' },
  { src: '/assets/brand-logos-2/boat-logo.jpeg', alt: 'boAt' },
];

const CARD_LOGOS = [
  '/assets/cards/hdfc.png', '/assets/cards/icici.png', '/assets/cards/axis.png',
  '/assets/cards/amex.png', '/assets/cards/sbi.png', '/assets/cards/kotak.png',
  '/assets/cards/rbl.png', '/assets/cards/indusind.png', '/assets/cards/hsbc.png',
  '/assets/cards/idfc.png',
];

const ADVANTAGES = [
  {
    icon: Users,
    title: 'Capture the Credit-Active Audience',
    body: "India's financially sharpest consumers — users who optimize spending, stack rewards, and make high-intent purchases — are Yureka's core. They're yours to reach.",
    iconBg: 'bg-clay/15', iconColor: 'text-clay',
    gradient: 'from-clay/[0.09] to-transparent',
    border: 'border-clay/20',
    stat: '120M+', statLabel: 'Reachable shoppers',
  },
  {
    icon: TrendingUp,
    title: 'Pay Only for Performance',
    body: "Intent-based placement means your brand appears only when users are actively deciding where to buy. No impressions, no wasted spend — pure conversion-ready exposure.",
    iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400',
    gradient: 'from-blue-500/[0.07] to-transparent',
    border: 'border-blue-500/15',
    stat: '₹10:1', statLabel: 'ROAS potential',
  },
  {
    icon: ShieldCheck,
    title: 'Capitalize on First-Party Data',
    body: "Every transaction builds a richer credit and spending profile. Partners gain pre-scored, consent-verified signals — not raw data dumps — for smarter decisions.",
    iconBg: 'bg-purple-500/10', iconColor: 'text-purple-400',
    gradient: 'from-purple-500/[0.07] to-transparent',
    border: 'border-purple-500/15',
    stat: 'RBI', statLabel: 'Compliant LSP',
  },
];

const STATS = [
  { value: 10, suffix: ':1', prefix: '₹', label: 'Topline ROAS potential', color: 'text-clay' },
  { value: 16, suffix: '%', prefix: '', label: 'Effective user ROI', color: 'text-emerald-400' },
  { value: 120, suffix: 'M+', prefix: '', label: 'Target power shoppers', color: 'text-blue-400' },
  { value: 200, suffix: '+', prefix: '', label: 'Credit cards catalogued', color: 'text-purple-400' },
];

const STEPS = [
  { n: '01', title: 'Integrate', desc: "Connect via Yureka's API in days — onboarding takes less than a week.", icon: Package },
  { n: '02', title: 'Activate', desc: "Your brand appears inside Yureka AI's recommendation layer at the exact decision moment.", icon: Zap },
  { n: '03', title: 'Convert', desc: 'Smart checkout routes orders — COD risk drops, prepaid and BNPL uptake rises.', icon: TrendingUp },
  { n: '04', title: 'Compound', desc: 'Every purchase builds Goldback for users and richer intelligence for you.', icon: Users },
];

/* ─── Hooks ──────────────────────────────────────────────────────── */
function useCounter(target: number, duration = 2200) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let cur = 0;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        cur = Math.min(cur + step, target);
        setCount(Math.floor(cur));
        if (cur >= target) clearInterval(timer);
      }, 16);
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { ref, count };
}

/* ─── Components ─────────────────────────────────────────────────── */
const TiltCard: React.FC<{ children: React.ReactNode; className?: string; intensity?: number }> = ({
  children, className, intensity = 10,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 300, damping: 25 });
  const rY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 300, damping: 25 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: rX, rotateY: rY, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const StatCounter: React.FC<{ value: number; prefix?: string; suffix?: string; color: string }> = ({
  value, prefix = '', suffix = '', color,
}) => {
  const { ref, count } = useCounter(value);
  return (
    <span ref={ref} className={`tabular-nums ${color}`}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

/* ─── Main Page ──────────────────────────────────────────────────── */
const ForBrands: React.FC = () => {
  /* Hero 3D mouse tracking */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const dashRotX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 80, damping: 30 });
  const dashRotY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 80, damping: 30 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mx, my]);

  /* Spotlight */
  const [spot, setSpot] = useState({ x: 50, y: 40 });

  const CHART_DATA = [
    { title: 'Transactions', bars: [35, 60, 45, 78, 55, 72, 88], color: 'rgba(52,211,153,' },
    { title: 'Revenue (₹L)', bars: [28, 52, 42, 68, 80, 58, 92], color: 'rgba(96,165,250,' },
    { title: 'Avg. Order Value', bars: [58, 38, 68, 48, 76, 62, 72], color: 'rgba(167,139,250,' },
  ];

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <SEO
        title="Partner With Yureka | Smart Checkout, AI Ads & Credit Data"
        description="Cut RTO and COD failures with Yureka smart checkout, run intent-based campaigns via Yureka AI, and access consent-first alternative credit signals for lending decisions."
      />

      <div className="min-h-screen bg-cream text-white overflow-x-hidden">

        {/* ═══════════════════════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════════════════════ */}
        <section
          className="relative pt-40 pb-16 px-6 overflow-hidden noise grid-bg"
          onMouseMove={e => {
            const r = e.currentTarget.getBoundingClientRect();
            setSpot({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          }}
        >
          {/* Spotlight follow */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{ background: `radial-gradient(700px circle at ${spot.x}% ${spot.y}%, rgba(52,211,153,0.05), transparent 55%)` }}
          />
          {/* Floating orbs */}
          <motion.div animate={{ y: [0, -24, 0], x: [0, 12, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-32 left-[10%] w-72 h-72 rounded-full bg-clay/[0.07] blur-[90px] pointer-events-none" />
          <motion.div animate={{ y: [0, 20, 0], x: [0, -10, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-64 right-[8%] w-80 h-80 rounded-full bg-blue-500/[0.05] blur-[110px] pointer-events-none" />
          <motion.div animate={{ y: [0, -16, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            className="absolute bottom-0 left-1/2 w-96 h-48 rounded-full bg-purple-500/[0.04] blur-[100px] pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
              <div className="inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.1] rounded-full px-5 py-2.5 mb-12 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.45em] text-clay">Open Rewards Network · India</span>
              </div>

              <h1 className="text-5xl sm:text-7xl md:text-[90px] font-sans font-extrabold leading-[0.9] tracking-normal mb-8">
                <span className="shimmer-text">ROAS you can<br />count on.</span>
              </h1>

              <p className="text-white/40 text-base md:text-xl font-serif italic max-w-2xl mx-auto leading-relaxed mb-12">
                Our network of credit-active Indian consumers is the most financially engaged
                audience in the country. Get in front of the right customers and boost their
                LTV without spending a fortune.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24">
                <Link
                  to="/join-waitlist"
                  className="group relative inline-flex items-center gap-3 bg-clay text-black font-black uppercase tracking-[0.2em] text-[11px] px-12 py-5 rounded-full cta-glow hover:scale-105 transition-transform duration-300 overflow-hidden"
                >
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                </Link>
                <a href="mailto:partnerships@yureka.money"
                  className="inline-flex items-center gap-2 text-white/35 hover:text-white font-black uppercase tracking-[0.15em] text-[10px] transition-colors">
                  Schedule a Demo <ChevronRight size={12} />
                </a>
              </div>
            </motion.div>

            {/* 3-D Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: '1200px' }}
            >
              <motion.div
                style={{ rotateX: dashRotX, rotateY: dashRotY, transformStyle: 'preserve-3d' }}
                className="relative mx-auto max-w-4xl"
              >
                {/* Main card */}
                <div className="relative bg-[#0b0b0b]/90 backdrop-blur-xl border border-white/[0.09] rounded-[28px] p-6 shadow-[0_80px_160px_-30px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.06)]">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-clay flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(52,211,153,0.4)]">
                        <span className="text-black text-[12px] font-black">Y</span>
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-white uppercase tracking-widest">Merchant Dashboard</div>
                        <div className="text-[8px] text-white/20 uppercase tracking-[0.3em] mt-0.5">This Month's Overview</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-clay/60" />
                      </div>
                    </div>
                  </div>

                  {/* Stat cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
                    {[
                      { label: 'Total Budget', value: '₹2,30,000', delta: '+12%' },
                      { label: 'Revenue Driven', value: '₹9,72,000', delta: '+38%' },
                      { label: 'Transactions', value: '1,840', delta: '+24%' },
                      { label: 'Avg. ROAS', value: '₹10:1', delta: '+8%' },
                    ].map((s, i) => (
                      <div key={i} className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 hover:border-white/[0.1] transition-colors group">
                        <div className="text-[7px] text-white/20 uppercase tracking-[0.3em] mb-2">{s.label}</div>
                        <div className="text-sm font-sans font-extrabold text-white tracking-tight">{s.value}</div>
                        <div className="text-[8px] font-black text-clay mt-1">{s.delta} vs last month</div>
                      </div>
                    ))}
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {CHART_DATA.map((chart, ci) => (
                      <div key={chart.title} className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4">
                        <div className="text-[7px] font-black text-white/25 uppercase tracking-[0.3em] mb-3">{chart.title}</div>
                        <div className="flex items-end gap-0.5 h-10">
                          {chart.bars.map((h, i) => (
                            <motion.div
                              key={i}
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              transition={{ delay: 0.8 + ci * 0.1 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                              className="flex-1 rounded-sm"
                              style={{ background: `${chart.color}0.3)` }}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between mt-1.5">
                          {['J', 'F', 'M', 'A', 'M', 'J', 'J'].map((m, i) => (
                            <span key={i} className="text-[6px] text-white/15">{m}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating offer card */}
                <div className="absolute -top-8 -right-4 md:-right-12 bg-[#0f0f0f] border border-white/[0.1] rounded-2xl p-5 w-48 shadow-[0_20px_60px_rgba(0,0,0,0.8)] hidden md:block float-a" style={{ transform: 'translateZ(30px)' }}>
                  <div className="text-[7px] font-black text-white/20 uppercase tracking-[0.35em] mb-3">Live Offers</div>
                  {['Goldback · 16% ROI', 'Yureka AI · Intent', 'Smart Checkout · Live', 'Credit Data · LSP'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 py-2 border-b border-white/[0.05] last:border-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-clay shrink-0" />
                      <span className="text-[9px] text-white/45">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Floating mini analytics card */}
                <div className="absolute -bottom-8 -left-4 md:-left-12 bg-[#0f0f0f] border border-white/[0.1] rounded-2xl p-5 w-44 shadow-[0_20px_60px_rgba(0,0,0,0.8)] hidden md:block float-b" style={{ transform: 'translateZ(20px)' }}>
                  <div className="text-[7px] font-black text-white/20 uppercase tracking-[0.35em] mb-3">Top Brand</div>
                  <div className="text-[11px] font-black text-white mb-1">Amazon</div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                    <motion.div initial={{ width: 0 }} animate={{ width: '78%' }} transition={{ delay: 1.2, duration: 0.8 }} className="h-full bg-clay rounded-full" />
                  </div>
                  <div className="text-[8px] text-clay font-black">₹4.2L revenue driven</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            BRAND LOGO MARQUEE — TWO ROWS
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-10 border-y border-white/[0.05] overflow-hidden">
          {/* Row 1 — forward */}
          <div className="flex overflow-hidden mb-3">
            <div className="fwd-marquee items-center gap-3 px-3">
              {[...BRAND_ROW1, ...BRAND_ROW1].map((b, i) => (
                <div key={i} className="logo-pill">
                  <img src={b.src} alt={b.alt} className="logo-img" />
                </div>
              ))}
            </div>
          </div>
          {/* Row 2 — reverse */}
          <div className="flex overflow-hidden">
            <div className="rev-marquee items-center gap-3 px-3">
              {[...BRAND_ROW2, ...BRAND_ROW2].map((b, i) => (
                <div key={i} className="logo-pill">
                  <img src={b.src} alt={b.alt} className="logo-img" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SPLIT VALUE PROP
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-36 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-clay mb-5">The Opportunity</p>
              <h2 className="text-4xl md:text-5xl lg:text-[58px] font-sans font-extrabold tracking-tight text-white leading-[1.0] mb-8">
                Reach India's power shoppers with less spend and more precision.
              </h2>
              <div className="flex flex-col gap-5">
                <p className="text-white/45 font-serif italic text-base md:text-lg leading-relaxed">
                  Showcase your brand across Yureka's AI concierge and credit card network
                  to attract a new, loyal population of customers you can't reach anywhere else.
                </p>
                <p className="text-white/30 font-serif text-sm leading-relaxed">
                  Fine-tune your campaigns with Yureka's exclusive consumer insights — from
                  shopper behavior and purchase frequency to wallet share. Measure true
                  incremental lift using first-party transaction data.
                </p>
                <a href="mailto:partnerships@yureka.money"
                  className="inline-flex items-center gap-2.5 text-clay font-black uppercase tracking-[0.2em] text-[10px] hover:gap-4 transition-all duration-300 w-fit mt-2">
                  Talk to partnerships <ArrowRight size={12} />
                </a>
              </div>
            </motion.div>

            {/* Credit card catalogue visual */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative h-72"
              style={{ perspective: '800px' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-clay/[0.06] to-transparent rounded-3xl border border-white/[0.07]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8">
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/25 mb-2">200+ Credit Cards Catalogued</p>
                <div className="grid grid-cols-5 gap-2 w-full max-w-xs">
                  {CARD_LOGOS.map((src, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06, duration: 0.4 }}
                      whileHover={{ scale: 1.15, y: -4 }}
                      className="aspect-square bg-white/[0.04] border border-white/[0.08] rounded-xl flex items-center justify-center p-2"
                    >
                      <img src={src} alt="bank" className="w-full h-full object-contain" style={{ filter: 'grayscale(1) contrast(0.75)', opacity: 0.55 }} />
                    </motion.div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse" />
                  <span className="text-[8px] font-black text-white/25 uppercase tracking-[0.3em]">Fully audited · Expert reviewed</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            WHY YUREKA — 3D TILT CARDS
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-20 px-6 border-t border-white/[0.05]">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-clay mb-4">Why Yureka</p>
              <h2 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-white">Three unfair advantages.</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ADVANTAGES.map((a, i) => (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                >
                  <TiltCard
                    intensity={8}
                    className={`relative border ${a.border} rounded-[2rem] p-8 flex flex-col gap-5 overflow-hidden cursor-pointer h-full bg-gradient-to-br ${a.gradient} to-[#0a0a0a] hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] transition-shadow duration-500`}
                  >
                    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at 50% 0%, ${a.iconBg.includes('clay') ? 'rgba(52,211,153,0.05)' : a.iconBg.includes('blue') ? 'rgba(96,165,250,0.05)' : 'rgba(167,139,250,0.05)'}, transparent 70%)` }} />
                    <div className="relative z-10 flex flex-col gap-5">
                      <div className={`w-12 h-12 rounded-2xl ${a.iconBg} flex items-center justify-center border border-white/[0.08]`} style={{ transform: 'translateZ(20px)' }}>
                        <a.icon size={20} className={a.iconColor} />
                      </div>
                      <div>
                        <div className="text-[28px] font-sans font-extrabold tracking-tight leading-none mb-1" style={{ color: a.iconColor.replace('text-', '') === 'clay' ? '#34d399' : undefined }}>
                          <span className={a.iconColor}>{a.stat}</span>
                        </div>
                        <div className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25">{a.statLabel}</div>
                      </div>
                      <h3 className="text-[17px] font-sans font-extrabold tracking-tight text-white leading-snug">{a.title}</h3>
                      <p className="text-white/40 text-sm leading-relaxed font-serif">{a.body}</p>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            ANIMATED STATS
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-24 px-6 border-t border-white/[0.05] relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-50" />
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <div className={`text-5xl md:text-6xl font-sans font-extrabold tracking-tight leading-none mb-3`}>
                  <StatCounter value={s.value} prefix={s.prefix} suffix={s.suffix} color={s.color} />
                </div>
                <div className="text-[8px] font-black uppercase tracking-[0.35em] text-white/25 leading-relaxed">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            USE CASE CARDS — D2C + LENDERS
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-24 px-6 border-t border-white/[0.05]">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5">
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 mb-3">The Modern Rewards Network</p>
              <p className="text-white/35 font-serif italic text-lg max-w-2xl leading-relaxed">
                Explore how Yureka helps D2C brands, lenders, and financial institutions
                capture new high-value customers for life.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
              {/* D2C Card — with real brand logos */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <TiltCard
                  intensity={6}
                  className="relative border border-clay/15 rounded-[2.5rem] p-10 overflow-hidden bg-[#0b1a10] hover:border-clay/30 transition-colors duration-500 h-full"
                >
                  <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-clay/[0.06] blur-[60px] pointer-events-none" />
                  <div className="relative z-10 flex flex-col h-full">
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/25 mb-4">D2C & E-Commerce</p>
                    <h3 className="text-3xl md:text-4xl font-sans font-extrabold tracking-tight text-white leading-tight mb-4">
                      Yureka for<br />D2C Brands
                    </h3>
                    <p className="text-white/40 font-serif italic text-sm mb-8 leading-relaxed">
                      Reach India's reward-maximizing shoppers at the exact moment of purchase intent.
                    </p>

                    {/* Brand logo grid */}
                    <div className="grid grid-cols-3 gap-2.5 mb-8">
                      {D2C_BRANDS.map((b, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.04 }}
                          className="bg-white/[0.07] border border-white/[0.1] rounded-xl flex items-center justify-center p-3"
                          style={{ height: 64 }}
                        >
                          <img src={b.src} alt={b.alt} className="max-w-full max-h-full object-contain block" style={{ maxHeight: 40, opacity: 0.95 }} />
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2.5 mb-8">
                      {['AI-targeted placements inside Yureka concierge', 'Smart checkout: COD → Prepaid / BNPL routing', 'Goldback co-branding to make rewards sticky'].map(b => (
                        <div key={b} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-clay mt-1.5 shrink-0" />
                          <span className="text-[11px] font-bold text-white/45 uppercase tracking-wider leading-relaxed">{b}</span>
                        </div>
                      ))}
                    </div>
                    <Link to="/join-waitlist"
                      className="inline-flex items-center gap-3 bg-white/[0.04] border border-white/[0.1] hover:border-clay/40 hover:bg-clay/10 hover:text-clay text-white font-black uppercase tracking-[0.15em] text-[10px] px-8 py-3.5 rounded-full transition-all duration-300 w-fit mt-auto">
                      Start Selling Smarter <ArrowRight size={12} />
                    </Link>
                  </div>
                </TiltCard>
              </motion.div>

              {/* Lenders Card — with abstract credit viz */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <TiltCard
                  intensity={6}
                  className="relative border border-white/[0.08] rounded-[2.5rem] p-10 overflow-hidden bg-[#0d0d1c] hover:border-blue-500/20 transition-colors duration-500 h-full"
                >
                  <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-blue-500/[0.05] blur-[60px] pointer-events-none" />
                  <div className="relative z-10 flex flex-col h-full">
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/25 mb-4">Lenders & NBFCs</p>
                    <h3 className="text-3xl md:text-4xl font-sans font-extrabold tracking-tight text-white leading-tight mb-4">
                      Yureka for<br />Lenders
                    </h3>
                    <p className="text-white/40 font-serif italic text-sm mb-8 leading-relaxed">
                      Expand your lending pool with consent-first alternative credit signals.
                    </p>

                    {/* Abstract credit profile visualization */}
                    <div className="relative h-28 mb-8 bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden p-4">
                      <div className="text-[7px] font-black text-white/20 uppercase tracking-[0.35em] mb-2">Credit Profile · Consented</div>
                      <svg viewBox="0 0 260 60" className="w-full h-full" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="creditGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d="M10 50 Q50 35 90 42 Q130 28 150 20 Q180 12 220 8 L220 60 L10 60 Z" fill="url(#creditGrad)" />
                        <path d="M10 50 Q50 35 90 42 Q130 28 150 20 Q180 12 220 8" stroke="#60a5fa" strokeWidth="1.5" fill="none" opacity="0.6" />
                        {[10, 90, 150, 220].map((cx, i) => {
                          const cy = [50, 42, 20, 8][i];
                          return <circle key={i} cx={cx} cy={cy} r="3" fill="#60a5fa" opacity="0.7" />;
                        })}
                        <text x="230" y="10" fill="#60a5fa" fontSize="8" fontWeight="bold" opacity="0.6">742</text>
                        <text x="0" y="58" fill="white" fontSize="6" opacity="0.2">Low Risk →</text>
                      </svg>
                    </div>

                    <div className="flex flex-col gap-2.5 mb-8">
                      {['Pre-scored leads from consented transaction data', 'RBI-compliant LSP data sharing framework', 'High-fidelity credit profiles beyond bureau scores'].map(b => (
                        <div key={b} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                          <span className="text-[11px] font-bold text-white/45 uppercase tracking-wider leading-relaxed">{b}</span>
                        </div>
                      ))}
                    </div>
                    <Link to="/join-waitlist"
                      className="inline-flex items-center gap-3 bg-white/[0.04] border border-white/[0.1] hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400 text-white font-black uppercase tracking-[0.15em] text-[10px] px-8 py-3.5 rounded-full transition-all duration-300 w-fit mt-auto">
                      Expand Your Lending Pool <ArrowRight size={12} />
                    </Link>
                  </div>
                </TiltCard>
              </motion.div>
            </div>

            {/* Sub-category tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              {[
                { title: 'Brick & Mortar', desc: "Target lapsed or casual users in an untapped channel with Yureka's first-party data" },
                { title: 'D2C', desc: 'List next to curated card offers to get your brand the attention it deserves — with guaranteed intent' },
                { title: 'E-Commerce', desc: 'Engage digital consumers and increase basket size with AI-powered card-based targeting' },
              ].map((cat, i) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-[2rem] p-7 hover:border-white/[0.12] transition-all duration-300"
                >
                  <h4 className="text-clay text-base font-sans font-extrabold tracking-tight mb-2.5">{cat.title}</h4>
                  <p className="text-white/30 text-sm leading-relaxed font-serif">{cat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            HOW IT WORKS — Animated Timeline
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-32 px-6 border-t border-white/[0.05] relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-clay mb-4">The Partnership Loop</p>
              <h2 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-white">How it works.</h2>
            </motion.div>

            <div className="relative">
              {/* Animated vertical line */}
              <div className="absolute left-[31px] top-0 bottom-0 w-px bg-white/[0.05] hidden md:block" />
              <motion.div
                className="absolute left-[31px] top-0 w-px bg-gradient-to-b from-clay via-clay/50 to-transparent hidden md:block"
                initial={{ height: 0 }}
                whileInView={{ height: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
              />

              <div className="space-y-0">
                {STEPS.map((s, i) => (
                  <motion.div
                    key={s.n}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex gap-8 py-10 border-b border-white/[0.05] last:border-0 group"
                  >
                    {/* Step icon circle */}
                    <div className="relative shrink-0 hidden md:flex">
                      <div className="w-16 h-16 rounded-full bg-[#0a0a0a] border border-white/[0.08] flex items-center justify-center group-hover:border-clay/30 transition-colors duration-300 z-10">
                        <s.icon size={20} className="text-white/20 group-hover:text-clay transition-colors duration-300" />
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-[8px] font-black text-clay/50 uppercase tracking-[0.4em]">{s.n}</span>
                          <h3 className="text-xl font-sans font-extrabold text-white uppercase tracking-tight group-hover:text-clay transition-colors duration-300">{s.title}</h3>
                        </div>
                        <p className="text-white/35 text-sm leading-relaxed font-serif">{s.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            FINAL CTA
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-36 px-6 border-t border-white/[0.05] relative overflow-hidden">
          {/* Animated background gradient */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.08, 0.04] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-clay blur-[100px] pointer-events-none"
          />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2.5 bg-clay/10 border border-clay/20 rounded-full px-6 py-3 mb-12 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse" />
                <Users size={12} className="text-clay" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-clay">Limited Partner Slots — 2026 Cohort</span>
              </div>

              <h2 className="text-5xl md:text-7xl font-sans font-extrabold tracking-normal text-white leading-[0.92] mb-8">
                Ready to reach<br />
                <span className="text-clay">India's power<br />shoppers?</span>
              </h2>

              <p className="text-white/35 font-serif italic text-lg mb-14 max-w-xl mx-auto leading-relaxed">
                Apply for the 2026 partner cohort. We onboard brands that align with
                the Goldback economy — high-intent, high-value, high-repeat.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link
                  to="/join-waitlist"
                  className="group relative inline-flex items-center gap-3 bg-clay text-black font-black uppercase tracking-[0.2em] text-[11px] px-14 py-5 rounded-full cta-glow hover:scale-105 transition-transform duration-300 overflow-hidden"
                >
                  <span className="relative z-10">Apply Now</span>
                  <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/25 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                </Link>
                <a href="mailto:partnerships@yureka.money"
                  className="text-white/25 hover:text-white font-black uppercase tracking-[0.2em] text-[10px] transition-colors">
                  partnerships@yureka.money
                </a>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
};

export default ForBrands;
