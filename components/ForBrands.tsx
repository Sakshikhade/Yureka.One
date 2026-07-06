import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, TrendingUp, Users, Zap, Package, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useScroll, useMotionTemplate } from 'motion/react';
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
  .fwd-marquee  { animation: marquee-fwd 50s linear infinite; display:flex; width:max-content; }
  .rev-marquee  { animation: marquee-rev 45s linear infinite; display:flex; width:max-content; }
  .fwd-marquee-b { animation: marquee-fwd 68s linear infinite; display:flex; width:max-content; }
  .rev-marquee-b { animation: marquee-rev 57s linear infinite; display:flex; width:max-content; }
  .float-a      { animation: float-a 7s ease-in-out infinite; }
  .float-b      { animation: float-b 9s ease-in-out infinite; }
  .cta-glow     { animation: pulse-glow 3s ease-in-out infinite; }
  .logo-circle  { border-radius: 50%; width: 88px; height: 88px; overflow:hidden; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.03); transition: opacity 0.3s; }
  .logo-circle:hover { opacity: 0.75; }
  .logo-circle img { width: 100%; height: 100%; object-fit: cover; display:block; }

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

const LOGO_ROW3 = [
  { src: '/assets/brand-logos/hugoboss-logo.png', alt: 'Hugo Boss' },
  { src: '/assets/brand-logos/itc-hotels-logo.png', alt: 'ITC Hotels' },
  { src: '/assets/brand-logos/marriott-logo.png', alt: 'Marriott' },
  { src: '/assets/brand-logos/taj-logo.jpeg', alt: 'Taj' },
  { src: '/assets/brand-logos/mcdonalds-logo.png', alt: "McDonald's" },
  { src: '/assets/brand-logos/eatsure-logo.png', alt: 'EatSure' },
  { src: '/assets/brand-logos/subway-logo.png', alt: 'Subway' },
  { src: '/assets/brand-logos/croma-logo.jpeg', alt: 'Croma' },
  { src: '/assets/brand-logos/versace-logo.jpeg', alt: 'Versace' },
  { src: '/assets/brand-logos/louis-philippe-logo.jpg', alt: 'Louis Philippe' },
];
const LOGO_ROW4 = [
  { src: '/assets/brand-logos-2/allen-solly-logo.jpeg', alt: 'Allen Solly' },
  { src: '/assets/brand-logos-2/armani-exchange-logo.png', alt: 'Armani Exchange' },
  { src: '/assets/brand-logos-2/baskin-robbins-logo.jpeg', alt: 'Baskin Robbins' },
  { src: '/assets/brand-logos-2/biba-logo.png', alt: 'Biba' },
  { src: '/assets/brand-logos-2/chumbak-logo.jpeg', alt: 'Chumbak' },
  { src: '/assets/brand-logos-2/coach-logo.png', alt: 'Coach' },
  { src: '/assets/brand-logos-2/cordelia-cruises-logo.png', alt: 'Cordelia Cruises' },
  { src: '/assets/brand-logos-2/crossword-logo.png', alt: 'Crossword' },
  { src: '/assets/brand-logos-2/behrouz-biryani-logo.jpeg', alt: 'Behrouz Biryani' },
  { src: '/assets/brand-logos-2/aldo-logo.png', alt: 'Aldo' },
];

