import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const TextReveal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });


  const headerText = "EDITORIAL • SECTION 01";
  const bodyText = "Your credit card dictates your rewards. That is why we scanned 200+ options to find the ones that actually deliver. Cashback on Swiggy, travel lounge access, and rewards that actually matter. Welcome to the financial upgrade you deserve.";
  
  const words = bodyText.split(" ");

  return (
    <section ref={containerRef} className="relative bg-cream h-[250vh] md:h-[400vh] z-20 border-b border-black/10 text-ink overflow-visible">
      {/* Background Micro-details */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/p6-mini.png')]" />

      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6 md:px-12 max-w-[1240px] mx-auto w-full overflow-hidden">
        <div className="w-full border-l border-clay/30 pl-8 md:pl-16 py-16 relative">
            {/* Corner Deco */}
            <div className="absolute top-0 left-0 w-8 h-px bg-clay/20"></div>
            <div className="absolute top-0 left-0 w-px h-8 bg-clay/20"></div>

            <motion.div 
              style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [0, 1]) }}
              className="mb-12 md:mb-16"
            >
                <div className="flex items-center gap-4">
                  <div className="h-px w-8 bg-clay/30"></div>
                  <h3 className="text-ink font-medium text-[10px] uppercase tracking-[0.4em]">
                      {headerText}
                  </h3>
                </div>
            </motion.div>

            <div className="flex flex-wrap gap-x-3 gap-y-1 md:gap-x-5 md:gap-y-3 leading-[1.1]">
            {words.map((word, i) => {
                // Precise word-by-word reveal timing
                const start = (i / words.length) * 0.88; 
                const end = start + 0.1;

                // Color transition from grey to ink black
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const color = useTransform(
                  scrollYProgress, 
                  [start, end], 
                  ["rgba(17, 17, 17, 0.08)", "rgba(17, 17, 17, 1)"]
                );

                return (
                <motion.span
                    key={i}
                    style={{ color }}
                    className="font-heading font-medium text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[2.75rem] uppercase tracking-tight"
                >
                    {word}
                </motion.span>
                );
            })}
            </div>
            
            <motion.div 
              style={{ 
                opacity: useTransform(scrollYProgress, [0.94, 0.98], [0, 1])
              }}
              className="mt-16 md:mt-20 pt-8 border-t border-clay/10 inline-block"
            >
                <p className="font-serif italic text-sm text-ink/40">
                    — The Intelligence Bureau
                </p>
            </motion.div>

            {/* Bottom Deco */}
            <div className="absolute bottom-0 left-0 w-8 h-px bg-clay/20"></div>
            <div className="absolute bottom-0 left-0 w-px h-8 bg-clay/20"></div>

        </div>
      </div>
    </section>
  );
};

export default TextReveal;