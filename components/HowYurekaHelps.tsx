import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ============================================================================
// ─── REUSABLE COMPONENTS ────────────────────────────────────────────────────
// ============================================================================

// A. ContactButton: gradient backgrounds, inset shadows, custom outline offsets
export const ContactButton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`rounded-full text-white font-medium uppercase tracking-widest transition-transform select-none ${className}`}
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1',
        outline: '2px solid white',
        outlineOffset: '-3px',
      }}
    >
      <span className="block px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-[10px] sm:text-xs md:text-sm tracking-[0.2em] font-bold">
        Contact Me
      </span>
    </motion.button>
  );
};

// B. LiveProjectButton: ghost/outline style button
export const LiveProjectButton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <motion.button
      whileHover={{ backgroundColor: 'rgba(215, 226, 234, 0.1)', scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest bg-transparent transition-all select-none px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm ${className}`}
    >
      Live Project
    </motion.button>
  );
};

// C. FadeIn: Framer Motion viewport entrance animation wrapper
export const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: any;
  className?: string;
}> = ({ children, delay = 0, duration = 0.7, x = 0, y = 30, as = 'div', className = '' }) => {
  const MotionComponent = (motion as any).create ? (motion as any).create(as) : (motion as any)[as] || motion.div;

  return (
    <MotionComponent
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};

// D. Magnet: Mouse-following magnetic hover container
export const Magnet: React.FC<{
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}> = ({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [transition, setTransition] = useState(inactiveTransition);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;

      const distanceX = e.clientX - elementCenterX;
      const distanceY = e.clientY - elementCenterY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      const maxDistance = Math.max(rect.width, rect.height) / 2 + padding;
      if (distance < maxDistance) {
        setTransition(activeTransition);
        setPosition({
          x: distanceX / strength,
          y: distanceY / strength,
        });
      } else {
        setTransition(inactiveTransition);
        setPosition({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setTransition(inactiveTransition);
      setPosition({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    ref.current?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ref.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [padding, strength, activeTransition, inactiveTransition]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};

// E. AnimatedText: Character-by-character scroll-linked text opacity animator
export const AnimatedText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const words = text.split(' ');
  let charGlobalIndex = 0;
  const totalChars = text.length;

  return (
    <p ref={paragraphRef} className={`flex flex-wrap justify-center ${className}`}>
      {words.map((word, wordIdx) => {
        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.22em] my-1">
            {word.split('').map((char, charIdx) => {
              const currentIndex = charGlobalIndex;
              charGlobalIndex++;

              const startRange = currentIndex / totalChars;
              const endRange = (currentIndex + 1) / totalChars;
              const opacity = useTransform(scrollYProgress, [startRange, endRange], [0.2, 1]);

              return (
                <span key={charIdx} className="relative inline-block">
                  <span className="opacity-0">{char}</span>
                  <motion.span style={{ opacity }} className="absolute inset-0 select-none">
                    {char}
                  </motion.span>
                </span>
              );
            })}
            {wordIdx < words.length - 1 && (
              <span className="relative inline-block">
                <span className="opacity-0">&nbsp;</span>
                <motion.span
                  style={{
                    opacity: useTransform(
                      scrollYProgress,
                      [charGlobalIndex / totalChars, (charGlobalIndex + 1) / totalChars],
                      [0.2, 1]
                    ),
                  }}
                  className="absolute inset-0 select-none"
                >
                  &nbsp;
                </motion.span>
                {(() => {
                  charGlobalIndex++;
                  return null;
                })()}
              </span>
            )}
          </span>
        );
      })}
    </p>
  );
};

// ============================================================================
// ─── PORTFOLIO SECTIONS ──────────────────────────────────────────────────────
// ============================================================================

// 1. HERO SECTION
const HeroSection: React.FC = () => {
  return (
    <section className="relative h-screen w-full flex flex-col justify-between overflow-hidden px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 pt-24 md:pt-36">
      {/* Spacer / Top Row since navbar is hidden inside page body */}
      <div className="w-full flex justify-between items-center pointer-events-none opacity-0 select-none">
        <span className="text-sm">Jack</span>
      </div>

      {/* Portrait (Centered absolutely with Magnet) */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 sm:bottom-0 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 z-10 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]">
        <FadeIn delay={0.6} y={30} className="w-full h-full">
          <Magnet strength={3} padding={150} className="w-full h-full">
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png"
              alt="Portrait of Jack"
              className="w-full object-contain pointer-events-none select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
            />
          </Magnet>
        </FadeIn>
      </div>

      {/* Massive Heading */}
      <div className="w-full overflow-hidden relative z-0 mt-6 sm:mt-4 md:-mt-5">
        <FadeIn delay={0.15} y={40} className="w-full">
          <h1 className="hero-heading font-black uppercase tracking-tight leading-[0.8] whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] text-center select-none">
            Hi, i&apos;m jack
          </h1>
        </FadeIn>
      </div>

      {/* Bottom info band */}
      <div className="w-full flex justify-between items-end relative z-20">
        {/* Description Tagline */}
        <FadeIn delay={0.35} y={20} className="max-w-[160px] sm:max-w-[220px] md:max-w-[260px] text-left">
          <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug text-[10px] sm:text-[12px] md:text-sm lg:text-base">
            a 3d creator driven by crafting striking and unforgettable projects
          </p>
        </FadeIn>

        {/* Action Button */}
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
};

// 2. MARQUEE SECTION
const MarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const currentOffset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(currentOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const row1Images = [
    "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
    "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
    "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
    "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
    "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
    "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
    "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
    "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
    "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
    "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
    "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  ];

  const row2Images = [
    "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
    "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
    "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
    "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
    "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
    "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
    "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
    "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
    "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
    "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
  ];

  const tripledRow1 = [...row1Images, ...row1Images, ...row1Images];
  const tripledRow2 = [...row2Images, ...row2Images, ...row2Images];

  const row1Translation = offset - 200;
  const row2Translation = -(offset - 200);

  return (
    <div
      ref={sectionRef}
      className="w-full bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden flex flex-col gap-3 relative z-20"
    >
      {/* Row 1: moves RIGHT */}
      <div
        className="flex gap-3 whitespace-nowrap"
        style={{
          transform: `translateX(${row1Translation}px)`,
          willChange: 'transform',
        }}
      >
        {tripledRow1.map((url, i) => (
          <img
            key={`r1-${i}`}
            src={url}
            alt=""
            loading="lazy"
            className="w-[280px] sm:w-[350px] md:w-[420px] h-[180px] sm:h-[220px] md:h-[270px] rounded-2xl object-cover shrink-0 select-none pointer-events-none"
          />
        ))}
      </div>

      {/* Row 2: moves LEFT */}
      <div
        className="flex gap-3 whitespace-nowrap"
        style={{
          transform: `translateX(${row2Translation}px)`,
          willChange: 'transform',
        }}
      >
        {tripledRow2.map((url, i) => (
          <img
            key={`r2-${i}`}
            src={url}
            alt=""
            loading="lazy"
            className="w-[280px] sm:w-[350px] md:w-[420px] h-[180px] sm:h-[220px] md:h-[270px] rounded-2xl object-cover shrink-0 select-none pointer-events-none"
          />
        ))}
      </div>
    </div>
  );
};

// 3. ABOUT SECTION
const AboutSection: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden bg-[#0C0C0C]">
      {/* Floating 3D objects in four corners */}
      <div className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px] z-10 pointer-events-none">
        <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="w-full">
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
            alt=""
            className="w-full h-auto object-contain select-none"
          />
        </FadeIn>
      </div>

      <div className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px] z-10 pointer-events-none">
        <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="w-full">
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
            alt=""
            className="w-full h-auto object-contain select-none"
          />
        </FadeIn>
      </div>

      <div className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px] z-10 pointer-events-none">
        <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="w-full">
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
            alt=""
            className="w-full h-auto object-contain select-none"
          />
        </FadeIn>
      </div>

      <div className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px] z-10 pointer-events-none">
        <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="w-full">
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
            alt=""
            className="w-full h-auto object-contain select-none"
          />
        </FadeIn>
      </div>

      {/* Main About block */}
      <div className="relative z-20 flex flex-col items-center max-w-[620px] w-full text-center">
        {/* About Heading */}
        <FadeIn delay={0} y={40} className="w-full mb-10 sm:mb-14 md:mb-16">
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[7.5vw]">
            About me
          </h2>
        </FadeIn>

        {/* Animated text paragraph */}
        <div className="w-full mb-16 sm:mb-20 md:mb-24 px-4">
          <AnimatedText
            text="With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!"
            className="text-[#D7E2EA] font-medium leading-relaxed text-sm sm:text-lg md:text-xl lg:text-2xl text-center"
          />
        </div>

        {/* Contact CTA */}
        <FadeIn delay={0.2} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
};

// 4. SERVICES SECTION
interface ServiceItem {
  number: string;
  name: string;
  description: string;
}

const SERVICES: ServiceItem[] = [
  {
    number: "01",
    name: "3D Modeling",
    description: "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.",
  },
  {
    number: "02",
    name: "Rendering",
    description: "High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.",
  },
  {
    number: "03",
    name: "Motion Design",
    description: "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.",
  },
  {
    number: "04",
    name: "Branding",
    description: "Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.",
  },
  {
    number: "05",
    name: "Web Design",
    description: "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.",
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section className="bg-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-20 text-[#0C0C0C]">
      <div className="max-w-5xl mx-auto w-full">
        {/* Services Heading */}
        <FadeIn className="text-center mb-16 sm:mb-20 md:mb-28">
          <h2 className="text-[#0C0C0C] font-black uppercase text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[7.5vw] tracking-tight leading-none">
            Services
          </h2>
        </FadeIn>

        {/* Services List */}
        <div className="flex flex-col">
          {SERVICES.map((service, i) => (
            <FadeIn
              key={service.number}
              delay={i * 0.1}
              y={30}
              className="border-b border-[#0C0C0C]/15 py-8 sm:py-10 md:py-12 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12"
            >
              {/* Service Number */}
              <span className="font-black text-[12vw] sm:text-[10vw] md:text-[8vw] text-[#0C0C0C] leading-none select-none shrink-0 min-w-[70px] sm:min-w-[100px]">
                {service.number}
              </span>

              {/* Service Info */}
              <div className="flex flex-col gap-2.5 text-left flex-grow">
                <h3 className="font-semibold uppercase text-lg sm:text-xl md:text-2xl lg:text-[1.8rem] text-[#0C0C0C] tracking-tight">
                  {service.name}
                </h3>
                <p className="font-light leading-relaxed text-sm sm:text-base md:text-lg text-[#0C0C0C]/70 max-w-2xl">
                  {service.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// 5. PROJECTS SECTION
interface Project {
  number: string;
  category: string;
  name: string;
  img1: string;
  img2: string;
  img3: string;
}

const PROJECTS: Project[] = [
  {
    number: "01",
    category: "Client",
    name: "Nextlevel Studio",
    img1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
    img2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
    img3: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
  },
  {
    number: "02",
    category: "Personal",
    name: "Aura Brand Identity",
    img1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
    img2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
    img3: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85",
  },
  {
    number: "03",
    category: "Client",
    name: "Solaris Digital",
    img1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
    img2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
    img3: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85",
  },
];

const ProjectCard: React.FC<{
  project: Project;
  index: number;
  progress: any;
  range: number[];
  targetScale: number;
}> = ({ project, index, progress, range, targetScale }) => {
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      className="sticky h-[85vh] flex items-center justify-center top-24 md:top-32 w-full"
      style={{
        top: `calc(${index * 28}px + 6rem)`,
      }}
    >
      <motion.div
        style={{ scale }}
        className="w-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 flex flex-col justify-between h-[70vh] max-h-[620px] shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Top row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#D7E2EA]/15 pb-4 md:pb-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-none">
              {project.number}
            </span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] sm:text-xs text-[#D7E2EA]/60 uppercase tracking-widest font-light">
                {project.category}
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold uppercase text-white tracking-tight">
                {project.name}
              </h3>
            </div>
          </div>
          <LiveProjectButton />
        </div>

        {/* Bottom row: Image grid */}
        <div className="grid grid-cols-1 md:grid-cols-10 gap-4 md:gap-6 mt-4 md:mt-6 flex-1 min-h-0">
          {/* Left Column (40% width) */}
          <div className="md:col-span-4 flex flex-col gap-4 md:gap-6 justify-between h-full">
            <img
              src={project.img1}
              alt=""
              className="w-full object-cover rounded-[20px] sm:rounded-[30px] md:rounded-[40px] flex-grow min-h-0"
              style={{ height: 'clamp(110px, 14vw, 200px)' }}
            />
            <img
              src={project.img2}
              alt=""
              className="w-full object-cover rounded-[20px] sm:rounded-[30px] md:rounded-[40px] flex-grow min-h-0"
              style={{ height: 'clamp(140px, 18vw, 290px)' }}
            />
          </div>

          {/* Right Column (60% width) */}
          <div className="md:col-span-6 h-full min-h-0">
            <img
              src={project.img3}
              alt=""
              className="w-full h-full object-cover rounded-[20px] sm:rounded-[30px] md:rounded-[40px]"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ProjectsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={containerRef}
      className="relative bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-20 px-5 sm:px-8 md:px-10 pb-32"
    >
      <div className="max-w-5xl mx-auto py-16">
        {/* Projects Heading */}
        <FadeIn className="text-center mb-16">
          <h2 className="hero-heading text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[7.5vw] font-black uppercase tracking-tight leading-none mb-10">
            Project
          </h2>
        </FadeIn>

        {/* Cards stack */}
        <div className="relative w-full flex flex-col gap-24">
          {PROJECTS.map((project, idx) => {
            const totalCards = PROJECTS.length;
            const targetScale = 1 - (totalCards - 1 - idx) * 0.03;
            const startScroll = idx / totalCards;
            const endScroll = 1;

            return (
              <ProjectCard
                key={project.number}
                project={project}
                index={idx}
                progress={scrollYProgress}
                range={[startScroll, endScroll]}
                targetScale={targetScale}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// ─── MAIN PORTFOLIO ROOT ────────────────────────────────────────────────────
// ============================================================================

const HowYurekaHelps: React.FC = () => {
  // Dynamically set the title to "Jack -- 3D Creator"
  useEffect(() => {
    document.title = "Jack -- 3D Creator";
  }, []);

  return (
    <div className="portfolio-root w-full bg-[#0C0C0C] text-[#D7E2EA] overflow-x-clip relative z-10">
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
    </div>
  );
};

export default HowYurekaHelps;
