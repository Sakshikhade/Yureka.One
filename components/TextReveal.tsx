import React, { useRef, useEffect, useState } from 'react';

const TextReveal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const containerTop = containerRef.current.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const elementHeight = containerRef.current.offsetHeight;
      
      const startOffset = windowHeight * 0.8;
      const totalDistance = elementHeight - startOffset;
      const currentScroll = -containerTop + (windowHeight * 0.2);
      
      let p = currentScroll / totalDistance;
      p = Math.max(0, Math.min(1, p));
      
      setProgress(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerText = "EDITORIAL • SECTION 01";
  const bodyText = "Your credit card dictates your rewards. That is why we scanned 200+ options to find the ones that actually deliver. Cashback on Swiggy, travel lounge access, and rewards that actually matter. Welcome to the financial upgrade you deserve.";
  
  const words = bodyText.split(" ");

  return (
    <section ref={containerRef} className="relative bg-cream min-h-[150vh] z-20 flex items-start justify-center border-b border-black/10">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6 md:px-12 max-w-[1200px] mx-auto w-full">
        <div className="w-full max-w-5xl border-l border-black/10 pl-8 md:pl-16 py-12">
            <div className="mb-12">
                <h3 className="text-black/40 font-mono text-xs uppercase tracking-[0.3em] animate-fade-in-up border-b border-black/10 pb-4 inline-block">
                    {headerText}
                </h3>
            </div>

            <div className="flex flex-wrap gap-x-3 gap-y-1 md:gap-x-4 md:gap-y-2 leading-tight">
            {words.map((word, i) => {
                const totalWords = words.length;
                const startThreshold = i / totalWords;
                const wordProgress = Math.max(0, progress - startThreshold);
                const isActive = wordProgress > 0;
                const opacity = isActive ? Math.min(1, 0.1 + (wordProgress * 20)) : 0.1;

                return (
                <span
                    key={i}
                    className="font-serif text-xl md:text-2xl lg:text-4xl transition-opacity duration-300"
                    style={{ 
                        opacity: opacity,
                        color: '#1a1a1a'
                    }}
                >
                    {word}
                </span>
                );
            })}
            </div>
            
            <div className="mt-12 opacity-50">
                <p className="font-mono text-xs uppercase tracking-widest text-black/60">
                    — The Editors
                </p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default TextReveal;