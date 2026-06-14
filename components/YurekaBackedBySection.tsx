import React from 'react';

const bankLogos = [
  { name: 'Amex', logo: '/assets/banks/amex.png' },
  { name: 'AU Small Finance Bank', logo: '/assets/banks/au.png' },
  { name: 'Axis Bank', logo: '/assets/banks/axis.png' },
  { name: 'Bank of Baroda', logo: '/assets/banks/bob.png' },
  { name: 'Bank of India', logo: '/assets/banks/boi.png' },
  { name: 'Canara Bank', logo: '/assets/banks/canara.png' },
  { name: 'CSB Bank', logo: '/assets/banks/csb.png' },
  { name: 'City Union Bank', logo: '/assets/banks/cub.png' },
  { name: 'DBS Bank', logo: '/assets/banks/dbs.png' },
  { name: 'DCB Bank', logo: '/assets/banks/dcb.png' },
  { name: 'Dhanlaxmi Bank', logo: '/assets/banks/dhanlaxmi.png' },
  { name: 'Equitas Small Finance Bank', logo: '/assets/banks/equitas.png' },
  { name: 'Federal Bank', logo: '/assets/banks/federal.png' },
  { name: 'HDFC Bank', logo: '/assets/banks/hdfc.png' },
  { name: 'HSBC', logo: '/assets/banks/hsbc.png' },
  { name: 'ICICI Bank', logo: '/assets/banks/icici.png' },
  { name: 'IDBI Bank', logo: '/assets/banks/idbi.png' },
  { name: 'IDFC FIRST Bank', logo: '/assets/banks/idfc.png' },
  { name: 'Indian Bank', logo: '/assets/banks/indian.png' },
  { name: 'IndusInd Bank', logo: '/assets/banks/indusind.png' },
  { name: 'Indian Overseas Bank', logo: '/assets/banks/iob.png' },
  { name: 'J&K Bank', logo: '/assets/banks/jk.png' },
  { name: 'Kotak Mahindra Bank', logo: '/assets/banks/kotak.png' },
  { name: 'Punjab National Bank', logo: '/assets/banks/pnb.png' },
  { name: 'RBL Bank', logo: '/assets/banks/rbl.png' },
  { name: 'State Bank of India', logo: '/assets/banks/sbi.png' },
  { name: 'SBM Bank', logo: '/assets/banks/sbm.png' },
  { name: 'Standard Chartered', logo: '/assets/banks/sc.png' },
  { name: 'Slice', logo: '/assets/banks/slice.png' },
  { name: 'South Indian Bank', logo: '/assets/banks/southindian.png' },
  { name: 'Suryoday Bank', logo: '/assets/banks/suryoday.png' },
  { name: 'Union Bank of India', logo: '/assets/banks/union.png' },
  { name: 'Unity Small Finance Bank', logo: '/assets/banks/unity.png' },
  { name: 'Utkarsh Small Finance Bank', logo: '/assets/banks/utkarsh.png' },
  { name: 'Yes Bank', logo: '/assets/banks/yesbank.png' },
];

const YurekaBackedBySection: React.FC = () => {
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
          gap: 2rem;
          animation: backers-marquee 50s linear infinite;
        }
      `}} />

      <section className="bg-[#0a0a0a] px-6 py-14 w-full border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">

          {/* Left: description */}
          <div className="md:col-span-1 text-white/70 text-base leading-relaxed font-sans font-medium">
            500+ Credit Cards analysed<br />across leading banking partners.
          </div>

          {/* Right: scrolling marquee */}
          <div className="md:col-span-3 w-full overflow-hidden">
            <div className="backers-track flex items-center">
              {bankLogos.map((b, i) => (
                <div
                  key={`ba-${i}`}
                  className="bg-white px-5 rounded-2xl h-20 w-[calc((100vw-144px)/4)] md:w-[calc((75vw-156px)/4)] flex items-center justify-center shrink-0 shadow-sm opacity-80 hover:opacity-100 transition-opacity duration-300"
                >
                  <img
                    src={b.logo}
                    alt={b.name}
                    className="h-10 max-w-[85%] object-contain select-none pointer-events-none"
                  />
                </div>
              ))}
              {bankLogos.map((b, i) => (
                <div
                  key={`bb-${i}`}
                  className="bg-white px-5 rounded-2xl h-20 w-[calc((100vw-144px)/4)] md:w-[calc((75vw-156px)/4)] flex items-center justify-center shrink-0 shadow-sm opacity-80 hover:opacity-100 transition-opacity duration-300"
                >
                  <img
                    src={b.logo}
                    alt={b.name}
                    className="h-10 max-w-[85%] object-contain select-none pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default YurekaBackedBySection;
