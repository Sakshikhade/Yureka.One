import React, { useEffect, useState, useRef } from 'react';

const useInView = (threshold = 0.2) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
};

const Counter: React.FC<{ end: number; duration?: number; trigger: boolean; prefix?: string; suffix?: string }> = ({ end, duration = 2000, trigger, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (trigger) {
      let startTime: number | null = null;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        setCount(ease * end);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [trigger, end, duration]);

  return <span className="tabular-nums font-light">{prefix}{end % 1 !== 0 ? count.toFixed(1) : Math.floor(count)}{suffix}</span>;
};

const Stats: React.FC = () => {
  const { ref, isInView } = useInView(0.1);

  return (
    <section className="py-24 md:py-32 bg-cream px-4 md:px-8 border-y border-ink/10 relative">
      {/* Background Grid Pattern for Financial Look */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ 
             backgroundImage: 'linear-gradient(to right, #242424 1px, transparent 1px), linear-gradient(to bottom, #242424 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10" ref={ref}>
        
        {/* Header - Financial Section Style */}
        <div className="border-b-4 border-double border-ink/10 mb-12 pb-6">
             <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-1.5 bg-teal rounded-full animate-pulse"></div>
                        <h2 className="text-xs font-mono font-bold tracking-[0.3em] uppercase text-ink/60">Our Numbers</h2>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-serif leading-none text-ink tracking-tight">
                        Why Use <br/><span className="italic text-ink/50">Us?</span>
                    </h3>
                </div>
                <div className="hidden md:block text-right transition-all duration-1000 delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}">
                    <p className="text-ink/60 text-lg max-w-sm font-serif italic border-l-2 border-teal pl-4">
                        "Banks make money when you're confused. We help you understand and save."
                    </p>
                </div>
            </div>
        </div>

        {/* Newspaper Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-ink/10 bg-paper">
            
            {/* Stat 1 */}
            <div className={`
                col-span-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-ink/10 relative group
                transition-all duration-1000 delay-300
                ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            `}>
                <div className="flex justify-between items-start mb-8">
                     <span className="text-xs font-bold uppercase tracking-widest text-teal border border-teal/30 px-3 py-1.5 bg-teal/5 rounded-sm">Cards</span>
                     <span className="text-xs font-mono text-ink/30">DAT.01</span>
                </div>
                <div className="text-4xl md:text-6xl text-ink mb-4 tracking-tighter leading-none font-serif">
                    <Counter end={248} suffix="" trigger={isInView} />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-ink mb-3 border-t border-ink/10 pt-4 inline-block w-full">Cards Checked</h4>
                <p className="text-ink/70 text-sm font-sans leading-relaxed max-w-xs">
                    We check fees and rewards for over 248 credit cards.
                </p>
            </div>

            {/* Stat 2 */}
            <div className={`
                col-span-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-ink/10 relative group
                transition-all duration-1000 delay-400
                ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            `}>
                <div className="flex justify-between items-start mb-8">
                     <span className="text-xs font-bold uppercase tracking-widest text-ink border border-ink/30 px-3 py-1.5 rounded-sm">Accuracy</span>
                     <span className="text-xs font-mono text-ink/30">ALG.02</span>
                </div>
                <div className="text-4xl md:text-6xl text-ink mb-4 tracking-tighter leading-none font-serif">
                    <Counter end={100} prefix="" suffix="%" trigger={isInView} />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-ink mb-3 border-t border-ink/10 pt-4 inline-block w-full">Perfect Matches</h4>
                <p className="text-ink/70 text-sm font-sans leading-relaxed max-w-xs">
                    We look at 50+ details to make sure the card fits your life.
                </p>
            </div>

            {/* Stat 3 */}
            <div className={`
                col-span-1 p-8 md:p-12 relative group
                transition-all duration-1000 delay-500
                ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
            `}>
                <div className="flex justify-between items-start mb-8">
                     <span className="text-xs font-bold uppercase tracking-widest text-clay border border-clay/30 px-3 py-1.5 bg-clay/5 rounded-sm">Savings</span>
                     <span className="text-xs font-mono text-ink/30">RES.03</span>
                </div>
                <div className="text-4xl md:text-6xl text-ink mb-4 tracking-tighter leading-none font-serif">
                    <Counter end={15} prefix="₹" suffix="k" trigger={isInView} />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-ink mb-3 border-t border-ink/10 pt-4 inline-block w-full">Extra Money</h4>
                <p className="text-ink/70 text-sm font-sans leading-relaxed max-w-xs">
                    Our users save an average of ₹15,000 a year by switching to the right card.
                </p>
            </div>

        </div>
      </div>
    </section>
  );
};

export default Stats;