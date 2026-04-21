import React, { useState, useEffect, useRef } from 'react';
import { getReviews } from '../services/supabaseService';
import { Review } from '../types';

const fallbackReviews: Review[] = [
  {
    author: "Paras",
    role: 'Tech Lead',
    company: 'Swiggy',
    company_logo: 'https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    quote: "I thought I knew credit cards, but Yureka found a hidden gem that saves me ₹20k/year on flights.",
    rotation: -2
  },
  {
    author: "Deepankar",
    role: 'Founder',
    company: 'D2C Brand',
    company_logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    quote: "Finally, a platform that doesn't spam me. The AI chat felt like talking to a financial expert.",
    rotation: 1.5
  },
  {
    author: "Riya",
    role: 'Freelance Designer',
    company: 'Self',
    company_logo: 'https://upload.wikimedia.org/wikipedia/en/7/7c/Cred_club_logo.png',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    quote: "The Chrome extension is a game changer. It automatically applies the best card for every transaction.",
    rotation: -1
  },
  {
    author: "Karan",
    role: 'Marketing VP',
    company: 'Zepto',
    company_logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Zepto_Logo.jpg/800px-Zepto_Logo.jpg', 
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    quote: "I used the Voucher Hub to stack rewards on my new laptop. 18% savings total. Insane.",
    rotation: 2
  }
];

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

interface DraggableCardPairProps {
  review: Review;
  index: number;
  progress: number;
  totalCards: number;
}

