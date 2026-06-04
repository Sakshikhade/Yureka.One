import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform, MotionValue } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

// ==========================================
// SHARED ANIMATION COMPONENTS
// ==========================================

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: React.CSSProperties;
}

export const WordsPullUp: React.FC<WordsPullUpProps> = ({ text, className = '', showAsterisk = false, style }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const words = text.split(' ');

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`} style={style}>
      {words.map((word, index) => {
        const isLastWord = index === words.length - 1;

        const wordVariants = {
          hidden: { y: 20, opacity: 0 },
          visible: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1] as const,
              delay: index * 0.08,
            },
          },
        };

        return (
          <motion.span
            key={index}
            variants={wordVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="relative inline-block mr-[0.25em] whitespace-nowrap"
          >
            {word}
            {isLastWord && showAsterisk && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em] select-none pointer-events-none">
                *
              </span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

interface Segment {
  text: string;
  className: string;
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  containerClassName?: string;
}

export const WordsPullUpMultiStyle: React.FC<WordsPullUpMultiStyleProps> = ({
  segments,
  containerClassName = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  let globalWordIndex = 0;

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${containerClassName}`}>
      {segments.map((seg, segIndex) => {
        const words = seg.text.split(' ');

        return (
          <span key={segIndex} className={seg.className}>
            {words.map((word, wordIndex) => {
              if (!word) return null;

              const currentWordIndex = globalWordIndex;
              globalWordIndex++;

              const wordVariants = {
                hidden: { y: 20, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1] as const,
                    delay: currentWordIndex * 0.08,
                  },
                },
              };

              return (
                <motion.span
                  key={wordIndex}
                  variants={wordVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  className="inline-block mr-[0.25em] whitespace-nowrap"
                >
                  {word}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
};

interface AnimatedLetterProps {
  char: string;
  index: number;
  totalChars: number;
  scrollYProgress: MotionValue<number>;
}

const AnimatedLetter: React.FC<AnimatedLetterProps> = ({
  char,
  index,
  totalChars,
  scrollYProgress,
}) => {
  const charProgress = index / totalChars;
  // Staggering range: [charProgress - 0.1, charProgress + 0.05]
  const startRange = Math.max(0, charProgress - 0.1);
  const endRange = Math.min(1, charProgress + 0.05);
  const adjustedEndRange = endRange <= startRange ? startRange + 0.01 : endRange;

  const opacity = useTransform(scrollYProgress, [startRange, adjustedEndRange], [0.2, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {char}
    </motion.span>
  );
};

const ParagraphScrollReveal: React.FC = () => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.35'],
  });

  const text =
    'Over the last seven years, I have worked with Parallax, a Berlin-based production house that crafts cinema, series, and Noir Studio in Paris. Together, we have created work that has earned international acclaim at several major festivals.';
  const chars = text.split('');
  const totalChars = chars.length;

  return (
    <p
      ref={containerRef}
      className="text-[#E1E0CC] text-xs sm:text-sm md:text-base leading-relaxed text-center max-w-2xl mx-auto flex flex-wrap justify-center gap-y-0.5"
      style={{ color: '#E1E0CC' }}
    >
      {chars.map((char, index) => (
        <AnimatedLetter
          key={index}
          char={char}
          index={index}
          totalChars={totalChars}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </p>
  );
};

// ==========================================
// CARD ENTRANCE WRAPPER
// ==========================================

const FeatureCardEntrance: React.FC<{ children: React.ReactNode; index: number }> = ({
  children,
  index,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full flex flex-col"
    >
      {children}
    </motion.div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

const TextReveal: React.FC = () => {
  return (
    <div className="w-full flex flex-col bg-black text-[#E1E0CC]">
      {/* SECTION 1: HERO */}
      <section className="relative w-full min-h-[600px] lg:h-screen p-4 md:p-6 bg-black flex flex-col">
        <div className="relative flex-1 w-full rounded-2xl md:rounded-[2rem] overflow-hidden flex flex-col justify-end">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
          />

          {/* Noise Overlay */}
          <div className="absolute inset-0 noise-overlay opacity-[0.7] mix-blend-overlay pointer-events-none z-10" />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none z-10" />

          {/* Hero Content */}
          <div className="relative z-20 w-full p-6 sm:p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              {/* Left Column: Heading */}
              <div className="lg:col-span-8 flex flex-col items-start mb-6 lg:mb-0">
                <WordsPullUp
                  text="Prisma"
                  showAsterisk
                  className="font-medium leading-[0.85] tracking-[-0.07em] text-[16vw] sm:text-[15vw] md:text-[14vw] lg:text-[9.5vw] xl:text-[9vw] 2xl:text-[8vw]"
                  style={{ color: '#E1E0CC' }}
                />
              </div>

              {/* Right Column: Description + CTA */}
              <div className="lg:col-span-4 flex flex-col items-start lg:pl-4">
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                  className="text-xs sm:text-sm md:text-base leading-[1.2] mb-8"
                  style={{ color: 'rgba(222, 219, 200, 0.7)' }} // Tailwind text-primary/70 inline translation
                >
                  Prisma is a worldwide network of visual artists, filmmakers and storytellers bound
                  not by place, status or labels but by passion and hunger to unlock potential
                  through our unique perspectives.
                </motion.p>

                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
                  className="group inline-flex items-center gap-2 hover:gap-3 bg-primary text-black font-medium text-sm sm:text-base pl-6 pr-1.5 py-1.5 rounded-full transition-all duration-300 shadow-lg whitespace-nowrap"
                  style={{ backgroundColor: '#DEDBC8' }}
                >
                  <span className="tracking-tight select-none whitespace-nowrap">Join the lab</span>
                  <div className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0">
                    <ArrowRight className="w-4 h-4 sm:w-5 h-5 text-[#E1E0CC]" />
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT */}
      <section className="bg-black py-24 px-6 md:px-12 w-full">
        <div className="bg-[#101010] rounded-[2rem] p-8 md:p-16 max-w-6xl mx-auto w-full flex flex-col items-center justify-center">
          <span className="text-[#DEDBC8] text-[10px] sm:text-xs tracking-widest uppercase mb-8 text-center block select-none">
            Visual arts
          </span>

          <div className="text-center mb-12">
            <WordsPullUpMultiStyle
              containerClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9] text-center"
              segments={[
                { text: 'I am Marcus Chen, ', className: 'font-normal text-[#E1E0CC]' },
                { text: 'a self-taught director. ', className: 'font-serif italic text-primary' },
                {
                  text: 'I have skills in color grading, visual effects, and narrative design.',
                  className: 'font-normal text-[#E1E0CC]',
                },
              ]}
            />
          </div>

          <ParagraphScrollReveal />
        </div>
      </section>

      {/* SECTION 3: FEATURES */}
      <section className="relative min-h-screen bg-black py-24 px-6 md:px-12 w-full overflow-hidden">
        {/* Subtle Background Noise */}
        <div className="absolute inset-0 bg-noise opacity-[0.15] pointer-events-none z-0" />

        <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col">
          <div className="text-center mb-20">
            <WordsPullUpMultiStyle
              containerClassName="flex-col gap-2"
              segments={[
                {
                  text: 'Studio-grade workflows for visionary creators.',
                  className: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal text-[#DEDBC8] block',
                },
                {
                  text: 'Built for pure vision. Powered by art.',
                  className: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal text-gray-500 block mt-2',
                },
              ]}
            />
          </div>

          {/* Grid Layout: Responsive breakpoints */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:h-[480px] gap-3 sm:gap-2 md:gap-1">
            {/* Card 1: Video Card */}
            <FeatureCardEntrance index={0}>
              <div className="relative rounded-2xl overflow-hidden min-h-[320px] lg:h-full flex flex-col justify-end p-6 z-10">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10" />
                <span className="text-[#E1E0CC] text-lg font-medium relative z-20">
                  Your creative canvas.
                </span>
              </div>
            </FeatureCardEntrance>

            {/* Card 2: Project Storyboard */}
            <FeatureCardEntrance index={1}>
              <div className="bg-[#212121] rounded-2xl p-6 lg:h-full flex flex-col justify-between">
                <div>
                  <img
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover shadow-md"
                    src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85"
                    alt="Storyboard icon"
                  />
                  <h3 className="text-[#E1E0CC] font-medium text-lg mt-5 tracking-tight uppercase">
                    Project Storyboard. <span className="text-gray-500 font-normal">(01)</span>
                  </h3>
                  <ul className="space-y-3 mt-5">
                    {[
                      'Real-time shot sequencing',
                      'Interactive frame layout',
                      'Collaborative moodboards',
                      'Asset version control',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-400">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" style={{ color: '#DEDBC8' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href="#"
                  className="group/link inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-white transition-colors mt-8"
                  style={{ color: '#DEDBC8' }}
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 transform -rotate-45 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </a>
              </div>
            </FeatureCardEntrance>

            {/* Card 3: Smart Critiques */}
            <FeatureCardEntrance index={2}>
              <div className="bg-[#212121] rounded-2xl p-6 lg:h-full flex flex-col justify-between">
                <div>
                  <img
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover shadow-md"
                    src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85"
                    alt="Critiques icon"
                  />
                  <h3 className="text-[#E1E0CC] font-medium text-lg mt-5 tracking-tight uppercase">
                    Smart Critiques. <span className="text-gray-500 font-normal">(02)</span>
                  </h3>
                  <ul className="space-y-3 mt-5">
                    {[
                      'AI-powered frame analysis',
                      'Contextual review notes',
                      'Major editing tool integrations',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-400">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" style={{ color: '#DEDBC8' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href="#"
                  className="group/link inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-white transition-colors mt-8"
                  style={{ color: '#DEDBC8' }}
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 transform -rotate-45 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </a>
              </div>
            </FeatureCardEntrance>

            {/* Card 4: Immersion Capsule */}
            <FeatureCardEntrance index={3}>
              <div className="bg-[#212121] rounded-2xl p-6 lg:h-full flex flex-col justify-between">
                <div>
                  <img
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover shadow-md"
                    src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85"
                    alt="Immersion icon"
                  />
                  <h3 className="text-[#E1E0CC] font-medium text-lg mt-5 tracking-tight uppercase">
                    Immersion Capsule. <span className="text-gray-500 font-normal">(03)</span>
                  </h3>
                  <ul className="space-y-3 mt-5">
                    {[
                      'Deep focus notification silencing',
                      'Ambient generative soundscapes',
                      'Creative schedule syncing',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-400">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" style={{ color: '#DEDBC8' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href="#"
                  className="group/link inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-white transition-colors mt-8"
                  style={{ color: '#DEDBC8' }}
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 transform -rotate-45 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </a>
              </div>
            </FeatureCardEntrance>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TextReveal;