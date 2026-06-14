import React from 'react';
import { ArrowRight } from 'lucide-react';

const YurekaUseCasesSection: React.FC = () => {
  return (
    <section className="bg-[#0a0a0a] px-6 py-24 w-full border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* Left column — text */}
        <div className="md:pr-12 md:pt-2">
          <p className="font-overpass-mono text-white/60 text-sm mb-2 font-medium tracking-widest uppercase">
            Yureka Money in Practice
          </p>
          <h2
            className="font-cirka text-5xl md:text-6xl font-medium leading-none mb-6 text-white"
            style={{ letterSpacing: '-0.04em' }}
          >
            Use modes
          </h2>
          <p className="font-overpass-mono text-white/60 text-base leading-relaxed max-w-sm">
            Yureka Money powers a wide range of modes for builders, companies and treasuries wanting safe and rewarding stablecoin integrations plus more.
          </p>
        </div>

        {/* Right column — video card */}
        <div className="relative rounded-3xl overflow-hidden min-h-[560px] bg-black">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="object-contain absolute inset-0 w-full h-full"
            src="/assets/bankrewards.mp4"
          />
        </div>

      </div>
    </section>
  );
};

export default YurekaUseCasesSection;