const DraggableCardPair: React.FC<DraggableCardPairProps> = ({ review, index, progress }) => {
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const pairStart = 0.35 + (index * 0.15);
  const pairDuration = 0.15;
  const pairProgressRaw = (progress - pairStart) / pairDuration;
  const pairProgress = Math.min(1, Math.max(0, pairProgressRaw));
  
  const profileProgressRaw = pairProgress / 0.5;
  const profileProgress = Math.min(1, Math.max(0, profileProgressRaw));
  const profileEase = easeOutCubic(profileProgress);
  
  const quoteProgressRaw = (pairProgress - 0.5) / 0.5;
  const quoteProgress = Math.min(1, Math.max(0, quoteProgressRaw));
  const quoteEase = easeOutCubic(quoteProgress);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const distance = isMobile ? 400 : 1200;

  const profileTranslateX = (1 - profileEase) * -distance; 
  const quoteTranslateX = (1 - quoteEase) * distance;
  const profileOpacity = profileEase;
  const quoteOpacity = quoteEase;
  const wrapperScale = isMobile ? (0.75 + (pairProgress * 0.15)) : (0.85 + (pairProgress * 0.15)); 

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (pairProgress < 0.9) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = { x: clientX - dragPosition.x, y: clientY - dragPosition.y };
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragPosition({
      x: clientX - dragStartRef.current.x,
      y: clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (Math.abs(dragPosition.x) < 100 && Math.abs(dragPosition.y) < 100) {
        setDragPosition({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  const wrapperStyle: React.CSSProperties = {
    transform: `translate3d(${dragPosition.x}px, ${dragPosition.y}px, 0) scale(${wrapperScale}) rotate(${(review.rotation || 0) + (dragPosition.x * 0.05)}deg)`,
    zIndex: index + 10,
    cursor: isDragging ? 'grabbing' : (pairProgress > 0.9 ? 'grab' : 'default'),
    transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
  };

  return (
    <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ perspective: '1000px' }}
    >
        <div 
            className="flex flex-col md:flex-row gap-4 md:gap-8 w-[90%] md:w-auto max-w-[1000px] pointer-events-auto items-center justify-center"
            style={wrapperStyle}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
        >
            {/* Profile Card - Photo ID Style */}
            <div 
                className="bg-cream p-3 w-full md:w-[320px] h-auto shadow-2xl border border-black/10 select-none will-change-transform transform rotate-[-2deg]"
                style={{ 
                    transform: `translate3d(${profileTranslateX}px, 0, 0)`,
                    opacity: profileOpacity,
                    transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease-out' 
                }}
            >
                 <div className="w-full aspect-[4/5] bg-gray-200 overflow-hidden grayscale contrast-125 mb-4 border border-black/10">
                     <img 
                        src={review.image} 
                        alt={review.role}
                        loading="lazy" 
                        className="w-full h-full object-cover mix-blend-multiply" 
                        draggable={false}
                     />
                 </div>
                 <div className="text-center pb-4">
                    <h3 className="text-xl font-serif font-bold text-black">{review.author}</h3>
                    <p className="text-xs font-mono uppercase tracking-widest text-black/50 mt-1">{review.role}</p>
                 </div>
            </div>

            {/* Quote Card - Premium Stationery Style */}
            <div 
                className={`
                    bg-[#F2EFE9] text-black
                    p-8 md:p-16 w-full md:w-[500px] h-auto min-h-[340px]
                    shadow-[15px_15px_40px_rgba(0,0,0,0.15)]
                    border border-black/5
                    flex flex-col items-start justify-center text-left relative select-none will-change-transform transform rotate-[1deg]
                `}
                style={{
                    transform: `translate3d(${quoteTranslateX}px, 0, 0)`,
                    opacity: quoteOpacity,
                    transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease-out'
                }}
            >
                 {/* Premium paper texture overlay */}
                 <div className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")` }}></div>

                 <div className="mb-6 relative z-10">
                    <span className="text-8xl font-serif text-black/10 leading-none absolute -top-8 -left-4">“</span>
                 </div>
                 <p className="text-xl md:text-2xl font-serif text-black leading-snug mb-8 relative z-10 italic">
                     {review.quote}
                 </p>
                 <div className="mt-auto pt-6 border-t border-black/10 w-full relative z-10">
                    <div className="flex items-center gap-2 justify-between w-full">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-black/40">From the desk of</span>
                        <span className="font-serif font-bold text-lg italic text-black">{review.company}</span>
                    </div>
                 </div>
            </div>
        </div>
    </div>
  );
};

const Community: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [liveReviews, setLiveReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Real-time subscription and initial fetch
    const unsubscribe = getReviews((data) => {
      setLiveReviews(data.length > 0 ? data : fallbackReviews);
    });

    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const start = 0;
      const end = height - viewportHeight;
      const current = -top;

      let progress = current / end;
      progress = Math.max(0, Math.min(1, progress));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);
  
  const textAnimEnd = 0.35;
  const textGlobalProgress = Math.min(1, Math.max(0, scrollProgress / textAnimEnd));
  const holdThreshold = 0.2;
  
  let zoomProgress = 0;
  if (textGlobalProgress > holdThreshold) {
      zoomProgress = (textGlobalProgress - holdThreshold) / (1 - holdThreshold);
  }
  
  const easeZoom = easeOutCubic(zoomProgress);
  const textScale = 1 + (easeZoom * 50); 
  
  const fadeStartThreshold = 0.6;
  let opacityVal = 1;
  if (zoomProgress > fadeStartThreshold) {
      const fadeProgress = (zoomProgress - fadeStartThreshold) / (1 - fadeStartThreshold);
      opacityVal = 1 - Math.pow(fadeProgress, 2); 
  }
  
  const textOpacity = Math.max(0, opacityVal);
  const textBlur = (1 - textOpacity) * 20;

  return (
    <section 
        ref={containerRef} 
        className="relative bg-cream my-12 border-y border-black/10"
        style={{ height: '350vh' }} 
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        <div 
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none text-center px-4"
            style={{ 
                opacity: textOpacity,
                transform: `scale(${textScale}) translate3d(0,0,0)`,
                filter: `blur(${textBlur}px)`,
                transformOrigin: 'center center',
                willChange: 'transform, opacity, filter',
                visibility: textOpacity <= 0.01 ? 'hidden' : 'visible'
            }}
        >
            <div className="max-w-[90vw] md:max-w-5xl">
                <span className="text-teal font-mono text-[10px] uppercase tracking-widest mb-4 block">Section 3: Community</span>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-black leading-[1.0] tracking-tight">
                    Join <br />
                    <span className="italic font-light">thousands</span> who <br />
                    actually <span className="italic font-light">earn more.</span>
                </h2>
            </div>
        </div>

        <div className="relative z-30 w-full h-full">
            {liveReviews.map((review, index) => (
                <DraggableCardPair 
                    key={review.id || index}
                    review={review}
                    index={index}
                    progress={scrollProgress}
                    totalCards={liveReviews.length}
                />
            ))}
        </div>
      </div>
    </section>
  );
};

export default Community;