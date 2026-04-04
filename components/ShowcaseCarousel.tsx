import React, { useRef } from 'react';
import { CreditCard as CardIcon, ArrowUpRight, Sparkles, Zap, MousePointer2 } from 'lucide-react';
import ImageWithLoader from './ImageWithLoader';
import { Link } from 'react-router-dom';
import { featuredCards } from '../data';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ShowcaseCarouselProps {
  cards: any[];
}

interface ShowcaseCardProps {
    card: any;
    index: number;
    total: number;
    progress: any;
}

const ShowcaseCard: React.FC<ShowcaseCardProps> = ({ card, index, total, progress }) => {
    const phaseSize = 0.8 / total;
    const start = index * phaseSize;
    const end = (index + 1) * phaseSize;
    
    const x = useTransform(progress, [start, start + phaseSize / 2], [300, 0]);
    const opacity = useTransform(progress, [start, start + 0.05, end, end + 0.05], [0, 1, 1, 0]);
    const scale = useTransform(progress, [end, end + phaseSize], [1, 0.95]);
    const rotate = useTransform(progress, [start, end], [index % 2 === 0 ? -2 : 2, index % 2 === 0 ? 2 : -2]);
    const brightness = useTransform(progress, [end, end + phaseSize], [1, 0.8]);

    // Handle both snake_case (Supabase/new data) and camelCase (legacy/types)
    const rewardsRate = card.rewards_rate || card.rewardsRate || 'N/A';
    const projectedSavings = card.projected_savings || card.projectedSavings || '₹0/yr';

    return (
        <motion.div
            style={{ x, opacity, scale, rotate, filter: `brightness(${brightness})`, zIndex: index }}
            className="absolute inset-0 w-full h-full"
        >
            <div className="w-full h-full bg-paper p-3 pb-8 shadow-2xl border border-ink/10 flex flex-col relative group transition-colors hover:border-clay/50">
                <div className="h-[65%] relative overflow-hidden bg-cream/50 border-4 border-paper shadow-inner grayscale group-hover:grayscale-0 transition-all duration-700">
                    <ImageWithLoader 
                        src={card.image} 
                        alt={card.name} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 glass-panel backdrop-blur-md text-ink px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full shadow-lg border border-white/20">
                        {card.issuer || card.bank}
                    </div>
                </div>
                
                <div className="flex-1 pt-6 px-2 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-baseline mb-3 border-b border-ink/10 pb-3">
                            <h3 className="text-2xl font-serif text-ink leading-none">{card.name}</h3>
                            <span className="text-[10px] font-bold text-ink/30 uppercase tracking-widest">RANK {index + 1}</span>
                        </div>
                        <div className="flex justify-between items-center text-ink/60 text-[10px] font-bold uppercase tracking-widest mt-2 font-mono">
                            <span className="flex items-center gap-1.5"><Sparkles size={12} className="text-clay" /> {rewardsRate}</span>
                            <span className="flex items-center gap-1.5"><Zap size={12} className="text-clay" /> {card.category || card.type}</span>
                        </div>
                    </div>

                    <div className="flex items-end justify-between mt-auto">
                        <div>
                            <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest mb-1 font-mono">Est. Savings</p>
                            <p className="text-3xl font-serif text-ink tracking-tight uppercase">{projectedSavings}</p>
                        </div>
                        <Link to="/join-waitlist" className="w-12 h-12 border border-ink/10 text-ink flex items-center justify-center hover:bg-ink hover:text-white transition-all rounded-full shadow-md hover:shadow-xl hover:-translate-y-1">
                            <ArrowUpRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ShowcaseCarousel: React.FC<ShowcaseCarouselProps> = ({ cards: cardsProp }) => {
  const cards = (cardsProp && cardsProp.length > 0) ? cardsProp : featuredCards;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section ref={containerRef} className="relative bg-cream h-[400vh] border-t border-ink/10 z-10">
      
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center p-2 md:p-6 lg:p-8">
        
        <div className="relative w-full h-full max-w-[1700px] border border-ink/10 bg-paper flex flex-col shadow-xl">
            
            <div className="absolute top-0 bottom-0 left-[33%] w-px bg-ink/5 hidden lg:block z-0"></div>
            <div className="absolute top-0 bottom-0 right-[33%] w-px bg-ink/5 hidden lg:block z-0"></div>

            <div className="w-full h-full relative z-10 text-ink">
                <div className="grid grid-cols-1 lg:grid-cols-3 h-full">

                    {/* Left Column: Copy */}
                    <div className="col-span-1 h-full flex flex-col justify-center px-8 md:px-16 relative z-20 pointer-events-none">
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8 }}
                          className="pointer-events-auto"
                        >
                            <span className="block text-clay text-xs font-bold uppercase tracking-[0.3em] mb-6">
                                How It Works
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-ink mb-6 leading-[0.9] tracking-tight uppercase">
                                We Compare <br/>
                                <span className="italic font-light text-ink/50">For You.</span>
                            </h2>
                            <p className="text-ink/70 text-sm md:text-base font-sans leading-relaxed mb-10 border-l border-clay pl-6 max-w-sm">
                                We don't just list cards. We scan 200+ options across all Indian banks to find the one that fits your life perfectly.
                            </p>
                            
                            <div className="flex items-center gap-4 text-[10px] font-bold tracking-[0.2em] uppercase text-ink/30">
                                <motion.div 
                                  animate={{ scaleX: [1, 1.5, 1] }} 
                                  transition={{ repeat: Infinity, duration: 2 }}
                                  className="w-12 h-px bg-clay"
                                />
                                Scroll down
                            </div>
                        </motion.div>
                    </div>

                    {/* Middle Column: Cards Container */}
                    <div className="col-span-1 h-full relative flex items-center justify-center pointer-events-none">
                        <div className="relative w-[85vw] h-[60vh] max-h-[600px] max-w-[420px] pointer-events-auto mt-12 lg:mt-0">
                            {cards.map((card, i) => (
                                <ShowcaseCard 
                                    key={card.id || i}
                                    card={card}
                                    index={i}
                                    total={cards.length}
                                    progress={smoothProgress}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Column: CTA */}
                    <div className="col-span-1 h-full relative flex items-center justify-center lg:justify-start lg:pl-20 pointer-events-none">
                        <motion.div 
                            style={{ 
                                x: useTransform(smoothProgress, [0.8, 0.95], [200, 0]),
                                opacity: useTransform(smoothProgress, [0.8, 0.9], [0, 1])
                            }}
                            className="relative pointer-events-auto"
                        >
                            <Link to="/cards" className="group block">
                                <div className="w-[320px] h-[480px] bg-clay/5 border border-clay/20 relative overflow-hidden flex flex-col items-center justify-center text-center p-10 transition-all duration-300 shadow-2xl hover:bg-clay/10">
                                    <div className="absolute inset-0 border-[12px] border-double border-clay/10 pointer-events-none"></div>
                                    <div className="relative z-10 flex flex-col items-center">
                                        <motion.div 
                                          animate={{ y: [0, -10, 0] }}
                                          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                          className="w-16 h-16 bg-ink text-white rounded-full flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-500"
                                        >
                                            <MousePointer2 size={24} className="text-clay" />
                                        </motion.div>
                                        <h3 className="text-xl font-serif text-ink mb-2 italic">Discovery</h3>
                                        <p className="text-3xl font-bold text-ink tracking-tighter leading-none mb-8 uppercase">Explore <br/>Market</p>
                                        <div className="bg-ink text-white px-8 py-3.5 font-bold uppercase tracking-widest text-xs group-hover:bg-clay group-hover:text-white transition-colors rounded-full shadow-xl">
                                            View All Cards
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseCarousel;