// Real brand logos, pulled from the same /brand-logos asset set (and
// per-logo bgColor pairing) used across the rest of the site in
// brandsData.ts -- each logo was cut for that specific background color.

interface BrandEntry {
  name: string;
  image: string;
  bgColor: string;
}

// Randomly sampled from the full /brand-logos catalogue (deduped by brand,
// spanning every category folder) rather than a hand-picked "greatest hits"
// list, so the marquee is a fair cross-section of the 250+ logos on file.
const ROW_1: BrandEntry[] = [
  { name: 'Nykaa', image: '/brand-logos/beauty/nykaa.png', bgColor: '#e0136a' },
  { name: 'NuAyurveda', image: '/brand-logos/pharmacy/nuayurveda.png', bgColor: '#28772c' },
  { name: 'Machaan', image: '/brand-logos/food/machaan.png', bgColor: '#441c09' },
  { name: 'Duroflex', image: '/brand-logos/furnishing/duroflex.png', bgColor: '#ec1e26' },
  { name: 'Skinn by Titan', image: '/brand-logos/beauty/skinn-by-titan.png', bgColor: '#cdb8e8' },
  { name: 'Dabba & Co', image: '/brand-logos/food/dabba-and-co.png', bgColor: '#fbf8b8' },
  { name: 'Sterling Holidays', image: '/brand-logos/hotels/sterling.png', bgColor: '#faf6ec' },
  { name: "Nature's Basket", image: '/brand-logos/grocery/natures-basket.png', bgColor: '#749735' },
  { name: 'VR OTT', image: '/brand-logos/entertainment/vr-ott.png', bgColor: '#1a0f2e' },
];

const ROW_2: BrandEntry[] = [
  { name: 'Helios', image: '/brand-logos/luxury/helios.png', bgColor: '#010101' },
  { name: 'Lunchbox', image: '/brand-logos/food/lunchbox.png', bgColor: '#480074' },
  { name: 'Versace', image: '/brand-logos/luxury/versace.png', bgColor: '#7bbfbc' },
  { name: 'Pottery Barn', image: '/brand-logos/luxury/pottery-barn.png', bgColor: '#f4eee4' },
  { name: 'CGH Earth Experience Hotels', image: '/brand-logos/hotels/cgh-earth.png', bgColor: '#f3ece0' },
  { name: 'G-Star RAW', image: '/brand-logos/luxury/g-star-raw.png', bgColor: '#e4d5b6' },
  { name: 'Paul Smith', image: '/brand-logos/luxury/paul-smith.png', bgColor: '#e3d4b5' },
  { name: 'Veridicus Health Care', image: '/brand-logos/pharmacy/veridicus.png', bgColor: '#c5c4e9' },
  { name: 'Kate Spade', image: '/brand-logos/handbags/kate-spade.png', bgColor: '#e8d9c1' },
];

const ROW_3: BrandEntry[] = [
  { name: 'Joyalukkas', image: '/brand-logos/jewellery/joyalukkas.png', bgColor: '#8a1a2e' },
  { name: 'Rowan', image: '/brand-logos/luxury/rowan.png', bgColor: '#040404' },
  { name: 'GIVA', image: '/brand-logos/jewellery/giva.png', bgColor: '#f6dcc8' },
  { name: 'Absolute Barbecues', image: '/brand-logos/food/absolute-barbecues.png', bgColor: '#a1292b' },
  { name: 'Street Foods by Punjab Grill', image: '/brand-logos/food/street-foods-punjab-grill.png', bgColor: '#212224' },
  { name: "Spencer's", image: '/brand-logos/grocery/spencers.png', bgColor: '#f4b15b' },
  { name: 'Bodycraft', image: '/brand-logos/beauty/bodycraft.png', bgColor: '#ec1561' },
  { name: 'Abraham & Thakore', image: '/brand-logos/luxury/abraham-thakore.png', bgColor: '#030303' },
  { name: 'Swiss Beauty', image: '/brand-logos/beauty/swiss-beauty.png', bgColor: '#0d0d0d' },
];

const ROW_4: BrandEntry[] = [
  { name: 'Hush Puppies', image: '/brand-logos/footwear/hush-puppies.png', bgColor: '#f2e7db' },
  { name: 'Tira', image: '/brand-logos/beauty/tira.png', bgColor: '#f9cdd2' },
  { name: 'Adidas Kids', image: '/brand-logos/luxury/adidas-kids.png', bgColor: '#0e1d40' },
  { name: 'Baskin Robbins', image: '/brand-logos/food/baskin-robbins.png', bgColor: '#da5991' },
  { name: 'Hunkemoller', image: '/brand-logos/luxury/hunkemoller.png', bgColor: '#e4d5b6' },
  { name: 'Bottega Veneta', image: '/brand-logos/handbags/bottega-veneta.png', bgColor: '#e6dac1' },
  { name: 'ITC Hotels', image: '/brand-logos/hotels/itc-hotels.png', bgColor: '#d9c19f' },
  { name: 'Reliance Smart Bazaar', image: '/brand-logos/grocery/smart-bazaar.png', bgColor: '#ed2b2f' },
  { name: 'Siri Nature Roosts', image: '/brand-logos/hotels/siri-nature-roosts.png', bgColor: '#f0e8d0' },
];

function BrandBadge({ name, image, bgColor }: BrandEntry) {
  return (
    <div
      className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 p-4 sm:h-24 sm:w-24 sm:p-5"
      style={{ backgroundColor: bgColor }}
      title={name}
    >
      <img src={image} alt={name} loading="lazy" className="h-full w-full object-contain" />
    </div>
  );
}

function MarqueeRow({
  items,
  duration,
  reverse,
}: {
  items: BrandEntry[];
  duration: number;
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="flex w-full overflow-hidden">
      <div
        className="flex shrink-0 gap-4 sm:gap-6"
        style={{
          animation: `${reverse ? 'home-v2-marquee-reverse' : 'home-v2-marquee'} ${duration}s linear infinite`,
        }}
      >
        {doubled.map((brand, i) => (
          <BrandBadge key={`${brand.name}-${i}`} {...brand} />
        ))}
      </div>
    </div>
  );
}

export default function BrandsSection() {
  return (
    <section className="relative w-full overflow-hidden bg-black py-20 sm:py-28">
      <div className="mx-auto flex w-full flex-col gap-4 sm:gap-6 md:max-w-[60vw]">
        <MarqueeRow items={ROW_1} duration={40} />
        <MarqueeRow items={ROW_2} duration={46} reverse />
      </div>

      <div className="mx-auto my-16 max-w-4xl px-6 text-center sm:my-20 md:max-w-[60vw]">
        <p
          style={{ fontFamily: 'Inter, sans-serif' }}
          className="text-[28px] font-extrabold leading-[1.2] text-white sm:text-[40px]"
        >
          Partnered with Over{' '}
          <span
            style={{ fontFamily: '"Playfair Display", serif' }}
            className="italic font-semibold text-[#5fae52]"
          >
            700+ Brands
          </span>
        </p>
        <p
          style={{ fontFamily: 'Inter, sans-serif' }}
          className="mt-2 text-[24px] font-extrabold leading-[1.2] text-white sm:text-[36px]"
        >
          We are not stopping anytime soon
        </p>
      </div>

      <div className="mx-auto flex w-full flex-col gap-4 sm:gap-6 md:max-w-[60vw]">
        <MarqueeRow items={ROW_3} duration={44} />
        <MarqueeRow items={ROW_4} duration={50} reverse />
      </div>
    </section>
  );
}
