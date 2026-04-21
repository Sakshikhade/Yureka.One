import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const Counter: React.FC<{ end: number; duration?: number; trigger: boolean; prefix?: string; suffix?: string }> = ({ end, duration = 2000, trigger, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (trigger) {
      let startTime: number | null = null;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeValue = 1 - Math.pow(1 - progress, 4);
        setCount(easeValue * end);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [trigger, end, duration]);

  return <span className="tabular-nums font-light">{prefix}{end % 1 !== 0 ? count.toFixed(1) : Math.floor(count)}{suffix}</span>;
};

const Stats: React.FC = () => {
  const [hasAnimated, setHasAnimated] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
    <section className="py-12 md:py-20 bg-cream px-4 md:px-8 border-y border-ink/10 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto relative z-10 text-ink">
        
        {/* Header - Financial Section Style */}
        <div className="border-b-4 border-double border-ink/10 mb-8 md:mb-12 pb-6">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-ink">
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={itemVariants}
                >
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <div className="w-1.5 h-1.5 bg-clay rounded-full animate-pulse"></div>
                        <h2 className="text-[10px] md:text-xs font-mono font-bold tracking-[0.3em] uppercase text-ink/60">Our Numbers</h2>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-serif leading-none text-ink tracking-tight uppercase">
                        Why Use <br/><span className="italic font-light text-ink/50">Us?</span>
                    </h3>
                </motion.div>
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={itemVariants}
                    transition={{ delay: 0.2 }}
                    className="md:text-right"
                >
                    <p className="text-ink/60 text-base md:text-lg max-w-sm font-serif italic border-l-2 md:border-l-0 md:border-r-2 border-clay pl-4 md:pl-0 md:pr-4">
                        "Banks make money when you're confused. <br className="hidden lg:block" /> We help you understand and save."
                    </p>
                </motion.div>
            </div>
        </div>

        {/* Newspaper Grid */}
        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            onViewportEnter={() => setHasAnimated(true)}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 border border-ink/10 bg-paper"
        >
            
            {/* Stat 1 */}
            <motion.div variants={itemVariants} className="col-span-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-ink/10 relative group hover:bg-ink/[0.02] transition-colors">
                <div className="flex justify-between items-start mb-8 text-ink">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-clay border border-clay/30 px-3 py-1.5 bg-clay/5 rounded-sm">Cards</span>
                     <span className="text-[10px] font-mono text-ink/30">DAT.01</span>
                </div>
                <div className="text-5xl md:text-7xl text-ink mb-4 tracking-tighter leading-none font-serif">
                    <Counter end={248} suffix="" trigger={hasAnimated} />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-ink mb-3 border-t border-ink/10 pt-4 flex justify-between items-center w-full">
                    <span>Cards Scanned</span>
                    <span className="text-[10px] lowercase font-normal italic opacity-40">Live Feed</span>
                </h4>
                <p className="text-ink/70 text-sm font-sans leading-relaxed max-w-xs">
                    We check fees and rewards for over 200+ credit cards across all major Indian banks. No bias, just data.
                </p>
            </motion.div>

            {/* Stat 2 */}
            <motion.div variants={itemVariants} className="col-span-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-ink/10 relative group hover:bg-ink/[0.02] transition-colors">
                <div className="flex justify-between items-start mb-8 text-ink">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-ink border border-ink/30 px-3 py-1.5 rounded-sm">Accuracy</span>
                     <span className="text-[10px] font-mono text-ink/30">ALG.02</span>
                </div>
                <div className="text-5xl md:text-7xl text-ink mb-4 tracking-tighter leading-none font-serif">
                    <Counter end={100} prefix="" suffix="%" trigger={hasAnimated} />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-ink mb-3 border-t border-ink/10 pt-4 flex justify-between items-center w-full">
                    <span>Precision Matching</span>
                    <span className="text-[10px] lowercase font-normal italic opacity-40">AI-Verified</span>
                </h4>
                <p className="text-ink/70 text-sm font-sans leading-relaxed max-w-xs">
                    We look at 50+ spending patterns to make sure the card fits your unique lifestyle perfectly.
                </p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div variants={itemVariants} className="col-span-1 p-8 md:p-12 relative group hover:bg-ink/[0.02] transition-colors">
                <div className="flex justify-between items-start mb-8 text-ink">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-clay border border-clay/30 px-3 py-1.5 bg-clay/5 rounded-sm">Savings</span>
                     <span className="text-[10px] font-mono text-ink/30">RES.03</span>
                </div>
                <div className="text-5xl md:text-7xl text-ink mb-4 tracking-tighter leading-none font-serif">
                    <Counter end={15} prefix="₹" suffix="k" trigger={hasAnimated} />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-ink mb-3 border-t border-ink/10 pt-4 flex justify-between items-center w-full">
                    <span>Average Savings</span>
                    <span className="text-[10px] lowercase font-normal italic opacity-40">Pro-Rated</span>
                </h4>
                <p className="text-ink/70 text-sm font-sans leading-relaxed max-w-xs">
                    Users save an average of ₹15,000 per year by optimizing their voucher and reward strategies with us.
                </p>
            </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default Stats;