import React from 'react';
import { ArrowRight } from 'lucide-react';

const HaloInfoSection: React.FC = () => {
  return (
    <section className="bg-[#0a0a0a] px-6 py-24 w-full border-t border-white/10">

      {/* Row 1: heading + intro text */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-start">
        {/* Left */}
        <div>
          <h2
            className="text-white text-4xl md:text-5xl font-bold leading-tight mb-8"
            style={{ letterSpacing: '-0.03em' }}
          >
            Meet Yureka.
          </h2>

          {/* "Discover it" pill button */}
          <button className="inline-flex items-center gap-3 bg-white text-black text-base font-medium pl-6 pr-1.5 py-1.5 rounded-full hover:bg-zinc-100 transition-colors duration-200">
            <span>Discover it</span>
            <span className="bg-black rounded-full p-1.5">
              <ArrowRight className="w-4 h-4 text-white" />
            </span>
          </button>
        </div>

        {/* Right */}
        <div>
          <p className="text-white/70 text-2xl md:text-3xl leading-relaxed">
            USD Halo is a reward-earning dollar coin that lets your savings grow while remaining tied to the U.S. dollar.
          </p>
        </div>
      </div>

      {/* Row 2: 4-col card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Card 1 — spans 2 cols, background image */}
        <div
          className="lg:col-span-2 rounded-2xl p-7 min-h-80 flex flex-col justify-between"
          style={{
            backgroundImage: `url('https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <h3
            className="text-black text-2xl font-bold leading-snug"
            style={{ letterSpacing: '-0.02em' }}
          >
            Savings that bloom
          </h3>
          <p className="text-black/70 text-base max-w-xs">
            Gain steady returns as your dollar tokens are routed into top-performing DeFi strategies.
          </p>
        </div>

        {/* Card 2 — dark */}
        <div className="bg-surface border border-white/[0.07] rounded-2xl p-7 min-h-80 flex flex-col justify-between">
          <h3
            className="text-white text-2xl font-bold leading-snug"
            style={{ letterSpacing: '-0.02em' }}
          >
            Always fluid,<br />always pegged.
          </h3>
          <p className="text-white/60 text-base">
            Keep fully dollar-anchored with on-demand access to funds — no lockups or waits.
          </p>
        </div>

        {/* Card 3 — dark */}
        <div className="bg-surface border border-white/[0.07] rounded-2xl p-7 min-h-80 flex flex-col justify-between">
          <h3
            className="text-white text-2xl font-bold leading-snug"
            style={{ letterSpacing: '-0.02em' }}
          >
            Fully<br />automated
          </h3>
          <p className="text-white/60 text-base">
            Skip the task of tuning positions yourself. USD Halo runs in the background for you.
          </p>
        </div>

      </div>
    </section>
  );
};

export default HaloInfoSection;
