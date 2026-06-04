import React from 'react';
import { ArrowRight } from 'lucide-react';

const HaloUseCasesSection: React.FC = () => {
  return (
    <section className="bg-[#0a0a0a] px-6 py-24 w-full border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        {/* Left column — text */}
        <div className="md:pr-12 md:pt-2">
          <p className="text-white/60 text-sm mb-2 font-medium tracking-widest uppercase">
            USD Halo in Practice
          </p>
          <h2
            className="text-5xl md:text-6xl font-medium leading-none mb-6 text-white"
            style={{ letterSpacing: '-0.04em' }}
          >
            Use modes
          </h2>
          <p className="text-white/60 text-base leading-relaxed max-w-sm">
            USD Halo powers a wide range of modes for builders, companies and treasuries wanting safe and rewarding stablecoin integrations plus more.
          </p>
        </div>

        {/* Right column — video card */}
        <div className="relative rounded-3xl overflow-hidden min-h-[560px] flex flex-col justify-end">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="object-cover absolute inset-0 w-full h-full"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_183428_ab5e672a-f608-4dcb-b319-f3e040f02e2d.mp4"
          />

          {/* Gradient overlay so text is legible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 p-8 md:p-10 flex flex-col items-start">
            <h3
              className="text-4xl md:text-5xl font-medium leading-tight mb-5 text-white"
              style={{ letterSpacing: '-0.03em' }}
            >
              Commerce
            </h3>
            <p className="text-white/70 text-base max-w-md mb-8 leading-relaxed">
              Lift customer retention by offering USD Halo, a trusted dollar-backed stablecoin with strong yields, letting your patrons earn with zero effort on your platform.
            </p>

            <a
              href="#"
              className="group inline-flex items-center gap-3 text-white font-medium hover:text-white/80 transition-colors duration-200"
            >
              <span className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/25 transition-colors duration-200 border border-white/10 shadow-sm">
                <ArrowRight className="w-4 h-4 text-white" />
              </span>
              <span>Know more</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HaloUseCasesSection;
