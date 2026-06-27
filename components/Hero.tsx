import React from 'react';
import { ArrowRight } from 'lucide-react';

const heroBrands = [
  { name: 'Stripe' },
  { name: 'Coinbase' },
  { name: 'Uniswap' },
  { name: 'Aave' },
  { name: 'Compound' },
  { name: 'MakerDAO' },
  { name: 'Chainlink' },
];

const Hero: React.FC = () => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes yureka-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .yureka-marquee-track {
          display: flex;
          width: max-content;
          animation: yureka-marquee 22s linear infinite;
        }
      `}} />

      {/* Hero Section — full-viewport-height card within the col-span-3 column */}
      <section
        id="hero"
        className="relative w-full flex flex-col bg-[#0a0a0a] overflow-hidden"
        style={{ minHeight: 'calc(100vh - 8rem)' }}
      >
        {/* Padded inner wrapper: matches prompt's flex-1 px-6 pt-4 pb-6 flex items-end */}
        <div className="flex-1 px-6 pt-4 pb-6 flex items-end">
          {/* Rounded video card */}
          <div
            className="relative w-full rounded-2xl overflow-hidden"
            style={{ height: 'calc(100vh - 10rem)' }}
          >
            {/* Background image — Ben Franklin */}
            <img
              src="/images/hero-bg.jpg"
              alt="Hero background"
              className="absolute inset-0 w-full h-full object-cover object-right-bottom"
            />

            {/* Dark gradient at bottom so text stays readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none z-[5]" />

            {/* Content overlay */}
            <div className="relative z-10 flex flex-col items-start justify-start h-full p-10 pt-20">
              <h1
                className="font-cirka text-black text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight max-w-3xl mb-4"
                style={{ letterSpacing: '-0.04em' }}
              >
                Stop Letting Banks Hold Your Rewards<br />—Earn 15% More with Yureka.
              </h1>

              <p className="font-overpass-mono text-black/70 text-base md:text-2xl font-bold max-w-md mb-8 leading-relaxed">
                Introducing India's 1st SavingsOs
              </p>

              {/* "Join the Waitlist" pill button */}
              <button className="inline-flex items-center gap-3 bg-white text-black text-lg md:text-xl font-medium pl-9 pr-2.5 py-2.5 rounded-full hover:bg-zinc-100 transition-colors duration-200">
                <span>Join the Waitlist</span>
                <span className="bg-black rounded-full p-2.5">
                  <ArrowRight className="w-5 h-5 text-white" />
                </span>
              </button>

            </div>

            {/* Brand Marquee — positioned on the ribbon between both hands, spanning only the middle column (section 3) of the 5-column grid */}
            <div className="absolute left-[calc(45%-28px)] right-[calc(21%-255px)] z-20 overflow-hidden py-[6px]" style={{ top: 'calc(78% + 21px)', maskImage: 'linear-gradient(to left, black 0px, black 179px, transparent 179px, transparent 261px, black 261px, black 100%)', WebkitMaskImage: 'linear-gradient(to left, black 0px, black 179px, transparent 179px, transparent 261px, black 261px, black 100%)' }}>
              <div className="yureka-marquee-track">
                {heroBrands.map((brand, i) => (
                  <span
                    key={`a-${i}`}
                    className="mx-7 shrink-0 text-black/60 whitespace-nowrap font-sans text-sm font-semibold tracking-wider uppercase"
                  >
                    {brand.name}
                  </span>
                ))}
                {heroBrands.map((brand, i) => (
                  <span
                    key={`b-${i}`}
                    className="mx-7 shrink-0 text-black/60 whitespace-nowrap font-sans text-sm font-semibold tracking-wider uppercase"
                  >
                    {brand.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;