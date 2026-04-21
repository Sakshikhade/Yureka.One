import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { OSFeature } from '../types';
import { MapPin, BedDouble, Copy, ArrowRight, ArrowUpRight, CreditCard as CardIcon } from 'lucide-react';
import ImageWithLoader from './ImageWithLoader';
import { Link } from 'react-router-dom';

export interface HomeCarouselHandle {
  setProgress: (progress: number) => void;
}

interface HomeCarouselProps {
  id?: string;
  cards: OSFeature[];
  title: string;
  subtitle: string;
  className?: string;
  controlled?: boolean;
  initialStyle?: React.CSSProperties;
}

const HomeCarousel = forwardRef<HomeCarouselHandle, HomeCarouselProps>(({ 
  id, 
  cards, 
  title, 
  subtitle, 
  className, 
  controlled = false,
  initialStyle
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  const rotations = [-2, 1, -1, 2, -0.5];
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

  useImperativeHandle(ref, () => ({
    setProgress: (globalProgress: number) => {
      const scrollProgress = Math.max(0, Math.min(1, globalProgress));
      const total = cards.length;
      
      cards.forEach((_, index) => {
          const cardEl = cardsRef.current[index];
          if (!cardEl) return;

          const phaseStart = 0;
          const phaseEnd = 0.85;
          const phaseLength = phaseEnd - phaseStart;
          const step = phaseLength / total;
          const myStart = phaseStart + (index * step);
          const myEnd = myStart + 0.3; 

          let localProgress = (scrollProgress - myStart) / (myEnd - myStart);
          localProgress = Math.max(0, Math.min(1, localProgress));
          const ease = easeOutQuart(localProgress);

          const startX = window.innerWidth < 768 ? 100 : 120; 
          const currentX = startX * (1 - ease);
          const targetRotation = rotations[index % rotations.length];
          const currentRotation = ease * targetRotation;
          
          const opacity = localProgress > 0.01 ? 1 : 0;
          const visibility = scrollProgress < myStart ? 'hidden' : 'visible';

          cardEl.style.transform = `translate3d(${currentX}${window.innerWidth < 768 ? '%' : 'vw'}, 0, 0) rotate(${currentRotation}deg)`;
          cardEl.style.opacity = opacity.toString();
          cardEl.style.visibility = visibility;
      });

      if (ctaRef.current) {
          const start = 0.8;
          const end = 1.0;
          let localProgress = (scrollProgress - start) / (end - start);
          localProgress = Math.max(0, Math.min(1, localProgress));
          const ease = easeOutQuart(localProgress);
          const startX = window.innerWidth < 768 ? 100 : 80; 
          const currentX = startX * (1 - ease);
          const opacity = localProgress > 0.05 ? 1 : 0;
          const visibility = scrollProgress < start ? 'hidden' : 'visible';

          ctaRef.current.style.transform = `translate3d(${currentX}${window.innerWidth < 768 ? '%' : 'vw'}, 0, 0)`;
          ctaRef.current.style.opacity = opacity.toString();
          ctaRef.current.style.visibility = visibility;
      }
    }
  }));

  useEffect(() => {
    if (controlled) return;

    let rafId: number;
    const handleScroll = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const top = container.offsetTop;
      const height = container.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const start = top; 
      const end = top + height - windowHeight;
      
      let progress = (scrollY - start) / (end - start);
      progress = Math.max(0, Math.min(1, progress));
      
      rafId = requestAnimationFrame(() => {
          const total = cards.length;
          cards.forEach((_, index) => {
              const cardEl = cardsRef.current[index];
              if (!cardEl) return;
              const phaseStart = 0; const phaseEnd = 0.85;
              const step = (phaseEnd - phaseStart) / total;
              const myStart = phaseStart + (index * step);
              const myEnd = myStart + 0.3; 
              let p = (progress - myStart) / (myEnd - myStart);
              p = Math.max(0, Math.min(1, p));
              const ease = easeOutQuart(p);
              
              const startX = window.innerWidth < 768 ? 100 : 120;
              cardEl.style.transform = `translate3d(${startX * (1 - ease)}${window.innerWidth < 768 ? '%' : 'vw'}, 0, 0) rotate(${ease * rotations[index % rotations.length]}deg)`;
              cardEl.style.opacity = p > 0.01 ? '1' : '0';
              cardEl.style.visibility = progress < myStart ? 'hidden' : 'visible';
          });
          
          if (ctaRef.current) {
               const start = 0.8; const end = 1.0;
               let p = (progress - start) / (end - start);
               p = Math.max(0, Math.min(1, p));
               const ease = easeOutQuart(p);
               const startX = window.innerWidth < 768 ? 100 : 80;
               ctaRef.current.style.transform = `translate3d(${startX * (1 - ease)}${window.innerWidth < 768 ? '%' : 'vw'}, 0, 0)`;
               ctaRef.current.style.opacity = p > 0.05 ? '1' : '0';
               ctaRef.current.style.visibility = progress < start ? 'hidden' : 'visible';
          }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
        window.removeEventListener('scroll', handleScroll);
        cancelAnimationFrame(rafId);
    };
  }, [controlled, cards.length]);

  const Content = (
    <div className="relative w-full h-full max-w-[1700px] border-y border-ink/10 bg-transparent block will-change-transform">
        <div className="absolute top-0 left-1/4 bottom-0 w-px bg-[#242424]/10 hidden md:block z-0"></div>
        <div className="absolute top-0 right-1/4 bottom-0 w-px bg-[#242424]/10 hidden md:block z-0"></div>

        <div className="relative z-10 w-full h-full grid grid-cols-1 md:grid-cols-12">
            <div className="absolute top-4 sm:top-8 left-0 right-0 z-20 flex flex-col items-center text-center px-6 md:static md:col-span-4 md:flex md:justify-center md:px-12 lg:px-16 md:text-left md:items-start md:z-auto">
                    {/* Glass Island Effect for Content Block */}
                    <div className="relative glass-panel p-6 sm:p-8 rounded-2xl shadow-xl md:p-10 border border-ink/5 max-w-[90vw] sm:max-w-none">
                        <span className="block text-teal text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] mb-2 sm:mb-4">Feature Story</span>
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-[0.9] mb-2 sm:mb-4 font-serif text-[#242424]">
                            {title.split(',')[0]}<br />
                            <span className="font-light italic text-[#242424]/60">{title.split(',')[1] || ''}</span>
                        </h2>
                        <p className="text-[11px] sm:text-sm md:text-base text-[#242424]/60 font-mono max-w-sm leading-relaxed mb-4 sm:mb-8 mx-auto md:mx-0 pl-1">
                            {subtitle}
                        </p>
                        
                        <div className="hidden md:flex items-center gap-3 text-[#242424]/30 text-xs font-bold tracking-widest uppercase">
                            <div className="w-8 h-[1px] bg-[#242424]/30"></div>
                            Fig. 1.0 — Scroll to reveal
                        </div>
                    </div>
            </div>

            <div className="col-span-1 md:col-span-4 relative flex items-center justify-center perspective-1000 mt-16 sm:mt-24 md:mt-0">
                <div className="relative w-[75vw] h-[45vh] sm:w-[80vw] sm:h-[50vh] max-h-[500px] max-w-[340px] md:w-[340px] md:h-[500px] lg:w-[400px] lg:h-[580px]">
                    {cards.map((card, index) => (
                        <div 
                            key={card.id}
                            ref={el => { cardsRef.current[index] = el; }}
                            className="absolute inset-0 w-full h-full will-change-transform"
                            style={{ 
                                transform: 'translate3d(120vw, 0, 0)',
                                opacity: 0,
                                visibility: 'hidden',
                                zIndex: index + 10
                            }}
                        >
                            <div className="w-full h-full bg-cream p-2 shadow-2xl border border-ink/10 relative transition-all duration-300 ease-out hover:scale-[1.01]">
                                <div className="relative h-[60%] overflow-hidden border-b border-ink/10">
                                    <ImageWithLoader 
                                        src={card.image} 
                                        alt={card.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Glass Badge */}
                                    <div className="absolute top-2 right-2 glass-panel text-[#242424] px-3 py-1 text-[9px] uppercase font-bold tracking-widest rounded-full backdrop-blur-md">
                                        {card.issuer}
                                    </div>
                                </div>
                                <div className="flex-1 p-6 flex flex-col justify-between relative bg-cream">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-2xl font-serif text-[#242424] leading-none">{card.name}</h3>
                                            <span className="text-[10px] text-[#242424]/30 font-mono">NO. {index + 1}</span>
                                        </div>
                                        
                                        <p className="text-[#242424]/60 text-sm leading-relaxed font-serif italic line-clamp-3 mt-2">
                                            {card.features[0]}
                                        </p>
                                    </div>
                                    <div className="pt-4 flex items-end justify-between">
                                        <div>
                                            <p className="text-[10px] text-[#242424]/30 uppercase tracking-widest font-bold mb-1">
                                                Rewards Rate
                                            </p>
                                            <h4 className="text-xl font-medium text-[#242424] tracking-tight">
                                                {card.rewards_rate}
                                            </h4>
                                        </div>
                                        <div className="w-8 h-8 bg-[#242424]/5 border border-ink/10 text-[#242424] flex items-center justify-center hover:bg-[#242424] hover:text-cream transition-colors">
                                            <ArrowUpRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-16 sm:bottom-24 left-0 right-0 md:static md:col-span-4 flex items-center justify-center pointer-events-none md:pointer-events-auto">
                <div 
                    ref={ctaRef}
                    className="w-[220px] h-[300px] sm:w-[260px] sm:h-[340px] md:w-[320px] md:h-[400px] will-change-transform pointer-events-auto"
                    style={{ 
                        transform: 'translate3d(100vw, 0, 0)',
                        opacity: 0,
                        visibility: 'hidden',
                        zIndex: 50
                    }}
                >
                        <Link to="/cards" className="block w-full h-full group">
                        <div className="w-full h-full bg-[#047857] flex flex-col items-center justify-center p-6 sm:p-8 text-center shadow-[10px_10px_0px_rgba(0,0,0,0.1)] border border-black/20 transition-all duration-300 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
                            <div className="relative z-10">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-cream text-black rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-md">
                                    <ArrowRight size={20} className="sm:w-[24px] sm:h-[24px]" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-serif text-cream mb-1 sm:mb-2 italic">Browse</h3>
                                <h3 className="text-xl sm:text-2xl font-bold text-cream tracking-tight mb-4 sm:mb-6 uppercase">The<br/>Catalog</h3>
                                <span className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 border border-cream text-cream text-[9px] sm:text-[10px] font-bold tracking-widest uppercase hover:bg-cream hover:text-[#047857] transition-colors">
                                    View Index
                                </span>
                            </div>
                        </div>
                        </Link>
                </div>
            </div>
        </div>
    </div>
  );

  if (controlled) {
      return (
          <div 
            id={id}
            className={`absolute inset-0 w-full h-full flex items-center justify-center p-0 ${className || ''}`}
            style={initialStyle}
          >
              {Content}
          </div>
      )
  }

  return (
    <section 
        id={id}
        ref={containerRef} 
        className={`relative bg-cream ${className || 'mt-16 md:mt-24 lg:mt-32 mb-16 md:mb-24 lg:mb-32'}`} 
        style={{ height: '350vh' }} 
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center p-0">
        {Content}
      </div>
    </section>
  );
});

export default HomeCarousel;