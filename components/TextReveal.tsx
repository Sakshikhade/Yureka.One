import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const TextReveal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const headerText = "EDITORIAL • SECTION 01";
  const bodyText = "Your credit card dictates your rewards. That is why we scanned 200+ options to find the ones that actually deliver. Cashback on Swiggy, travel lounge access, and rewards that actually matter. Welcome to the financial upgrade you deserve.";
  
  const words = bodyText.split(" ");

  return (
    <section ref={containerRef} className="relative bg-cream min-h-[150vh] z-20 flex items-start justify-center border-b border-black/10 text-ink">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6 md:px-12 max-w-[1200px] mx-auto w-full">
        <div className="w-full max-w-5xl border-l border-clay/30 pl-8 md:pl-16 py-12">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
                <h3 className="text-ink/40 font-mono text-xs uppercase tracking-[0.3em] border-b border-clay/10 pb-4 inline-block">
                    {headerText}
                </h3>
            </motion.div>

            <div className="flex flex-wrap gap-x-3 gap-y-1 md:gap-x-4 md:gap-y-2 leading-tight">
            {words.map((word, i) => {
                const start = i / words.length;
                const end = start + 0.1;
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);

                return (
                <motion.span
                    key={i}
                    style={{ opacity }}
                    className="font-serif text-2xl md:text-3xl lg:text-5xl text-ink"
                >
                    {word}
                </motion.span>
                );
            })}
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.5 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-12"
            >
                <p className="font-mono text-xs uppercase tracking-widest text-ink/60">
                    — The Editors
                </p>
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TextReveal;