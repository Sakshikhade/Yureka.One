import React, { useRef } from 'react';
import { OSFeature } from '../types';
import { Map, ChevronLeft, ChevronRight, Bell, ArrowUpRight } from 'lucide-react';
import ImageWithLoader from './ImageWithLoader';

const upcomingCards: OSFeature[] = [
  { 
    id: 'cs1', 
    name: 'Yureka Extension', 
    issuer: 'Yureka', 
    image: 'https://images.unsplash.com/photo-1613243555988-441166d4d6fd?auto=format&fit=crop&q=80&w=600', 
    rewards_rate: 'Waitlist', 
    annual_fee: 'Invite Only', 
    category: 'Ultra Premium', 
    best_for: 'Founders & CXOs', 
    status: 'coming_soon' 
  },
  { 
    id: 'cs2', 
    name: 'Reward X', 
    issuer: 'Partner Bank', 
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=600', 
    rewards_rate: 'Waitlist', 
    annual_fee: '₹5,000', 
    category: 'Travel', 
    best_for: 'Global Nomads', 
    status: 'coming_soon' 
  },
  { 
    id: 'cs3', 
    name: 'YurekaAi', 
    issuer: 'Fintech Co', 
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=600', 
    rewards_rate: 'Waitlist', 
    annual_fee: 'Lifetime Free', 
    category: 'International', 
    best_for: 'Students & Travelers', 
    status: 'coming_soon' 
  },
];

const ComingSoon: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300; 
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-20 md:py-32 bg-cream text-black border-b border-black/10 overflow-hidden">

      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-black/10 pb-8">
            <div className="text-left">
                <div className="inline-block px-3 py-1 mb-4 border border-clay text-xs font-bold tracking-[0.3em] uppercase text-clay">
                    Waitlist Access
                </div>
                <h2 className="text-3xl md:text-4xl mb-4 leading-none tracking-tight font-serif text-black">
                    Secure it before <br />
                    <span className="italic text-black/50">it hits the market.</span>
                </h2>
            </div>
            <div className="hidden md:flex gap-4">
                <button 
                    onClick={() => scroll('left')} 
                    className="w-12 h-12 md:w-14 md:h-14 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                <button 
                    onClick={() => scroll('right')} 
                    className="w-12 h-12 md:w-14 md:h-14 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>

        <div 
            ref={scrollRef} 
            className="flex gap-6 md:gap-8 overflow-x-auto no-scrollbar pb-12 snap-x snap-mandatory scroll-pl-4 md:scroll-pl-0 pr-4 md:pr-0"
        >
            {upcomingCards.map(card => (
                <div 
                    key={card.id} 
                    className="snap-center shrink-0 w-[85vw] max-w-[300px] md:w-[380px] group relative"
                >
                    <div className="border-t border-black/20 pt-4 h-full flex flex-col">
                        <div className="relative aspect-[4/5] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 bg-gray-100 mb-6 border border-black/5">
                            <ImageWithLoader 
                                src={card.image} 
                                alt={card.name} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-0 right-0 bg-clay text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
                                Coming Soon
                            </div>
                        </div>

                        <div className="flex justify-between items-baseline mb-2">
                            <h3 className="text-xl md:text-2xl font-serif leading-none">{card.name}</h3>
                            <span className="text-xs md:text-sm font-mono uppercase text-black/50">{card.issuer}</span>
                        </div>
                        
                        <div className="mt-auto flex justify-between items-center border-t border-black/10 pt-4">
                            <div className="flex gap-2 md:gap-4 text-xs md:text-sm font-bold uppercase tracking-widest text-black/50">
                                <span>{card.category}</span>
                                <span>{card.annual_fee}</span>
                            </div>
                            <button className="text-[10px] md:text-xs font-bold uppercase tracking-widest border border-black px-3 py-1.5 md:px-4 md:py-2 hover:bg-black hover:text-white transition-colors">
                                Notify Me
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            
            <div className="snap-center shrink-0 w-[85vw] max-w-[300px] md:w-[380px] group relative flex flex-col">
                <div className="border-t border-black/20 pt-4 h-full">
                    <div className="border border-black/10 bg-white p-8 md:p-10 text-center h-full min-h-[400px] md:min-h-0 aspect-[4/5] flex flex-col items-center justify-center hover:border-black/30 transition-colors shadow-sm hover:shadow-lg">
                         <Bell size={32} className="text-black mb-6" />
                         <h3 className="text-xl md:text-2xl font-serif mb-4">The Waitlist</h3>
                         <p className="text-black/50 text-base mb-8 max-w-xs mx-auto">Premium cards go fast. Get a text the moment we drop a key.</p>
                         
                         <div className="w-full space-y-4 mt-auto">
                            <input type="email" placeholder="Email Address" className="w-full bg-black/5 border border-black/20 p-3 md:p-4 text-black text-center text-sm focus:outline-none focus:border-black placeholder:text-black/30" />
                            <button className="w-full bg-clay text-white p-3 md:p-4 font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-teal transition-colors">
                                Subscribe
                            </button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default ComingSoon;