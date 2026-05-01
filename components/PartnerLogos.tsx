import React from 'react';

const PARTNERS = [
  { name: 'HDFC',             logo: '/assets/banks/hdfc.png' },
  { name: 'SBI',              logo: '/assets/banks/sbi.png' },
  { name: 'Axis Bank',        logo: '/assets/banks/axis.png' },
  { name: 'ICICI',            logo: '/assets/banks/icici.png' },
  { name: 'American Express', logo: '/assets/banks/amex.png' },
  { name: 'Kotak',            logo: '/assets/banks/kotak.png' },
  { name: 'IndusInd',         logo: '/assets/banks/indusind.png' },
  { name: 'Yes Bank',         logo: '/assets/banks/yes.png' },
  { name: 'AU Small Finance', logo: '/assets/banks/au.png' },
  { name: 'TATA',             logo: '/assets/banks/tata.png' },
  { name: 'Marriott',         logo: '/assets/banks/marriott.png' },
  { name: 'Amazon',           logo: '/assets/banks/amazon.png' },
];

// Duplicate enough times so the strip feels endless
const ITEMS = [...PARTNERS, ...PARTNERS, ...PARTNERS];

const PartnerLogos: React.FC = () => (
  <div className="w-full bg-[#0a0a0a] py-6 overflow-hidden relative border-y border-white/5">
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
              className="h-full w-auto object-contain brightness-0 invert opacity-50 hover:opacity-100 transition-opacity duration-300 max-w-[100px]"
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
