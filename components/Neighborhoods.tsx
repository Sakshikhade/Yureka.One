import React, { useRef, useEffect, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles, Zap, Chrome, Wallet, ShieldCheck } from 'lucide-react';
import ImageWithLoader from './ImageWithLoader';

const rawFeatures = [
  { name: 'Jupyter AI', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800', code: 'AI-01', desc: 'Chat to find your card.' },
  { name: 'Jupyter+', img: 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?auto=format&fit=crop&q=80&w=800', code: 'EXT-01', desc: 'Browser extension for shopping.' },
  { name: 'Voucher Hub', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800', code: 'SAV-01', desc: 'Save on 500+ brands.' },
  { name: 'NPA Settlement', img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800', code: 'FIN-01', desc: 'Help with card debt.' },
  { name: 'Bill Pay', img: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800', code: 'PAY-01', desc: 'Pay all your bills easily.' },
];

const SETS = 5;
const features = Array(SETS).fill(rawFeatures).flat();

const Neighborhoods: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => setIsInView(entry.isIntersecting),
        { threshold: 0 }
    );
    if (scrollContainerRef.current) {
        observer.observe(scrollContainerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const initScroll = () => {
       if (cardRefs.current[0]) {
           const cardWidth = cardRefs.current[0].offsetWidth;
           let gap = 48;
           if (cardRefs.current[1]) {
               gap = cardRefs.current[1].offsetLeft - (cardRefs.current[0].offsetLeft + cardWidth);
           }
           const setWidth = rawFeatures.length * (cardWidth + gap);
           const centerSetIndex = Math.floor(SETS / 2);
           const initialX = setWidth * centerSetIndex;
           const viewportWidth = container.clientWidth;
           const startOffset = initialX - (viewportWidth / 2) + (cardWidth / 2);
           container.scrollLeft = startOffset;
       }
    };
    
    setTimeout(initScroll, 100);

    let animationFrameId: number;
    
    const update = () => {
      if (!container || !isInView) return;

      const cardElement = cardRefs.current[0];
      if (!cardElement) {
          animationFrameId = requestAnimationFrame(update);
          return;
      }

      const cardWidth = cardElement.offsetWidth;
      let gap = 24;
      if (cardRefs.current[1]) {
          gap = cardRefs.current[1].offsetLeft - (cardElement.offsetLeft + cardWidth);
      }
      
      const totalItemWidth = cardWidth + gap;
      const setWidth = rawFeatures.length * totalItemWidth;
      const currentScroll = container.scrollLeft;
      const viewportCenter = currentScroll + (container.clientWidth / 2);
      const totalWidth = container.scrollWidth;
      
      if (currentScroll >= totalWidth - setWidth - 100) {
         container.scrollLeft = currentScroll - setWidth;
      }
      else if (currentScroll <= setWidth - 100) {
         container.scrollLeft = currentScroll + setWidth;
      }

      cardRefs.current.forEach((card) => {
        if (!card) return;
        const cardCenter = card.offsetLeft + (cardWidth / 2);
        const distance = Math.abs(viewportCenter - cardCenter);
        const range = cardWidth * 1.2;
        let scale = 0.9;
        let opacity = 0.5;
        let zIndex = 0;
        let brightness = 0.9;

        if (distance < range) {
            const normalized = Math.min(distance / range, 1);
            const ease = 1 - Math.pow(normalized, 2); 
            scale = 0.9 + (ease * 0.15); 
            opacity = 0.5 + (ease * 0.5);
            zIndex = Math.round(ease * 10);
            brightness = 0.9 + (ease * 0.1);
        }

        card.style.transform = `scale(${scale})`;
        card.style.opacity = `${opacity}`;
        card.style.zIndex = `${zIndex}`;
        card.style.filter = `brightness(${brightness})`;
      });

      animationFrameId = requestAnimationFrame(update);
    };

    if (isInView) {
        animationFrameId = requestAnimationFrame(update);
    }
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView]);

  const scrollByAmount = (direction: number) => {
      if (scrollContainerRef.current && cardRefs.current[0]) {
          const cardWidth = cardRefs.current[0].offsetWidth;
          const gap = window.innerWidth < 768 ? 24 : 48; 
          const scrollAmount = cardWidth + gap;
          scrollContainerRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
      }
  };

  return (
    <section className="py-24 bg-white overflow-hidden border-t border-black/10">
      <div className="w-full">
        <div className="text-center mb-16 px-4">
          <div className="inline-block mb-6 px-4 py-1 border border-black/20 bg-black/5 text-xs font-bold tracking-[0.3em] uppercase text-black/60 rounded-full">
             Our Features
          </div>
          <h2 className="text-3xl md:text-4xl mb-4 text-black font-serif tracking-tight leading-none">
            Everything <br />
            <span className="italic text-black/50">You Need.</span>
          </h2>
        </div>

        <div className="relative w-full">
            <div 
                ref={scrollContainerRef}
                className="flex items-center gap-6 md:gap-12 overflow-x-auto no-scrollbar py-8 md:py-12 cursor-grab active:cursor-grabbing"
                style={{ paddingLeft: '50vw', paddingRight: '50vw' }}
            >
            {features.map((feature, idx) => (
                <div 
                    key={`${feature.name}-${idx}`} 
                    ref={el => { cardRefs.current[idx] = el; }}
                    className="shrink-0 relative transition-all duration-100 ease-out will-change-transform"
                    style={{ width: '75vw', maxWidth: '360px' }}
                >
                    {/* Slide Mount Design */}
                    <div className="w-full aspect-[3/4] bg-white p-4 shadow-xl transform rotate-1 group hover:rotate-0 transition-transform duration-500 border border-black/20">
                        <div className="w-full h-full relative border border-gray-300 flex flex-col">
                            
                            {/* Image Area */}
                            <div className="relative flex-1 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 bg-gray-100">
                                <ImageWithLoader 
                                    src={feature.img} 
                                    alt={feature.name} 
                                    className="w-full h-full object-cover"
                                    loading="lazy" 
                                />
                                {/* Glass Badge */}
                                <div className="absolute top-2 left-2 glass-panel text-black px-2 py-0.5 text-[8px] font-mono uppercase tracking-widest rounded-sm backdrop-blur-sm">
                                    {feature.code}
                                </div>
                            </div>

                            {/* Label Area */}
                            <div className="h-[25%] flex items-center justify-between px-4 bg-white border-t border-black/5">
                                 <div>
                                     <h3 className="text-xl font-serif text-black leading-none mb-2">{feature.name}</h3>
                                     <p className="text-xs text-black/60 font-mono uppercase tracking-widest flex items-center gap-1">
                                         {feature.desc}
                                     </p>
                                 </div>
                                 <div className="w-8 h-8 border border-black/10 rounded-full flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors cursor-pointer">
                                     <ArrowUpRight size={14} />
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>

        <div className="flex justify-center gap-6 mt-12">
            <button 
                onClick={() => scrollByAmount(-1)}
                className="w-14 h-14 border border-black/10 hover:bg-black hover:text-white flex items-center justify-center transition-all duration-300 text-black rounded-full"
            >
                <ChevronLeft size={20} />
            </button>
            <button 
                onClick={() => scrollByAmount(1)}
                className="w-14 h-14 border border-black/10 hover:bg-black hover:text-white flex items-center justify-center transition-all duration-300 text-black rounded-full"
            >
                <ChevronRight size={20} />
            </button>
        </div>

      </div>
    </section>
  );
};

export default Neighborhoods;