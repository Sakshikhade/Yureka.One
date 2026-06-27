import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useSupabase } from './SupabaseProvider';

// ─── UTILITIES ──────────────────────────────────────────────────────────────

/**
 * Inner content constraint: keeps content within "columns 2–4" of a 5-col grid.
 * Columns 1 and 5 (each 10% of viewport) stay empty.
 * On mobile, full width with comfortable side padding.
 */
const ColContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-full px-6 sm:px-[10%] lg:px-[20%] ${className}`}>
    {children}
  </div>
);

// ─── REUSABLE COMPONENTS ────────────────────────────────────────────────────

/** Mouse-following magnetic hover wrapper */
interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('translate3d(0px,0px,0px)');
  const [transition, setTransition] = useState(inactiveTransition);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const isNear =
        e.clientX >= r.left - padding && e.clientX <= r.right + padding &&
        e.clientY >= r.top - padding && e.clientY <= r.bottom + padding;
      if (isNear) {
        setTransition(activeTransition);
        setTransform(`translate3d(${(e.clientX - cx) / strength}px,${(e.clientY - cy) / strength}px,0px)`);
      } else {
        setTransition(inactiveTransition);
        setTransform('translate3d(0px,0px,0px)');
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [padding, strength, activeTransition, inactiveTransition]);

  return (
    <div ref={ref} className={className} style={{ transform, transition, willChange: 'transform' }}>
      {children}
    </div>
  );
};

/** Framer Motion fade-in on viewport enter */
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: any;
  className?: string;
}

const FadeIn: React.FC<FadeInProps> = ({
  children, delay = 0, duration = 0.7, x = 0, y = 30, as = 'div', className = '',
}) => {
  const Comp = (motion as any)[as] || motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </Comp>
  );
};

interface AnimatedCharProps {
  ch: string;
  scrollYProgress: MotionValue<number>;
  start: number;
  end: number;
}

const AnimatedChar: React.FC<AnimatedCharProps> = ({ ch, scrollYProgress, start, end }) => {
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);
  return (
    <span className="relative inline-block">
      <span className="opacity-0">{ch}</span>
      <motion.span style={{ opacity }} className="absolute inset-0">{ch}</motion.span>
    </span>
  );
};

/** Character-by-character scroll-driven opacity reveal */
const AnimatedText: React.FC<{ text: string }> = ({ text }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] });
  const words = text.split(' ');
  let ci = 0;
  const total = text.length;

  return (
    <p
      ref={ref}
      className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px] select-text"
      style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
    >
      {words.map((word, wi) => {
        const chars = word.split('');
        return (
          <span key={wi} className="inline-block whitespace-nowrap mr-[0.25em]">
            {chars.map((ch) => {
              const idx = ci++;
              const start = idx / total;
              const end = Math.min(1, start + 0.08);
              return (
                <AnimatedChar
                  key={idx}
                  ch={ch}
                  scrollYProgress={scrollYProgress}
                  start={start}
                  end={end}
                />
              );
            })}
          </span>
        );
      })}
    </p>
  );
};

/** Pill gradient CTA button */
const ContactButton: React.FC = () => (
  <button
    className="rounded-full text-white font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base cursor-pointer hover:scale-[1.03] transition-transform duration-200 focus:outline-none"
    style={{
      background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
      boxShadow: '0px 4px 4px rgba(181,1,167,0.25), inset 4px 4px 12px #7721B1',
      outline: '2px solid white',
      outlineOffset: '-3px',
    }}
  >
    Contact Us
  </button>
);

/** Ghost outline pill button */
const LiveProjectButton: React.FC<{ label?: string }> = ({ label = 'Live Project' }) => (
  <button className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm hover:bg-[#D7E2EA]/10 transition-colors duration-200 cursor-pointer focus:outline-none whitespace-nowrap flex-shrink-0">
    {label}
  </button>
);

// ─── SECTION 1: HERO ────────────────────────────────────────────────────────

// HeroSection has been removed per user request.

// ─── SECTION 2: MARQUEE ─────────────────────────────────────────────────────

const fallbackCardImages = [
  'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards-transparent/axis-bank-magnus-burgundy.png',
  'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards-transparent/axis-bank-supermoney-rupay.png',
  'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards-transparent/idfc-first-bank-first-private-metal.png',
  'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards-transparent/hsbc-travelone.png',
  'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards-transparent/icici-bank-sapphiro.png',
  'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards-transparent/kotak-mahindra-bank-kotak-solitaire.png',
  'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards-transparent/sbm-bank-sbm-lifestyle.png',
  'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards-transparent/icici-bank-times-black.png',
  'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards-transparent/hdfc-bank-swiggy-hdfc-bank.png',
  'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards-transparent/hdfc-bank-swiggy-blck-hdfc-bank.png',
  'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards-transparent/kotak-mahindra-bank-shoppers-stop-kotak.png',
  'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards-transparent/sbi-card-sbi-aurum.png',
  'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards-transparent/rbl-bank-world-safari-lite.png',
  'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards-transparent/kotak-mahindra-bank-kotak-air-credit-card.png',
  'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards-transparent/hsbc-hsbc-premier-metal.png',
  'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards-transparent/icici-bank-emeralde-private-metal.png',
  'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards-transparent/kiwi-sbm-bank-kiwi-upi-credit-card.png',
  'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards-transparent/hdfc-bank-marriott-bonvoy-hdfc.png',
  'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards-transparent/hdfc-infinia-metal.png',
  'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards-transparent/hdfc-bank-diners-club-black-metal.png',
  'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards-transparent/indusind-bank-cred-sovereign.png'
];

const MarqueeSection: React.FC = () => {
  const { cards } = useSupabase();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;
    const update = () => {
      rafId = null;
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setOffset((window.innerHeight - rect.top) * 0.3);
    };
    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Filter cards to find valid image URLs
  const cardImages = cards && cards.length > 0
    ? cards.map(c => c.image).filter(url => url && url.trim() !== '')
    : [];

  const displayImages = cardImages.length > 0 ? cardImages : fallbackCardImages;

  // Split images into two rows
  const half = Math.ceil(displayImages.length / 2);
  const row1 = displayImages.slice(0, half);
  const row2 = displayImages.slice(half);

  // Function to ensure rows are long enough to loop seamlessly
  const buildMarqueeRow = (images: string[]) => {
    if (images.length === 0) return [];
    let row = [...images];
    while (row.length < 12) {
      row = [...row, ...images];
    }
    return row;
  };

  const r1 = buildMarqueeRow(row1);
  const r2 = buildMarqueeRow(row2.length > 0 ? row2 : row1);

  return (
    <section ref={sectionRef} className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden w-full">
      <div className="flex flex-col gap-3">
        <div
          className="flex gap-3"
          style={{ transform: `translate3d(${offset - 200}px,0px,0px)`, willChange: 'transform', transition: 'transform 75ms ease-out' }}
        >
          {r1.map((url, i) => (
            <div 
              key={`r1-${i}`} 
              className="w-[260px] h-[167px] sm:w-[360px] sm:h-[232px] md:w-[420px] md:h-[270px] rounded-2xl bg-white/[0.02] border border-white/[0.05] p-3 sm:p-4 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-2xl backdrop-blur-sm hover:scale-[1.03] transition-all duration-300"
            >
              <img 
                src={url} 
                alt="" 
                loading="lazy"
                className="w-full h-full object-contain rounded-xl drop-shadow-xl"
              />
            </div>
          ))}
        </div>
        <div
          className="flex gap-3"
          style={{ transform: `translate3d(${-(offset - 200)}px,0px,0px)`, willChange: 'transform', transition: 'transform 75ms ease-out' }}
        >
          {r2.map((url, i) => (
            <div 
              key={`r2-${i}`} 
              className="w-[260px] h-[167px] sm:w-[360px] sm:h-[232px] md:w-[420px] md:h-[270px] rounded-2xl bg-white/[0.02] border border-white/[0.05] p-3 sm:p-4 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-2xl backdrop-blur-sm hover:scale-[1.03] transition-all duration-300"
            >
              <img 
                src={url} 
                alt="" 
                loading="lazy"
                className="w-full h-full object-contain rounded-xl drop-shadow-xl"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── SECTION 3: ABOUT ───────────────────────────────────────────────────────

const AboutSection: React.FC = () => (
  <section className="relative min-h-screen bg-[#0C0C0C] text-[#D7E2EA] flex flex-col items-center justify-center py-20 overflow-hidden">
    {/* Decorative corner icons — hidden on mobile to avoid overlap */}
    <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="hidden md:block absolute top-[4%] left-[2%] z-10 pointer-events-none">
      <img src="/assets/about-icon-cash-check.png" loading="lazy"
        alt="" className="w-[120px] md:w-[170px] object-contain select-none" />
    </FadeIn>
    <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="hidden md:block absolute bottom-[8%] left-[4%] z-10 pointer-events-none">
      <img src="/assets/about-icon-shopping-bag.png" loading="lazy"
        alt="" className="w-[100px] md:w-[150px] object-contain select-none" />
    </FadeIn>
    <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="hidden md:block absolute top-[4%] right-[2%] z-10 pointer-events-none">
      <img src="/assets/about-icon-location-map.png" loading="lazy"
        alt="" className="w-[120px] md:w-[170px] object-contain select-none" />
    </FadeIn>
    <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="hidden md:block absolute bottom-[8%] right-[4%] z-10 pointer-events-none">
      <img src="/assets/about-icon-crystal-cube.png" loading="lazy"
        alt="" className="w-[110px] md:w-[160px] object-contain select-none" />
    </FadeIn>

    {/* Content — constrained to columns 2-4 */}
    <ColContent className="flex flex-col items-center text-center z-20 gap-10 sm:gap-14 md:gap-16">
      <FadeIn delay={0} y={40} className="w-full">
        <h2 className="font-black uppercase leading-none tracking-tight text-center"
          style={{ fontSize: 'clamp(3rem, 10vw, 120px)' }}>
          <span className="hero-heading">About</span> <span className="text-white">Yureka</span>
        </h2>
      </FadeIn>

      <AnimatedText text="With a relentless focus on systemic reward maximization and elite digital assets, we build the bridges that connect everyday transactions with high-performance yield. Let's work together to optimize your wealth. Spend on Yureka Brands, pay using anything — any credit card / UPI / BNPL, earn assured rewards as well as Cash/Gold back on every purchase that you do at Yureka Partner Brands — it's a promise." />

      <div className="mt-6 sm:mt-10 md:mt-14">
        <FadeIn delay={0.2} y={30}>
          <ContactButton />
        </FadeIn>
      </div>
    </ColContent>
  </section>
);

// ─── SECTION 5: PROJECTS ────────────────────────────────────────────────────

const projects = [
  {
    num: '01', name: 'Join Waitlist - We approve 1000 Users every week.', category: '', liveLabel: 'Join Waitlist',
    images: {
      c1a: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      c1b: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      c2:  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
    },
  },
  {
    num: '02', name: 'Get the Exclusive YU Pass', category: '', liveLabel: 'Check Benefits of YU Pass',
    images: {
      c1a: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
      c1b: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
      c2:  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
    },
  },
  {
    num: '03', name: 'Yureka Ecosystem', category: '', liveLabel: 'Explore Ecosystem',
    images: {
      c1a: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
      c1b: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
      c2:  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
    },
  },
  {
    num: '04', name: 'Invite your Friends, Relatives, Partners', category: 'Refer', liveLabel: 'Invite Now',
    images: {
      c1a: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      c1b: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      c2:  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
    },
  },
];

interface ProjectCardProps {
  project: typeof projects[0];
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  total: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, scrollYProgress, total }) => {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [index / total, (index + 1) / total], [1, targetScale]);

  return (
    <div
      className="w-full h-[85vh] flex justify-center items-start sticky"
      style={{ top: `${96 + index * 28}px`, zIndex: 10 + index }}
    >
      <motion.div
        style={{ scale }}
        className="w-full h-full bg-[#0C0C0C] border-2 border-[#D7E2EA] rounded-[32px] sm:rounded-[44px] md:rounded-[56px] p-4 sm:p-6 md:p-8 flex flex-col gap-4 md:gap-6 overflow-hidden"
      >
        {/* Top row */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-end gap-3 sm:gap-5 flex-wrap">
            <span
              className="font-black text-white/25 leading-none select-none"
              style={{ fontSize: 'clamp(2rem, 6vw, 7rem)' }}
            >
              {project.num}
            </span>
            <div className="flex flex-col pb-1">
              {project.category && (
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#D7E2EA]/50 font-light">
                  {project.category}
                </span>
              )}
              <h3 className="text-[#D7E2EA] font-bold uppercase leading-none tracking-tight"
                style={{ fontSize: 'clamp(1rem, 2.5vw, 2.2rem)' }}>
                {project.name}
              </h3>
            </div>
          </div>
          <LiveProjectButton label={project.liveLabel} />
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-5 gap-3 flex-grow min-h-0">
          {/* Left col — 40% = 2/5 */}
          <div className="col-span-2 flex flex-col gap-3 min-h-0">
            <div className="rounded-[24px] sm:rounded-[36px] md:rounded-[44px] overflow-hidden flex-shrink-0"
              style={{ height: 'clamp(100px, 15vw, 220px)' }}>
              <img src={project.images.c1a} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-[24px] sm:rounded-[36px] md:rounded-[44px] overflow-hidden flex-grow min-h-0">
              <img src={project.images.c1b} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          {/* Right col — 60% = 3/5 */}
          <div className="col-span-3 min-h-0">
            <div className="w-full h-full rounded-[24px] sm:rounded-[36px] md:rounded-[44px] overflow-hidden">
              <img src={project.images.c2} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ProjectsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  return (
    <section
      ref={containerRef}
      className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10 pt-20 sm:pt-24 md:pt-32 pb-32 w-full"
    >
      <ColContent className="flex flex-col items-center">
        <h2
          className="font-black uppercase text-center mb-16 sm:mb-20 md:mb-28 tracking-tight leading-none w-fit"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 98px)' }}
        >
          <span className="hero-heading">Saving</span><span className="text-white">Os</span>
        </h2>

        {/* Stacking cards container — uses its own full-bleed height for scroll calculation */}
        <div
          className="w-full relative"
          style={{ height: `${projects.length * 85}vh` }}
        >
          {projects.map((p, i) => (
            <ProjectCard key={p.num} project={p} index={i} scrollYProgress={scrollYProgress} total={projects.length} />
          ))}
        </div>
      </ColContent>
    </section>
  );
};

// ─── MAIN WRAPPER ────────────────────────────────────────────────────────────

const YurekaPortfolio: React.FC = () => (
  <div
    className="w-full bg-[#0C0C0C] text-[#D7E2EA] font-kanit"
    style={{ overflowX: 'clip' }}
  >
    <MarqueeSection />
    <AboutSection />
    <ProjectsSection />
  </div>
);

export default YurekaPortfolio;
