import React from 'react';

const backers = [
  { name: 'Fundamental Labs' },
  { name: 'KUCOIN' },
  { name: 'NGC' },
  { name: 'NxGen' },
  { name: 'Matter Labs' },
  { name: 'DEXTools' },
  { name: 'NGRAVE' },
  { name: 'Polychain' },
];

const HaloBackedBySection: React.FC = () => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes backers-marquee {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .backers-track {
          display: flex;
          width: max-content;
          animation: backers-marquee 30s linear infinite;
        }
      `}} />

      <section className="bg-[#0a0a0a] px-6 py-14 w-full border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">

          {/* Left: description */}
          <div className="md:col-span-1 text-white/70 text-base leading-relaxed">
            Funded by premier partners<br />and forward-thinking leaders.
          </div>

          {/* Right: scrolling marquee */}
          <div className="md:col-span-3 w-full overflow-hidden">
            <div className="backers-track">
              {backers.map((b, i) => (
                <span
                  key={`ba-${i}`}
                  className="mx-10 shrink-0 text-white/50 whitespace-nowrap font-sans text-sm font-semibold tracking-wider uppercase"
                >
                  {b.name}
                </span>
              ))}
              {backers.map((b, i) => (
                <span
                  key={`bb-${i}`}
                  className="mx-10 shrink-0 text-white/50 whitespace-nowrap font-sans text-sm font-semibold tracking-wider uppercase"
                >
                  {b.name}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default HaloBackedBySection;
