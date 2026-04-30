import React from 'react';

const PARTNERS = [
  { name: 'TATA',             logo: '/logos/itc.png' },
  { name: 'Marriott Bonvoy',  logo: '/logos/accor.png' },
  { name: 'Amazon',           logo: '/logos/atmos.png' },
  { name: 'SBI',              logo: '/logos/sbi.png' },
  { name: 'Axis Bank',        logo: '/logos/axis.png' },
  { name: 'American Express', logo: '/logos/amex.png' },
  { name: 'HDFC',             logo: '/logos/hdfc.png' },
  { name: 'ICICI',            logo: '/logos/icici.png' },
  { name: 'Kotak',            logo: '/logos/kotak.png' },
  { name: 'IndusInd',         logo: '/logos/indusind.png' },
  { name: 'Yes Bank',         logo: '/logos/yes.png' },
  { name: 'AU',               logo: '/logos/au.png' },
];

// Duplicate enough times so the strip feels endless
const ITEMS = [...PARTNERS, ...PARTNERS, ...PARTNERS];

const PartnerLogos: React.FC = () => (
  <div className="w-full bg-[#1a3fcb] py-4 overflow-hidden relative">
    {/* Fade edges */}
    <div
      className="relative overflow-hidden"
      style={{
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        maskImage:
          'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <div
        className="flex items-center gap-12 whitespace-nowrap animate-marquee w-max"
        style={{ animationDuration: '38s' }}
      >
        {ITEMS.map((p, i) => (
          <div
            key={i}
            className="inline-flex items-center justify-center h-8 px-2 shrink-0"
          >
            <img
              src={p.logo}
              alt={p.name}
              className="h-full w-auto object-contain brightness-0 invert opacity-90 max-w-[80px]"
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = 'none';
                const span = document.createElement('span');
                span.className =
                  'text-white/80 text-xs font-bold uppercase tracking-wider';
                span.textContent = p.name;
                el.parentElement?.appendChild(span);
              }}
            />
          </div>
        ))}
      </div>
    </div>

    {/* Caption */}
    <p className="text-center text-white/50 text-[10px] font-medium tracking-[0.25em] uppercase mt-3">
      Compare Credit Cards from These Leading Institutions
    </p>
  </div>
);

export default PartnerLogos;
