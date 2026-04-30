import React from 'react';
import { motion } from 'motion/react';

const PARTNERS = [
  { name: 'SBI', logo: '/logos/sbi.png' },
  { name: 'HDFC', logo: '/logos/hdfc.png' },
  { name: 'Axis Bank', logo: '/logos/axis.png' },
  { name: 'ICICI', logo: '/logos/icici.png' },
  { name: 'American Express', logo: '/logos/amex.png' },
  { name: 'TATA', logo: '/logos/itc.png' },
  { name: 'Marriott Bonvoy', logo: '/logos/accor.png' },
  { name: 'Amazon', logo: '/logos/atmos.png' },
  { name: 'Kotak', logo: '/logos/kotak.png' },
  { name: 'IndusInd', logo: '/logos/indusind.png' },
  { name: 'Yes Bank', logo: '/logos/yes.png' },
  { name: 'AU', logo: '/logos/au.png' },
];

const SAVINGS = [
  { pct: '21%', label: 'Discount on Shopping', emoji: '🛍️' },
  { pct: '16.67%', label: 'Savings on Tax Payment', emoji: '💼' },
  { pct: '30%', label: 'Discount on Dining', emoji: '🍽️' },
  { pct: '20%', label: 'On Travel Tickets', emoji: '✈️' },
  { pct: '₹15k', label: 'Average Rewards per Year', emoji: '💰' },
];

const PartnerLogos: React.FC = () => {
  return (
    <section className="relative bg-[#0a0a0a] border-y border-white/5 overflow-hidden">
      {/* Savings Pill Ticker */}
      <div className="bg-[#0d1117] border-b border-white/5 py-3 relative">
        <div
          className="relative overflow-hidden flex"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
          }}
        >
          <div className="flex gap-4 whitespace-nowrap animate-marquee w-max py-1" style={{ animationDuration: '30s' }}>
            {[...SAVINGS, ...SAVINGS, ...SAVINGS].map((s, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/8 px-5 py-2 rounded-full text-[11px] font-bold whitespace-nowrap"
              >
                <span className="text-[#34d399] font-black">{s.pct}</span>
                <span className="text-white/60">{s.label}</span>
                <span className="text-base leading-none">{s.emoji}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logo Marquee Strip */}
      <div className="bg-[#0a0a0a] py-8 relative">
        {/* Fade edges */}
        <div
          className="relative overflow-hidden"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          }}
        >
          <div className="flex gap-10 whitespace-nowrap animate-marquee w-max items-center" style={{ animationDuration: '35s' }}>
            {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((p, i) => (
              <div
                key={i}
                className="inline-flex items-center justify-center h-10 px-4 opacity-40 hover:opacity-80 transition-opacity duration-300 grayscale hover:grayscale-0 shrink-0"
              >
                <img
                  src={p.logo}
                  alt={p.name}
                  className="h-full w-auto object-contain max-w-[80px]"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = 'none';
                    const parent = el.parentElement;
                    if (parent) {
                      parent.innerHTML = `<span class="text-white/40 text-xs font-bold uppercase tracking-wider">${p.name}</span>`;
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.3em] mt-5"
        >
          Compare Credit Cards from These Leading Institutions
        </motion.p>
      </div>
    </section>
  );
};

export default PartnerLogos;
