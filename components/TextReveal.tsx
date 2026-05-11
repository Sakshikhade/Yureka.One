import React from 'react';

const TextReveal: React.FC = () => {
  const headerText = 'EDITORIAL • SECTION 01';
  const bodyText =
    'Your credit card dictates your rewards. That is why we scanned 200+ options to find the ones that actually deliver. Cashback on Swiggy, travel lounge access, and rewards that actually matter. Welcome to the financial upgrade you deserve.';

  const words = bodyText.split(' ');

  return (
    <section className="relative bg-cream border-b border-white/10 text-white">
      {/* Background Micro-details */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/p6-mini.png')]" />

      <div className="flex flex-col items-center justify-center px-6 md:px-12 py-16 md:py-24 w-full">
        <div className="w-full border-l border-clay/30 pl-8 md:pl-16 relative">
          {/* Corner Deco */}
          <div className="absolute top-0 left-0 w-8 h-px bg-[#047857]/20" />
          <div className="absolute top-0 left-0 w-px h-8 bg-[#047857]/20" />

          {/* Section label */}
          <div className="mb-10 md:mb-14">
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-[#047857]/30" />
              <h3 className="text-white font-medium text-[10px] uppercase tracking-[0.4em]">
                {headerText}
              </h3>
            </div>
          </div>

          {/* Static fully-visible text */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 md:gap-x-5 md:gap-y-3 leading-[1.1]">
            {words.map((word, i) => (
              <span
                key={i}
                className="font-heading font-medium text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[2.75rem] uppercase tracking-tight text-white"
              >
                {word}
              </span>
            ))}
          </div>

          {/* Sign-off */}
          <div className="mt-12 md:mt-16 pt-8 border-t border-clay/10 inline-block">
            <p className="font-serif italic text-sm text-white/40">
              — The Yureka Research Desk
            </p>
          </div>

          {/* Bottom Deco */}
          <div className="absolute bottom-0 left-0 w-8 h-px bg-[#047857]/20" />
          <div className="absolute bottom-0 left-0 w-px h-8 bg-[#047857]/20" />
        </div>
      </div>
    </section>
  );
};

export default TextReveal;