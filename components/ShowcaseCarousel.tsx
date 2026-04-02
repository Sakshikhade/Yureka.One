import React, { useRef, useEffect } from 'react';
import { Card } from '../types';
import { CreditCard as CardIcon, ArrowUpRight, Sparkles, Zap, MousePointer2 } from 'lucide-react';
import ImageWithLoader from './ImageWithLoader';
import { Link } from 'react-router-dom';
import { featuredCards } from '../data';

interface ShowcaseCarouselProps {
  cards: any[];
}

const ShowcaseCarousel: React.FC<ShowcaseCarouselProps> = ({ cards: cardsProp }) => {
  const cards = cardsProp.length > 0 ? cardsProp : featuredCards;
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

  const rotations = [-2, 1, -1.5, 2, -0.5];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const { top, height } = container.getBoundingClientRect();
      
      const start = 0; 
      const end = height - window.innerHeight;
      const currentScroll = -top;

      let progress = currentScroll / end;
      progress = Math.max(0, Math.min(1, progress));

      const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);
      const totalCards = cards.length;
      const cardsPhaseEnd = 0.8;
      const step = cardsPhaseEnd / totalCards;

      cards.forEach((_, i) => {
          const card = cardsRef.current[i];
          if (!card) return;

          const cardStart = i * step;
          const cardEnd = cardStart + step;
          let entryProgress = (progress - cardStart) / step;
          entryProgress = Math.max(0, Math.min(1, entryProgress));
          const ease = easeOutCubic(entryProgress);

          const startX = 180; 
          const currentX = startX * (1 - ease);
          const targetRotation = rotations[i % rotations.length];
          const currentRotation = targetRotation * ease;
          const buriedAmount = Math.max(0, (progress - cardEnd) / step);
          const scale = 1.0 - (buriedAmount * 0.05);
          const brightness = 1 - (buriedAmount * 0.1); 

          card.style.transform = `translate3d(${currentX}%, 0, 0) rotate(${currentRotation}deg) scale(${scale})`;
          card.style.opacity = entryProgress > 0.05 ? '1' : '0';
          card.style.filter = `brightness(${brightness})`;
          card.style.zIndex = (i + 1).toString();
      });

      if (ctaRef.current) {
          const ctaStart = 0.75;
          const ctaEnd = 1.0;
          let ctaP = (progress - ctaStart) / (ctaEnd - ctaStart);
          ctaP = Math.max(0, Math.min(1, ctaP));
          const ctaEase = easeOutCubic(ctaP);
          const startX = 150; 
          const x = startX * (1 - ctaEase);
          ctaRef.current.style.transform = `translate3d(${x}%, 0, 0)`;
          ctaRef.current.style.opacity = ctaEase.toString();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
    };
  }, [cards.length]);

  return (
    <section ref={containerRef} className="relative bg-cream h-[350vh] border-t border-ink/10 z-10">
      
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center p-2 md:p-6 lg:p-8">
        
        <div className="relative w-full h-full max-w-[1700px] border border-ink/10 bg-paper flex flex-col shadow-xl">
            
            <div className="absolute top-0 bottom-0 left-[33%] w-px bg-ink/5 hidden lg:block z-0"></div>
            <div className="absolute top-0 bottom-0 right-[33%] w-px bg-ink/5 hidden lg:block z-0"></div>

            <div className="w-full h-full relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 h-full">

                    {/* Left Column: Copy */}
                    <div className="col-span-1 h-full flex flex-col justify-center px-8 md:px-16 relative z-20 pointer-events-none">
                        <div className="pointer-events-auto">
                            <span className="block text-teal text-xs font-bold uppercase tracking-[0.3em] mb-6">
                                How It Works
                            </span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-ink mb-6 leading-[0.9] tracking-tight">
                                We Compare <br/>
                                <span className="italic font-light text-ink/50">For You.</span>
                            </h2>
                            <p className="text-ink/70 text-[10px] sm:text-sm md:text-base font-sans leading-relaxed mb-6 sm:mb-10 border-l border-ink/20 pl-4 sm:pl-6 max-w-[200px] sm:max-w-sm">
                                We don't just list cards. We compare 200+ options to find the best one for you.
                            </p>
                            
                            <div className="flex items-center gap-4 text-xs font-bold tracking-[0.2em] uppercase text-ink/30">
                                <div className="w-12 h-px bg-ink/20"></div>
                                Scroll to Explore
                            </div>
                        </div>
                    </div>

                    {/* Middle Column: Cards */}
                    <div className="col-span-1 h-full relative flex items-center justify-center pointer-events-none">
                        <div className="relative w-[75vw] sm:w-[85vw] h-[50vh] sm:h-[60vh] max-h-[600px] max-w-[400px] perspective-1000 pointer-events-auto mt-12 sm:mt-16 lg:mt-0">
                            {cards.map((card, i) => (
                                <div
                                    key={card.id}
                                    ref={el => { cardsRef.current[i] = el; }}
                                    className="absolute inset-0 w-full h-full will-change-transform"
                                    style={{ transform: 'translate3d(100%, 0, 0)', opacity: 0 }}
                                >
                                    {/* Card Design: Gallery Frame Style */}
                                    <div className="w-full h-full bg-[#F5F5F0] p-2 sm:p-3 pb-6 sm:pb-8 shadow-2xl border border-ink/10 flex flex-col relative group transition-all duration-300">
                                        
                                        {/* Image Area with 'Mat' */}
                                        <div className="h-[60%] sm:h-[65%] relative overflow-hidden bg-[#F0F0F0] border-2 sm:border-4 border-paper shadow-sm grayscale group-hover:grayscale-0 transition-all duration-700">
                                            <ImageWithLoader 
                                                src={card.image} 
                                                alt={card.name} 
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Floating Glass Badge */}
                                            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 glass-panel backdrop-blur-md text-ink px-2 sm:px-3 py-0.5 sm:py-1 text-[7px] sm:text-[9px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                                                {card.issuer}
                                            </div>
                                        </div>
                                        
                                        {/* Content Area */}
                                        <div className="flex-1 pt-3 sm:pt-6 px-1 sm:px-2 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-baseline mb-2 sm:mb-3 border-b border-ink/10 pb-2 sm:pb-3">
                                                    <h3 className="text-xl sm:text-2xl font-serif text-ink leading-none">{card.name}</h3>
                                                    <span className="text-[8px] sm:text-[10px] font-bold text-ink/40 uppercase tracking-widest">No. {i + 1}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-ink/60 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mt-1 sm:mt-2">
                                                    <span className="flex items-center gap-1 sm:gap-1.5"><Sparkles size={10} /> {card.rewardsRate}</span>
                                                    <span className="flex items-center gap-1 sm:gap-1.5"><Zap size={10} /> {card.category}</span>
                                                </div>
                                            </div>
 
                                            <div className="flex items-end justify-between mt-auto">
                                                <div>
                                                    <p className="text-[8px] sm:text-xs text-ink/40 font-bold uppercase tracking-widest mb-0.5 sm:mb-1">Savings</p>
                                                    <p className="text-2xl sm:text-3xl font-serif text-ink tracking-tight">{card.projectedSavings}</p>
                                                </div>
                                                <button className="w-8 h-8 sm:w-12 sm:h-12 border border-ink/10 text-ink flex items-center justify-center hover:bg-ink hover:text-white transition-colors rounded-full">
                                                    <ArrowUpRight size={14} className="sm:w-[18px] sm:h-[18px]" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: CTA */}
                    <div className="col-span-1 h-full relative flex items-center justify-center lg:justify-start lg:pl-20 pointer-events-none">
                        <div 
                            ref={ctaRef}
                            className="relative pointer-events-auto"
                            style={{ opacity: 0, transform: 'translate3d(100%, 0, 0)' }}
                        >
                            <Link to="/cards" className="group block">
                                <div className="w-[280px] sm:w-[340px] h-[400px] sm:h-[480px] bg-clay border border-ink/10 relative overflow-hidden flex flex-col items-center justify-center text-center p-6 sm:p-10 transition-all duration-300 shadow-2xl">
                                    <div className="absolute inset-0 border-[8px] sm:border-[12px] border-double border-black/10 pointer-events-none"></div>
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-ink text-white rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500">
                                            <MousePointer2 size={20} className="sm:w-[24px] sm:h-[24px]" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-serif text-ink mb-1 sm:mb-2 italic">Start</h3>
                                        <p className="text-xl sm:text-2xl font-bold text-ink tracking-tighter leading-none mb-6 sm:mb-8 uppercase">Find<br/>My Card</p>
                                        <div className="bg-ink text-white px-4 sm:px-6 py-2 sm:py-3 font-bold uppercase tracking-widest text-[10px] sm:text-xs group-hover:bg-paper group-hover:text-ink transition-colors rounded-sm">
                                            View All Cards
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseCarousel;