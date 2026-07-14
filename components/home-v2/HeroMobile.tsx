import { useInView } from './useInView';
import GlassLayer from './GlassLayer';
import JoinWaitlistButton from './JoinWaitlistButton';

// Mobile-only stacked version of the hero cinematic. The desktop experience
// (components/home-v2/HeroCinematic.tsx) is a pinned, scroll-scrubbed,
// horizontally-sliding sequence that does not translate to touch/mobile —
// videos never load and the panels collapse. This renders the exact same
// four panels' content as plain, vertically-stacked, fully responsive
// sections with normally-autoplaying inline videos. Only mounted below the
// `md` breakpoint (see HeroCinematic's isDesktop branch), so desktop is
// completely unaffected.

// The cinematic green video and the phone-rewards demo both show real content
// from the first frame; vault.mp4 is intentionally black for its first ~7s
// (it's built to be scrubbed, not looped), so it's not used on mobile.
const CINEMATIC_VIDEO_URL = '/rewards-desktop-final.mp4';
const REWARDS_VIDEO_URL = '/rewards.mp4';

// Lazily mount each video only once it nears the viewport, then autoplay it
// inline+muted (the combination iOS/Android require for unattended playback).
// The explicit play() on canplay nudges browsers that ignore the autoPlay
// attribute for programmatically-inserted elements.
function LazyVideo({
  src,
  fit = 'cover',
  className = '',
  eager = false,
}: {
  src: string;
  fit?: 'cover' | 'contain';
  className?: string;
  eager?: boolean;
}) {
  // The hero video is always in view on load, so it mounts eagerly rather than
  // waiting on an intersection callback (which can be a beat late). Everything
  // below the fold stays lazy.
  const { ref, inView } = useInView<HTMLDivElement>('500px');
  const show = eager || inView;
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-[#0a0a0a] shadow-2xl shadow-black/40 backdrop-blur-xl ${className}`}
    >
      {show && (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={(e) => {
            const p = e.currentTarget.play();
            if (p) p.catch(() => {});
          }}
          className={`absolute inset-0 h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
        />
      )}
      <GlassLayer />
    </div>
  );
}

export default function HeroMobile() {
  return (
    <div className="w-full bg-black px-5 pb-16 pt-24">
      {/* ---------- 1. Hero ---------- */}
      <section className="relative">
        <div
          className="pointer-events-none absolute inset-0 -z-0"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            opacity: 0.05,
          }}
        />
        <LazyVideo
          src={CINEMATIC_VIDEO_URL}
          eager
          className="relative z-10 mb-8 aspect-[4/3] w-full rounded-2xl border border-white/10"
        />
        <div className="relative z-10 flex flex-col gap-5">
          <h1 className="text-[clamp(44px,13vw,72px)] font-light leading-[0.95] tracking-[-0.03em] text-white">
            Never Buy
            <br />
            BullShit
          </h1>
          <p className="max-w-sm text-[14px] leading-relaxed text-white/60">
            Yureka helps you find the best product at the best price, all with the magic of AI
            that pops-up on top of your favourite shopping app. Yureka gives assured Digital Gold
            Back and Rewards for all your purchases.
            <br />
            Khachinnnggggg💰
          </p>
          <h2 className="text-[clamp(40px,12vw,64px)] font-light leading-[0.95] tracking-[-0.03em] text-white">
            AI
            <br />
            Yureka
          </h2>
        </div>
      </section>

      {/* ---------- 2. Meet Yureka ---------- */}
      <section className="mt-20" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="flex items-baseline gap-2">
          <span
            style={{ fontFamily: '"Playfair Display", serif' }}
            className="text-[28px] italic font-semibold text-[#5fae52]"
          >
            Meet
          </span>
          <span className="text-[28px] font-extrabold text-white">
            Yureka<span className="text-[#5fae52]">.</span>
          </span>
        </div>

        <JoinWaitlistButton className="mt-5" />

        <p className="mt-5 text-[15px] leading-relaxed text-white/90">
          Yureka offers you 360° Rewards and Saving ecosystem where you get more than 700+ brands
          to shop from. Every time you get assured digital gold and reward points. No Extra
          Investment, Earn when you Spend. No Aesterisk, Available round the clock 365 days.
          <br />
          We are bringing MAGIC to REALITY
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <LazyVideo
            src={REWARDS_VIDEO_URL}
            className="min-h-[340px] rounded-2xl border border-white/10"
          />

          {/* Shop Across 700+ Brands */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-[#0a0a0a]/80 p-5">
            <h3 className="text-[18px] font-extrabold uppercase leading-tight text-white">
              Shop Across <span className="text-[#5fae52]">700+</span> Brands
            </h3>
            <div className="relative mt-4 h-44 w-full overflow-hidden rounded-2xl bg-[#141414]">
              <img
                src="/feat-card-gift.png"
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <GlassLayer />
            </div>
            <ul className="mt-3 list-inside list-disc space-y-1 text-[13px] leading-relaxed text-white/60">
              <li>Quick Commerce</li>
              <li>Fashion &amp; Apparel</li>
              <li>Footwear</li>
              <li>Flights &amp; Hotels</li>
              <li>Medicines &amp; Treatments</li>
              <li>Everything that you need in your day to day life</li>
            </ul>
          </div>

          {/* Not Just One Time Saving */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-[#0a0a0a]/80 p-5">
            <h3
              style={{ fontFamily: '"Playfair Display", serif' }}
              className="text-[18px] italic font-semibold leading-tight text-[#5fae52]"
            >
              Not Just One Time Saving Or Cashback Or Reward Points
            </h3>
            <div className="relative mt-4 h-44 w-full overflow-hidden rounded-2xl bg-[#141414]">
              <img
                src="/card-calendar.png"
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <GlassLayer />
            </div>
            <ul className="mt-3 list-inside list-disc space-y-1 text-[13px] leading-relaxed text-white/60">
              <li>24 Hours a Day</li>
              <li>7 Days a Week</li>
              <li>365 Days a Year</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- 3. We Hate Gatekeeping ---------- */}
      <section className="mt-20" style={{ fontFamily: 'Inter, sans-serif' }}>
        <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-white">
          Yureka is your new age Ai backed SavingOs
        </p>
        <h2 className="mt-4 text-[40px] font-extrabold leading-[1.05] text-white">
          We Hate
          <br />
          <span
            style={{ fontFamily: '"Playfair Display", serif' }}
            className="italic font-semibold text-[#5fae52]"
          >
            Gatekeeping
          </span>
        </h2>
        <p className="mt-6 text-[15px] font-bold leading-relaxed text-white">
          Encash your reward points / Digital gold for new purchases, Gift Cards, Bill Discounts
          or directly to your Bank Account. Absolute zero gatekeeping.
          <br />
          If you are a #Power Shopper then Yureka is for you
        </p>
        <JoinWaitlistButton className="mt-8" />
        <LazyVideo
          src={REWARDS_VIDEO_URL}
          fit="contain"
          className="mt-6 min-h-[300px] rounded-2xl border border-white/10"
        />
      </section>

      {/* ---------- 4. Cinematic Text ---------- */}
      <section className="mt-20">
        <LazyVideo
          src={CINEMATIC_VIDEO_URL}
          className="aspect-video w-full rounded-2xl border border-white/20"
        />
        <p className="mt-6 px-1 text-center font-sans text-[16px] leading-[1.5] tracking-[-0.01em] text-white/90">
          Experience the future of financial intelligence with Yureka, the premier AI-native
          Wealth Operating System built for India's digital economy. Yureka functions as a
          neural-AI interface that bridges the gap between daily consumer behavior and automated
          wealth accumulation. Whether you are seeking to maximize returns through gold-backed
          investments or build a high-fidelity alternative credit profile, Yureka filters out
          digital noise to deliver precision financial insights.
        </p>
      </section>
    </div>
  );
}
