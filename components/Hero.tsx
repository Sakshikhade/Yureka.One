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
        @keyframes halo-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .halo-marquee-track {
          display: flex;
          width: max-content;
          animation: halo-marquee 22s linear infinite;
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
            {/* Background video */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="object-cover absolute inset-0 w-full h-full"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_161253_c72b1869-400f-45ed-ac0c-52f68c2ed5bd.mp4"
            />

            {/* Dark gradient at bottom so text stays readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none z-[5]" />

            {/* Content overlay */}
            <div className="relative z-10 flex flex-col items-start justify-start h-full p-10 pt-20">
              <h1
                className="text-white text-5xl md:text-6xl font-extrabold leading-tight max-w-xl mb-4"
                style={{ letterSpacing: '-0.04em' }}
              >
                Your Wealth<br />Works
              </h1>

              <p className="text-white/70 text-base md:text-lg max-w-md mb-8 leading-relaxed">
                An automated, reward-powered digital dollar built for native passive earnings and effortless connection into DeFi.
              </p>

              {/* "Join us" pill button */}
              <button className="inline-flex items-center gap-3 bg-white text-black text-base md:text-lg font-medium pl-8 pr-2 py-2 rounded-full hover:bg-zinc-100 transition-colors duration-200">
                <span>Join us</span>
                <span className="bg-black rounded-full p-2">
                  <ArrowRight className="w-5 h-5 text-white" />
                </span>
              </button>

              {/* Brand Marquee */}
              <div className="mt-16 w-full max-w-md overflow-hidden">
                <div className="halo-marquee-track">
                  {heroBrands.map((brand, i) => (
                    <span
                      key={`a-${i}`}
                      className="mx-7 shrink-0 text-white/60 whitespace-nowrap font-sans text-sm font-semibold tracking-wider uppercase"
                    >
                      {brand.name}
                    </span>
                  ))}
                  {heroBrands.map((brand, i) => (
                    <span
                      key={`b-${i}`}
                      className="mx-7 shrink-0 text-white/60 whitespace-nowrap font-sans text-sm font-semibold tracking-wider uppercase"
                    >
                      {brand.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;