const D2C_BRANDS = [
  { src: '/assets/brand-logos/amazon-logo.png', alt: 'Amazon' },
  { src: '/assets/brand-logos/myntra-logo.jpeg', alt: 'Myntra' },
  { src: '/assets/brand-logos/nykaa-logo.jpeg', alt: 'Nykaa' },
  { src: '/assets/brand-logos/ajio-logo.jpeg', alt: 'Ajio' },
  { src: '/assets/brand-logos-2/blinkit-logo.png', alt: 'Blinkit' },
  { src: '/assets/brand-logos-2/boat-logo.jpeg', alt: 'boAt' },
  { src: '/assets/brand-logos/zepto-logo.png', alt: 'Zepto' },
  { src: '/assets/brand-logos/bookmyshow-logo.png', alt: 'BookMyShow' },
  { src: '/assets/brand-logos/starbucks-logo.png', alt: 'Starbucks' },
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
  {
    n: '01', title: 'Integrate', icon: Package,
    badge: '< 1 week', badgeColor: 'text-clay bg-clay/10 border-clay/20',
    desc: "Connect via Yureka's API in days — onboarding takes less than a week.",
    detail: "Our engineering team handles the heavy lifting. Plug in once and you're live across Yureka's entire recommendation surface — no custom build required.",
    bullets: ['REST API with SDKs for Node, Python & Java', 'Sandbox environment available on day 1', 'Webhook-based real-time event delivery', 'Dedicated onboarding engineer assigned'],
  },
  {
    n: '02', title: 'Activate', icon: Zap,
    badge: 'AI-powered', badgeColor: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    desc: "Your brand appears inside Yureka AI's recommendation layer at the exact decision moment.",
    detail: "Yureka AI scores every user's purchase intent in real-time and surfaces your brand precisely when they're most likely to convert. Zero wasted impressions.",
    bullets: ['Intent scoring on 50M+ credit-active users', 'Card-linked offer targeting at checkout', 'Category & spend-pattern audience segments', 'A/B test multiple creatives simultaneously'],
  },
  {
    n: '03', title: 'Convert', icon: TrendingUp,
    badge: '+34% prepaid', badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    desc: 'Smart checkout routes orders — COD risk drops, prepaid and BNPL uptake rises.',
    detail: "Our checkout engine analyses real-time credit signals to route every order to the highest-success payment path — eliminating COD fraud automatically.",
    bullets: ['COD risk score per order in <200ms', 'Auto-suggest BNPL / EMI for high-value carts', 'Prepaid conversion uplift up to +34%', 'Average RTO rate reduction of 18%'],
  },
  {
    n: '04', title: 'Compound', icon: Users,
    badge: 'Flywheel effect', badgeColor: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    desc: 'Every purchase builds Goldback for users and richer intelligence for you.',
    detail: "Each transaction deepens loyalty and sharpens targeting data. The flywheel accelerates — repeat purchase rates climb, acquisition cost falls, and intelligence compounds automatically.",
    bullets: ['Goldback co-branded loyalty with your brand', 'Transaction history enriches future targeting', 'Repeat purchase rate grows each cycle', 'Real-time partner intelligence dashboard'],
  },
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

const Sparkline: React.FC<{ vals: readonly number[]; color: string }> = ({ vals, color }) => {
  const min = Math.min(...vals), max = Math.max(...vals);
  const W = 56, H = 18;
  const pts = vals.map((v, i) =>
    `${(i / (vals.length - 1)) * W},${H - ((v - min) / (max - min || 1)) * H * 0.85}`
  ).join(' ');
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible flex-shrink-0">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
    </svg>
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
  const [activeRange, setActiveRange] = useState<'7D' | '1M' | '3M' | '6M'>('1M');
  const [hoveredBar, setHoveredBar] = useState<{ ci: number; bi: number; value: string } | null>(null);
  const [liveIdx, setLiveIdx] = useState(0);

  const LIVE_EVENTS = [
    { brand: 'Amazon', action: 'Purchase', amount: '₹4,200', time: 'just now' },
    { brand: 'Nykaa', action: 'Add to cart', amount: '₹1,850', time: '3s ago' },
    { brand: 'Zepto', action: 'Purchase', amount: '₹680', time: '6s ago' },
    { brand: 'Myntra', action: 'Click', amount: '₹3,400', time: '9s ago' },
    { brand: 'BookMyShow', action: 'Purchase', amount: '₹960', time: '12s ago' },
  ];

  useEffect(() => {
    const t = setInterval(() => setLiveIdx(i => (i + 1) % LIVE_EVENTS.length), 2500);
    return () => clearInterval(t);
  }, []);

  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const howItWorksRef = useRef<HTMLElement>(null);

  /* Scroll-linked step activation */
  useEffect(() => {
    const handleScroll = () => {
      const mid = window.innerHeight * 0.45;
      let bestIdx = 0;
      let bestDist = Infinity;
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < bestDist) { bestDist = dist; bestIdx = i; }
      });
      setActiveStep(bestIdx);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const RANGE_DATA = {
    '7D': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      stats: [
        { label: 'Total Spend', value: '₹58,200', delta: '+4%', up: true },
        { label: 'Revenue Driven', value: '₹2,18,000', delta: '+18%', up: true },
        { label: 'Transactions', value: '1,840', delta: '+24%', up: true },
        { label: 'Avg. ROAS', value: '₹10:1', delta: '+8%', up: true },
      ],
      charts: [
        { title: 'Transactions', vals: [280, 320, 290, 415, 385, 520, 460], color: 'rgba(52,211,153,', fmt: (v: number) => v.toLocaleString('en-IN') },
        { title: 'Revenue (₹L)', vals: [1.8, 2.2, 1.9, 2.8, 2.6, 3.5, 3.1], color: 'rgba(96,165,250,', fmt: (v: number) => `₹${v}L` },
        { title: 'Avg. Order Value', vals: [1850, 2100, 1920, 2400, 2250, 2800, 2650], color: 'rgba(167,139,250,', fmt: (v: number) => `₹${v.toLocaleString('en-IN')}` },
      ],
      campaigns: [
        { name: 'Amazon Weekend', budget: '₹18K', revenue: '₹68K', txns: 420, roas: '10.4:1' },
        { name: 'Nykaa Flash', budget: '₹12K', revenue: '₹44K', txns: 280, roas: '9.8:1' },
      ],
    },
    '1M': {
      labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
      stats: [
        { label: 'Total Spend', value: '₹2,30,000', delta: '+12%', up: true },
        { label: 'Revenue Driven', value: '₹9,72,000', delta: '+38%', up: true },
        { label: 'Transactions', value: '7,840', delta: '+24%', up: true },
        { label: 'Avg. ROAS', value: '₹12:1', delta: '+8%', up: true },
      ],
      charts: [
        { title: 'Transactions', vals: [1240, 1580, 1820, 2160], color: 'rgba(52,211,153,', fmt: (v: number) => v.toLocaleString('en-IN') },
        { title: 'Revenue (₹L)', vals: [8.4, 10.2, 12.8, 15.6], color: 'rgba(96,165,250,', fmt: (v: number) => `₹${v}L` },
        { title: 'Avg. Order Value', vals: [1980, 2120, 2380, 2540], color: 'rgba(167,139,250,', fmt: (v: number) => `₹${v.toLocaleString('en-IN')}` },
      ],
      campaigns: [
        { name: 'Amazon Summer', budget: '₹82K', revenue: '₹2.1L', txns: 4200, roas: '12.4:1' },
        { name: 'Nykaa Beauty', budget: '₹54K', revenue: '₹1.4L', txns: 2800, roas: '10.2:1' },
      ],
    },
    '3M': {
      labels: ['Jan', 'Feb', 'Mar'],
      stats: [
        { label: 'Total Spend', value: '₹6,80,000', delta: '+28%', up: true },
        { label: 'Revenue Driven', value: '₹31,40,000', delta: '+52%', up: true },
        { label: 'Transactions', value: '23,420', delta: '+41%', up: true },
        { label: 'Avg. ROAS', value: '₹14:1', delta: '+18%', up: true },
      ],
      charts: [
        { title: 'Transactions', vals: [4820, 5640, 7180], color: 'rgba(52,211,153,', fmt: (v: number) => v.toLocaleString('en-IN') },
        { title: 'Revenue (₹L)', vals: [32.4, 38.6, 52.2], color: 'rgba(96,165,250,', fmt: (v: number) => `₹${v}L` },
        { title: 'Avg. Order Value', vals: [2180, 2340, 2580], color: 'rgba(167,139,250,', fmt: (v: number) => `₹${v.toLocaleString('en-IN')}` },
      ],
      campaigns: [
        { name: 'Myntra Fashion', budget: '₹2.1L', revenue: '₹8.4L', txns: 9800, roas: '13.8:1' },
        { name: 'Zepto Grocery', budget: '₹1.6L', revenue: '₹6.2L', txns: 7400, roas: '11.6:1' },
      ],
    },
    '6M': {
      labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
      stats: [
        { label: 'Total Spend', value: '₹12,50,000', delta: '+62%', up: true },
        { label: 'Revenue Driven', value: '₹68,40,000', delta: '+94%', up: true },
        { label: 'Transactions', value: '51,280', delta: '+78%', up: true },
        { label: 'Avg. ROAS', value: '₹16:1', delta: '+34%', up: true },
      ],
      charts: [
        { title: 'Transactions', vals: [3200, 3800, 4500, 5200, 6800, 7400], color: 'rgba(52,211,153,', fmt: (v: number) => v.toLocaleString('en-IN') },
        { title: 'Revenue (₹L)', vals: [22.4, 26.8, 31.2, 38.4, 48.6, 54.2], color: 'rgba(96,165,250,', fmt: (v: number) => `₹${v}L` },
        { title: 'Avg. Order Value', vals: [1920, 2080, 2240, 2480, 2720, 2840], color: 'rgba(167,139,250,', fmt: (v: number) => `₹${v.toLocaleString('en-IN')}` },
      ],
      campaigns: [
        { name: 'Ajio Sale', budget: '₹4.2L', revenue: '₹18.6L', txns: 22400, roas: '15.2:1' },
        { name: 'Blinkit Express', budget: '₹3.1L', revenue: '₹12.8L', txns: 16800, roas: '13.4:1' },
      ],
    },
  } as const;

  const currentData = RANGE_DATA[activeRange];

  function normalizeBars(vals: readonly number[]): number[] {
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    if (max === min) return vals.map(() => 60);
    return [...vals].map(v => 15 + ((v - min) / (max - min)) * 82);
  }

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

            {/* 3-D Interactive Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: '1400px' }}
            >
              <motion.div
                style={{ rotateX: dashRotX, rotateY: dashRotY, transformStyle: 'preserve-3d' }}
                className="relative mx-auto max-w-5xl"
              >
                {/* Single unified card — no floaters escaping bounds */}
                <div className="bg-[#0c0c0c] border border-white/[0.08] rounded-[24px] overflow-hidden shadow-[0_60px_140px_-20px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-clay/[0.03] via-transparent to-blue-500/[0.02] pointer-events-none" />

                  {/* ── Header ── */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05] bg-black/20">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-clay flex items-center justify-center shadow-[0_2px_10px_rgba(52,211,153,0.45)]">
                        <span className="text-black text-[10px] font-black">Y</span>
                      </div>
                      <div>
                        <div className="text-[9px] font-black text-white uppercase tracking-[0.2em] leading-none">Merchant Dashboard</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="w-1 h-1 rounded-full bg-clay animate-pulse" />
                          <span className="text-[6px] text-white/20 uppercase tracking-[0.25em]">Live · Real-time</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 bg-white/[0.03] border border-white/[0.06] rounded-lg p-0.5">
                      {(['7D', '1M', '3M', '6M'] as const).map(r => (
                        <button
                          key={r}
                          onClick={() => { setActiveRange(r); setHoveredBar(null); }}
                          className={`px-2.5 py-1 rounded-md text-[7px] font-black uppercase tracking-wider transition-all duration-200 ${
                            activeRange === r ? 'bg-clay text-black shadow-sm' : 'text-white/25 hover:text-white/55'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Two-column body ── */}
                  <div className="flex min-h-0">

                    {/* Left: main analytics (flex-1) */}
                    <div className="flex-1 p-4 min-w-0">

                      {/* KPI cards with sparklines */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`kpi-${activeRange}`}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className="grid grid-cols-4 gap-2 mb-3"
                        >
                          {currentData.stats.map((s, i) => {
                            const sparkVals = currentData.charts[Math.min(i, 2)].vals;
                            const sparkColors = ['#34d399', '#60a5fa', '#a78bfa', '#f59e0b'];
                            return (
                              <motion.div
                                key={i}
                                whileHover={{ scale: 1.02, borderColor: 'rgba(52,211,153,0.2)' }}
                                className="bg-[#111] border border-white/[0.05] rounded-2xl p-3 cursor-default"
                              >
                                <div className="text-[6px] text-white/20 uppercase tracking-[0.3em] mb-1.5">{s.label}</div>
                                <div className="text-[13px] font-black text-white tracking-tight mb-1.5">{s.value}</div>
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`text-[7px] font-black shrink-0 ${s.up ? 'text-clay' : 'text-red-400'}`}>
                                    {s.up ? '↑' : '↓'} {s.delta}
                                  </span>
                                  <Sparkline vals={sparkVals} color={sparkColors[i]} />
                                </div>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      </AnimatePresence>

                      {/* Interactive bar charts */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`charts-${activeRange}`}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2, delay: 0.05 }}
                          className="grid grid-cols-3 gap-2 mb-3"
                        >
                          {currentData.charts.map((chart, ci) => {
                            const norm = normalizeBars(chart.vals);
                            return (
                              <div key={chart.title} className="bg-[#111] border border-white/[0.05] rounded-2xl p-3 relative">
                                <div className="text-[6px] font-black text-white/25 uppercase tracking-[0.3em] mb-2">{chart.title}</div>
                                <AnimatePresence>
                                  {hoveredBar?.ci === ci && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.85 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.85 }}
                                      className="absolute top-2.5 right-2.5 bg-[#0a0a0a] border border-white/10 rounded-lg px-2 py-1 z-20 pointer-events-none"
                                    >
                                      <div className="text-[5px] text-white/30 uppercase tracking-wider">{currentData.labels[hoveredBar.bi]}</div>
                                      <div className="text-[9px] font-black text-white">{hoveredBar.value}</div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                                <div className="flex items-end gap-0.5 h-12">
                                  {norm.map((pct, bi) => {
                                    const isHov = hoveredBar?.ci === ci && hoveredBar?.bi === bi;
                                    return (
                                      <div
                                        key={bi}
                                        className="flex-1 cursor-crosshair"
                                        style={{ height: `${pct}%` }}
                                        onMouseEnter={() => setHoveredBar({ ci, bi, value: chart.fmt(chart.vals[bi]) })}
                                        onMouseLeave={() => setHoveredBar(null)}
                                      >
                                        <motion.div
                                          key={`${activeRange}-${ci}-${bi}`}
                                          initial={{ scaleY: 0 }}
                                          animate={{ scaleY: 1 }}
                                          transition={{ delay: 0.1 + ci * 0.06 + bi * 0.04, duration: 0.4, ease: 'easeOut' }}
                                          style={{
                                            transformOrigin: 'bottom',
                                            background: isHov
                                              ? `linear-gradient(to top, ${chart.color}0.9), ${chart.color}0.5))`
                                              : `linear-gradient(to top, ${chart.color}0.55), ${chart.color}0.12))`,
                                            borderRadius: '2px 2px 0 0',
                                          }}
                                          className="w-full h-full transition-[background] duration-100"
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="flex justify-between mt-1">
                                  {currentData.labels.map((l, i) => (
                                    <span key={i} className={`text-[5px] transition-colors ${hoveredBar?.ci === ci && hoveredBar?.bi === i ? 'text-white/50' : 'text-white/12'}`}>
                                      {l.slice(0, 3)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </motion.div>
                      </AnimatePresence>

                      {/* Campaign table with ROAS progress bars */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`camp-${activeRange}`}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                          className="bg-[#111] border border-white/[0.05] rounded-2xl p-3"
                        >
                          <div className="text-[6px] font-black text-white/25 uppercase tracking-[0.3em] mb-2">Top Campaigns</div>
                          <div className="grid grid-cols-[1fr_52px_52px_100px] gap-3 mb-1.5 px-1">
                            {['Campaign', 'Budget', 'Revenue', 'ROAS'].map(h => (
                              <div key={h} className="text-[5.5px] text-white/15 uppercase tracking-wider font-black">{h}</div>
                            ))}
                          </div>
                          {currentData.campaigns.map((c, i) => {
                            const roasPct = Math.min((parseFloat(c.roas) / 20) * 100, 100);
                            return (
                              <motion.div
                                key={i}
                                whileHover={{ backgroundColor: 'rgba(255,255,255,0.025)' }}
                                className="grid grid-cols-[1fr_52px_52px_100px] gap-3 items-center py-2 px-1 rounded-xl border-t border-white/[0.04] first:border-0"
                              >
                                <div className="text-[8px] font-black text-white/65 truncate">{c.name}</div>
                                <div className="text-[8px] font-black text-white/35">{c.budget}</div>
                                <div className="text-[8px] font-black text-white">{c.revenue}</div>
                                <div className="flex items-center gap-1.5">
                                  <div className="flex-1 h-0.5 bg-white/[0.07] rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${roasPct}%` }}
                                      transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                                      className="h-full bg-clay rounded-full"
                                    />
                                  </div>
                                  <span className="text-[7px] font-black text-clay shrink-0">{c.roas}</span>
                                </div>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Right: fixed sidebar — no floating */}
                    <div className="w-[168px] shrink-0 border-l border-white/[0.05] p-3.5 flex flex-col gap-4 bg-black/10">

                      {/* Live Activity */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-2.5">
                          <div className="w-1 h-1 rounded-full bg-clay animate-pulse" />
                          <div className="text-[6px] font-black text-white/20 uppercase tracking-[0.3em]">Live Activity</div>
                        </div>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={liveIdx}
                            initial={{ opacity: 0, x: 6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -6 }}
                            transition={{ duration: 0.22 }}
                            className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-2.5 mb-2.5"
                          >
                            <div className="flex items-start justify-between mb-0.5">
                              <div className="text-[9px] font-black text-white">{LIVE_EVENTS[liveIdx].brand}</div>
                              <div className="text-[6px] text-white/15 shrink-0">{LIVE_EVENTS[liveIdx].time}</div>
                            </div>
                            <div className="text-[6px] text-white/25 mb-1.5">{LIVE_EVENTS[liveIdx].action}</div>
                            <div className="text-[12px] font-black text-clay">{LIVE_EVENTS[liveIdx].amount}</div>
                          </motion.div>
                        </AnimatePresence>
                        <div className="space-y-1">
                          {['Goldback · 16% ROI', 'Smart Checkout', 'Credit Data · LSP'].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 py-1 border-b border-white/[0.04] last:border-0">
                              <div className="w-1 h-1 rounded-full bg-clay/50 shrink-0" />
                              <span className="text-[7px] text-white/28">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="h-px bg-white/[0.05]" />

                      {/* Brand Share */}
                      <div>
                        <div className="text-[6px] font-black text-white/20 uppercase tracking-[0.3em] mb-2.5">Brand Share</div>
                        <div className="space-y-2.5">
                          {[
                            { label: 'Amazon', pct: 78, color: '#34d399' },
                            { label: 'Nykaa', pct: 52, color: '#60a5fa' },
                            { label: 'Zepto', pct: 38, color: '#a78bfa' },
                            { label: 'Myntra', pct: 24, color: '#f59e0b' },
                          ].map((b, i) => (
                            <div key={i}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[7px] text-white/40 font-bold">{b.label}</span>
                                <span className="text-[7px] text-white/20">{b.pct}%</span>
                              </div>
                              <div className="h-0.5 bg-white/[0.06] rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${b.pct}%` }}
                                  transition={{ delay: 1.2 + i * 0.12, duration: 0.75, ease: 'easeOut' }}
                                  className="h-full rounded-full"
                                  style={{ background: b.color }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-white/[0.05]">
                          <div className="text-[7px] font-black text-clay">₹4.2L total driven</div>
                          <div className="text-[6px] text-white/15 mt-0.5">This {activeRange}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            BRAND LOGO MARQUEE — CIRCULAR LOGO WALL
        ═══════════════════════════════════════════════════════════ */}
        <section className="py-12 border-y border-white/[0.05] overflow-hidden">
          {/* Row 1 — forward */}
          <div className="flex overflow-hidden mb-3">
            <div className="fwd-marquee items-center" style={{ gap: 12 }}>
              {[...BRAND_ROW1, ...BRAND_ROW1].map((b, i) => (
                <div key={i} className="logo-circle">
                  <img src={b.src} alt={b.alt} />
                </div>
              ))}
            </div>
          </div>
          {/* Row 2 — reverse */}
          <div className="flex overflow-hidden mb-16">
            <div className="rev-marquee items-center" style={{ gap: 12 }}>
              {[...BRAND_ROW2, ...BRAND_ROW2].map((b, i) => (
                <div key={i} className="logo-circle">
                  <img src={b.src} alt={b.alt} />
                </div>
              ))}
            </div>
          </div>

          {/* Center headline */}
          <div className="text-center px-6 py-10">
            <p className="text-4xl md:text-5xl lg:text-6xl font-sans font-extrabold text-white leading-tight tracking-tight">
              Partnered with Over{' '}
              <em className="not-italic font-light" style={{ fontFamily: 'Instrument Serif, Georgia, serif', color: '#34d399', fontStyle: 'italic' }}>
                700+ Brands
              </em>
            </p>
            <p className="text-4xl md:text-5xl lg:text-6xl font-sans font-extrabold text-white leading-tight tracking-tight mt-1">
              We are not stopping anytime soon
            </p>
          </div>

          {/* Row 3 — forward (slower) */}
          <div className="flex overflow-hidden mt-16 mb-3">
            <div className="fwd-marquee-b items-center" style={{ gap: 12 }}>
              {[...LOGO_ROW3, ...LOGO_ROW3].map((b, i) => (
                <div key={i} className="logo-circle">
                  <img src={b.src} alt={b.alt} />
                </div>
              ))}
            </div>
          </div>
          {/* Row 4 — reverse (slower) */}
          <div className="flex overflow-hidden">
            <div className="rev-marquee-b items-center" style={{ gap: 12 }}>
              {[...LOGO_ROW4, ...LOGO_ROW4].map((b, i) => (
                <div key={i} className="logo-circle">
                  <img src={b.src} alt={b.alt} />
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
                Explore how Yureka helps D2C brands capture new high-value customers for life.
              </p>
            </motion.div>

            <div className="mt-10">
              {/* D2C Card — full width */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <TiltCard
                  intensity={4}
                  className="relative border border-clay/15 rounded-[2.5rem] p-10 overflow-hidden bg-[#0b1a10] hover:border-clay/30 transition-colors duration-500"
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
                    <div className="flex flex-wrap mb-8" style={{ gap: 5 }}>
                      {D2C_BRANDS.map((b, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.08 }}
                          className="border border-white/[0.1] rounded-lg overflow-hidden shrink-0"
                          style={{ width: 36, height: 36 }}
                        >
                          <img src={b.src} alt={b.alt} className="w-full h-full object-cover block" />
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
        <section ref={howItWorksRef} className="py-32 px-6 border-t border-white/[0.05] relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-clay mb-4">The Partnership Loop</p>
              <h2 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-white">How it works.</h2>
              {/* Scroll progress indicator */}
              <div className="flex items-center justify-center gap-3 mt-8">
                {STEPS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveStep(i);
                      stepRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="flex items-center gap-2 group"
                  >
                    <motion.div
                      animate={{
                        width: activeStep === i ? 32 : 6,
                        backgroundColor: activeStep === i ? '#34d399' : i < activeStep ? 'rgba(52,211,153,0.35)' : 'rgba(255,255,255,0.1)',
                      }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="h-1.5 rounded-full"
                    />
                    <span className={`text-[7px] font-black uppercase tracking-widest transition-all duration-300 hidden sm:block ${activeStep === i ? 'text-clay' : 'text-white/15 group-hover:text-white/30'}`}>
                      {s.n}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="relative">
              {/* Static track */}
              <div className="absolute left-[31px] top-0 bottom-0 w-px bg-white/[0.05] hidden md:block" />
              {/* Animated clay fill — advances with active step */}
              <motion.div
                className="absolute left-[31px] top-0 w-px bg-gradient-to-b from-clay via-clay/60 to-clay/20 hidden md:block origin-top"
                animate={{ height: `${((activeStep + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />

              <div className="space-y-0">
                {STEPS.map((s, i) => {
                  const isActive = activeStep === i;
                  const isPast = i < activeStep;
                  return (
                    <motion.div
                      key={s.n}
                      ref={(el) => { stepRefs.current[i] = el as HTMLDivElement | null; }}
                      initial={{ opacity: 0, x: -24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => setActiveStep(i)}
                      className="relative flex gap-6 py-16 border-b border-white/[0.04] last:border-0 cursor-pointer select-none min-h-[48vh] items-start"
                    >
                      {/* Active step background highlight */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            layoutId="stepHighlight"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-x-0 inset-y-2 rounded-2xl bg-clay/[0.04] border border-clay/[0.08] pointer-events-none"
                          />
                        )}
                      </AnimatePresence>

                      {/* Step icon circle */}
                      <div className="relative shrink-0 hidden md:flex z-10 ml-0">
                        <motion.div
                          animate={{
                            borderColor: isActive
                              ? 'rgba(52,211,153,0.45)'
                              : isPast
                              ? 'rgba(52,211,153,0.15)'
                              : 'rgba(255,255,255,0.07)',
                            boxShadow: isActive ? '0 0 24px rgba(52,211,153,0.18)' : 'none',
                          }}
                          transition={{ duration: 0.4 }}
                          className="w-16 h-16 rounded-full bg-[#0a0a0a] border flex items-center justify-center"
                        >
                          <s.icon
                            size={20}
                            className={`transition-colors duration-400 ${isActive ? 'text-clay' : isPast ? 'text-clay/40' : 'text-white/15'}`}
                          />
                        </motion.div>
                        {isPast && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-clay flex items-center justify-center"
                          >
                            <svg width="10" height="10" viewBox="0 0 10 10">
                              <path d="M2 5l2 2 4-4" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </svg>
                          </motion.div>
                        )}
                      </div>

                      {/* Content + visual row */}
                      <div className="flex-1 flex gap-6 z-10 min-w-0 pr-2">

                        {/* Left: text content */}
                        <div className="flex-1 min-w-0">
                          {/* Title row */}
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className={`text-[8px] font-black uppercase tracking-[0.4em] transition-colors duration-300 ${isActive ? 'text-clay' : 'text-clay/35'}`}>{s.n}</span>
                            <h3 className={`text-xl md:text-2xl font-sans font-extrabold uppercase tracking-tight transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/50'}`}>
                              {s.title}
                            </h3>
                            <span className={`text-[7px] font-black px-2.5 py-1 rounded-full border ${s.badgeColor} transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                              {s.badge}
                            </span>
                          </div>

                          {/* Desc — always visible */}
                          <p className={`text-sm leading-relaxed font-serif mb-0 transition-colors duration-300 ${isActive ? 'text-white/45' : 'text-white/20'}`}>
                            {s.desc}
                          </p>

                          {/* Expanded content — always mounted, revealed by scroll */}
                          <motion.div
                            initial={false}
                            animate={{
                              maxHeight: isActive ? 400 : 0,
                              opacity: isActive ? 1 : 0,
                            }}
                            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            style={{ overflow: 'hidden' }}
                          >
                            <p className="text-white/25 text-xs leading-relaxed mt-3 mb-4 font-sans">{s.detail}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                              {s.bullets.map((b, bi) => (
                                <motion.div
                                  key={bi}
                                  initial={false}
                                  animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -6 }}
                                  transition={{ delay: isActive ? bi * 0.07 : 0, duration: 0.3 }}
                                  className="flex items-start gap-2"
                                >
                                  <div className="w-1 h-1 rounded-full bg-clay mt-1.5 shrink-0" />
                                  <span className="text-[10px] text-white/40 leading-relaxed">{b}</span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        </div>

                        {/* Right: step-specific visual widget — always mounted, fades in/out */}
                        <motion.div
                          initial={false}
                          animate={{
                            opacity: isActive ? 1 : 0,
                            x: isActive ? 0 : 14,
                            scale: isActive ? 1 : 0.95,
                          }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="w-52 shrink-0 hidden lg:flex flex-col"
                          style={{ pointerEvents: isActive ? 'auto' : 'none' }}
                        >
                          {/* key changes on activation → remounts inner motion elements so animations replay */}
                          <div key={isActive ? `w${i}-on` : `w${i}-off`}>

                            {/* 01 — API code snippet */}
                            {i === 0 && (
                              <div className="bg-[#080808] border border-white/[0.07] rounded-xl p-3.5 font-mono text-[8px]">
                                <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-white/[0.05]">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
                                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/40" />
                                  <div className="w-1.5 h-1.5 rounded-full bg-clay/40" />
                                  <span className="text-white/15 text-[7px] ml-1">api_connect.ts</span>
                                </div>
                                <div className="text-white/30 leading-relaxed">
                                  <span className="text-blue-400">POST</span> /api/v1/partner<br />
                                  <span className="text-white/15">Auth: Bearer </span><span className="text-clay/60">sk_live_***</span>
                                </div>
                                <div className="mt-2 text-[7px] text-white/20 leading-loose pl-2 border-l border-white/[0.05]">
                                  <span className="text-white/20">{'{'}</span><br />
                                  <span className="text-purple-400/80">&nbsp;"brand_id"</span>: <span className="text-green-400/80">"amazon_in"</span>,<br />
                                  <span className="text-purple-400/80">&nbsp;"webhook"</span>: <span className="text-green-400/80">"https://..."</span><br />
                                  <span className="text-white/20">{'}'}</span>
                                </div>
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.5 }}
                                  className="mt-2.5 flex items-center gap-2 pt-2 border-t border-white/[0.05]"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse" />
                                  <span className="text-[8px] font-black text-clay">200 OK · Connected</span>
                                </motion.div>
                              </div>
                            )}

                            {/* 02 — Audience segments */}
                            {i === 1 && (
                              <div className="bg-[#080808] border border-white/[0.07] rounded-xl p-3.5">
                                <div className="text-[6px] font-black text-white/20 uppercase tracking-[0.3em] mb-3">AI Audience Segments</div>
                                {[
                                  { label: 'Fashion & Lifestyle', pct: 32 },
                                  { label: 'Tech Buyers', pct: 28 },
                                  { label: 'Food & Dining', pct: 22 },
                                  { label: 'Travel & Experiences', pct: 18 },
                                ].map((seg, j) => (
                                  <div key={j} className="mb-2.5">
                                    <div className="flex justify-between mb-1">
                                      <span className="text-[7px] text-white/30">{seg.label}</span>
                                      <span className="text-[7px] font-black text-blue-400">{seg.pct}%</span>
                                    </div>
                                    <div className="h-0.5 bg-white/[0.05] rounded-full overflow-hidden">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${seg.pct}%` }}
                                        transition={{ delay: j * 0.1 + 0.15, duration: 0.65, ease: 'easeOut' }}
                                        className="h-full bg-blue-400 rounded-full"
                                      />
                                    </div>
                                  </div>
                                ))}
                                <div className="mt-1 pt-2 border-t border-white/[0.05]">
                                  <span className="text-[6px] text-white/15">Intent score refreshes every 30s</span>
                                </div>
                              </div>
                            )}

                            {/* 03 — Checkout funnel */}
                            {i === 2 && (
                              <div className="bg-[#080808] border border-white/[0.07] rounded-xl p-3.5">
                                <div className="text-[6px] font-black text-white/20 uppercase tracking-[0.3em] mb-3">Smart Checkout Funnel</div>
                                {[
                                  { label: 'All Visitors', pct: 100, color: 'bg-white/20' },
                                  { label: 'High Intent', pct: 88, color: 'bg-yellow-400/50' },
                                  { label: 'Checkout', pct: 72, color: 'bg-blue-400/50' },
                                  { label: 'Converted (Prepaid)', pct: 94, color: 'bg-clay' },
                                ].map((f, j) => (
                                  <div key={j} className="mb-2">
                                    <div className="flex justify-between mb-0.5">
                                      <span className="text-[7px] text-white/25">{f.label}</span>
                                      <span className={`text-[7px] font-black ${j === 3 ? 'text-clay' : 'text-white/25'}`}>{f.pct}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/[0.04] rounded-sm overflow-hidden">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${f.pct}%` }}
                                        transition={{ delay: j * 0.1 + 0.15, duration: 0.6, ease: 'easeOut' }}
                                        className={`h-full rounded-sm ${f.color}`}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* 04 — Compound growth curve */}
                            {i === 3 && (
                              <div className="bg-[#080808] border border-white/[0.07] rounded-xl p-3.5">
                                <div className="text-[6px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Goldback Flywheel</div>
                                <div className="relative h-20">
                                  <svg viewBox="0 0 200 64" className="w-full h-full overflow-visible">
                                    <defs>
                                      <linearGradient id="flywheelGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
                                      </linearGradient>
                                    </defs>
                                    <path d="M5 60 Q30 56 60 48 Q90 38 120 24 Q155 10 195 3 L195 64 L5 64 Z" fill="url(#flywheelGrad)" />
                                    <motion.path
                                      d="M5 60 Q30 56 60 48 Q90 38 120 24 Q155 10 195 3"
                                      stroke="#a78bfa" strokeWidth="1.5" fill="none"
                                      initial={{ pathLength: 0, opacity: 0 }}
                                      animate={{ pathLength: 1, opacity: 1 }}
                                      transition={{ duration: 1.1, ease: 'easeOut' }}
                                    />
                                    {([5, 60, 120, 195] as const).map((cx, j) => {
                                      const cy = [60, 48, 24, 3][j];
                                      return (
                                        <motion.circle
                                          key={j} cx={cx} cy={cy} r="2.5" fill="#a78bfa"
                                          initial={{ scale: 0, opacity: 0 }}
                                          animate={{ scale: 1, opacity: 1 }}
                                          transition={{ delay: 0.25 + j * 0.22, duration: 0.3 }}
                                        />
                                      );
                                    })}
                                  </svg>
                                </div>
                                <div className="flex justify-between mt-1">
                                  {['M1', 'M3', 'M6', 'M12'].map(m => (
                                    <span key={m} className="text-[6px] text-white/15">{m}</span>
                                  ))}
                                </div>
                                <div className="mt-2 pt-2 border-t border-white/[0.05] flex items-center gap-2">
                                  <div className="w-1 h-1 rounded-full bg-purple-400" />
                                  <span className="text-[7px] text-white/20">Each cycle improves the next</span>
                                </div>
                              </div>
                            )}

                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Step progress indicator dots */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveStep(i);
                      stepRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className={`rounded-full transition-all duration-400 ${activeStep === i ? 'w-6 h-1.5 bg-clay' : 'w-1.5 h-1.5 bg-white/15 hover:bg-white/30'}`}
                  />
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
