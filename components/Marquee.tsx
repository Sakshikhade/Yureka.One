import React from 'react';

const Marquee: React.FC = () => {
  return (
    <section className="py-24 bg-cream border-y border-black/10 relative overflow-hidden">
      
      {/* Background "Noise" Text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <span className="text-[20vw] font-bold leading-none text-black tracking-tighter">
            REWARDS
          </span>
      </div>

      <div className="relative z-10 flex flex-col gap-0">
          
          {/* Row 1: Right to Left */}
          <div className="bg-black text-white py-4 border-y border-white/10 transform -rotate-1 scale-105 shadow-xl origin-center">
             <div className="flex whitespace-nowrap animate-marquee w-max" style={{ animationDuration: '40s' }}>
                 {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-12 px-6">
                        <span className="text-2xl md:text-5xl font-serif italic">AI-driven matching for 200M+ Indians.</span>
                        <span className="text-2xl md:text-5xl font-bold uppercase tracking-tighter">No Ads. No Bias.</span>
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                 ))}
             </div>
          </div>

          {/* Row 2: Left to Right */}
          <div className="bg-teal text-white py-4 border-y border-black/10 transform rotate-1 scale-105 shadow-xl origin-center mt-[-10px] z-20">
             <div className="flex whitespace-nowrap animate-marquee w-max" style={{ animationDuration: '45s', animationDirection: 'reverse' }}>
                 {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-12 px-6">
                        <span className="text-2xl md:text-5xl font-bold uppercase tracking-tighter">Voucher Savings.</span>
                        <span className="text-2xl md:text-5xl font-serif italic">Managed by Yureka AI.</span>
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                 ))}
             </div>
          </div>

      </div>
    </section>
  );
};

export default Marquee;