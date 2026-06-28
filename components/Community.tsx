import React, { useState, useEffect, useRef } from 'react';
import { api, isApiError } from '../lib/api/client';
import { fromApiReview } from '../lib/api/mappers';
import type { Review as ApiReview } from '../lib/api/types';
import { Review } from '../types';
import { Star, Apple, Play, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion, useScroll } from 'motion/react';

const fallbackReviews: Review[] = [
  {
    author: "Karan",
    role: 'Marketing VP',
    company: 'Zepto',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    quote: "I used the Voucher Hub to stack rewards on my new laptop. 18% savings total. Insane.",
    featured: true,
    rating: 5,
    source: 'Direct'
  },
  {
    author: "Saurav Gangurde",
    role: 'User',
    company: 'Google Play',
    image: '',
    avatar: 'https://i.pravatar.cc/100?u=saurav',
    quote: "The CheQ App is a smart and hassle-free solution for managing and paying your credit card bills in one place. The interface is clean, intuitive, and easy to use.",
    rating: 5,
    source: 'Google Play',
    created_at: '2025-06-24T00:00:00Z'
  },
  {
    author: "Shital Rathod",
    role: 'User',
    company: 'App Store',
    image: '',
    avatar: 'https://i.pravatar.cc/100?u=shital',
    quote: "CheQ app is a great platform for managing and paying credit card bills on time. It's fast, secure, and offers rewards like cashback and vouchers.",
    rating: 5,
    source: 'Google Play',
    created_at: '2025-06-25T00:00:00Z'
  },
  {
      author: "Vignesh V",
      role: 'User',
      company: 'App Store',
      avatar: 'https://i.pravatar.cc/100?u=vignesh',
      quote: "CheQ is a user-friendly credit bill payment app that offers rewards and timely reminders. Earn 1% CheQ Chips on every transaction.",
      rating: 4,
      source: 'Google Play',
      image: '',
      created_at: '2025-06-18T00:00:00Z'
  },
  {
    author: "AB BABY 13",
    role: 'User',
    company: 'App Store',
    avatar: 'https://i.pravatar.cc/100?u=abbaby',
    image: '',
    quote: "Using it for some time now. Processing fee is waived off again. That was the USP. So happy to use for card payment.",
    rating: 5,
    source: 'App Store',
    created_at: '2025-04-23T00:00:00Z'
  }
];

const AppStoreCard: React.FC<{ review: Review }> = ({ review }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative bg-white/[0.03]/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/5 hover:border-clay/30 transition-all duration-700 overflow-hidden"
        >
            {/* Premium Glow Effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-clay/5 blur-[80px] group-hover:bg-clay/10 transition-colors duration-700" />
            
            <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 p-0.5 bg-gradient-to-br from-white/10 to-transparent">
                                <img 
                                    src={review.avatar || `https://ui-avatars.com/api/?name=${review.author}&background=0d0d0d&color=fff&bold=true`} 
                                    alt={review.author} 
                                    className="w-full h-full object-cover rounded-[calc(1rem-2px)] grayscale group-hover:grayscale-0 transition-all duration-700" 
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-clay rounded-full p-1 border-2 border-cream">
                                <CheckCircle size={10} className="text-cream" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <h4 className="text-base font-heading font-black text-white uppercase tracking-tight">{review.author}</h4>
                            </div>
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{review.role || 'Verified Client'}</span>
                        </div>
                    </div>
                    <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-clay/10 group-hover:border-clay/20 transition-all duration-700">
                        {review.source === 'App Store' ? <Apple size={18} className="text-white/40 group-hover:text-clay" /> : <Play size={18} className="text-white/40 group-hover:text-clay" />}
                    </div>
                </div>

                <div className="flex items-center gap-1.5 bg-white/5 w-fit px-3 py-1.5 rounded-full border border-white/5">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className={`${i < (review.rating || 5) ? 'text-clay fill-clay' : 'text-white/10'}`} />
                    ))}
                    <div className="w-px h-2.5 bg-white/10 mx-2" />
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                        {new Date(review.created_at || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </span>
                </div>

                <blockquote className="text-lg font-serif italic text-white/80 leading-snug tracking-tight">
                    "{review.quote}"
                </blockquote>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="h-px w-8 bg-clay/30" />
                    <span className="text-[8px] font-black text-clay uppercase tracking-[0.4em]">Verified Yield</span>
                </div>
            </div>
        </motion.div>
    );
};

const InfiniteColumn: React.FC<{ reviews: Review[]; speed?: number; reverse?: boolean }> = ({ reviews, speed = 30, reverse = false }) => {
    // Duplicate reviews multiple times to ensure seamless infinite flow
    const duplicatedReviews = [...reviews, ...reviews, ...reviews, ...reviews];
    
    return (
        <div className="flex-1 overflow-hidden relative h-[650px] mask-gradient-v py-4">
            <motion.div 
                initial={{ y: reverse ? "-50%" : "0%" }}
                animate={{ y: reverse ? "0%" : "-50%" }}
                transition={{ 
                    duration: speed, 
                    repeat: Infinity, 
                    ease: "linear" 
                }}
                className="flex flex-col gap-6"
            >
                {duplicatedReviews.map((review, idx) => (
                    <div key={`${review.id}-${idx}`} className="px-2 transform transition-transform duration-500 hover:scale-[1.05] cursor-pointer">
                        <AppStoreCard review={review} />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

const Community: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
      target: sectionRef,
      offset: ["start end", "end start"]
  });

  useEffect(() => {
    api.get<ApiReview[]>('/api/v1/cms/reviews', { skipAuth: true }).then(res => {
      if (!isApiError(res)) {
        const mapped = (res.data ?? []).map(fromApiReview);
        setReviews(mapped.length > 0 ? mapped : fallbackReviews);
      }
    });
  }, []);

  const featured = reviews.find(r => r.featured) || fallbackReviews[0];
  const regular = reviews.filter(r => r !== featured);
  
  // Distribute regular reviews into 3 columns
  const col1 = regular.filter((_, i) => i % 3 === 0);
  const col2 = regular.filter((_, i) => i % 3 === 1);
  const col3 = regular.filter((_, i) => i % 3 === 2);

  return (
    <section ref={sectionRef} className="bg-cream pt-12 pb-32 md:pb-48 overflow-hidden relative">
        {/* Subtle Archival Stamp Background */}
        <div className="absolute top-20 right-0 opacity-[0.03] select-none pointer-events-none rotate-90 origin-right">
            <span className="text-[12rem] font-heading font-black tracking-tighter uppercase whitespace-nowrap">VOX POPULI</span>
        </div>
        
        {/* ── TRI-STREAM MARQUEE GRID (IMAGE 3) ── */}
        <div className="w-full relative z-10 text-white">
            <div className="text-center mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 bg-[#00933b]/5 px-6 py-2 rounded-full border border-[#00933b]/10 text-[#00933b] text-[10px] font-black uppercase tracking-[0.4em]">
                    <ShieldCheck size={14} className="animate-pulse" /> Verified Intelligence
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-[clamp(1.5rem,4vw,4.5rem)] font-serif font-black text-white leading-[0.85] uppercase tracking-tighter">
                    Real Stories, <br />
                    <span className="text-[#00933b] italic font-light lowercase">Real</span> Yield.
                </h2>
            </div>

            {/* 3-Stream Display (Syncs with global cols 2-3-4) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start w-full">
                {/* Column 1: Upwards (Faster) */}
                <InfiniteColumn reviews={col1} speed={35} reverse={false} />

                {/* Column 2: Downwards - Hidden on Mobile */}
                <div className="hidden md:block">
                    <InfiniteColumn reviews={col2} speed={45} reverse={true} />
                </div>

                {/* Column 3: Upwards (Medium) - Hidden on Mobile */}
                <div className="hidden md:block">
                    <InfiniteColumn reviews={col3} speed={40} reverse={false} />
                </div>
            </div>

            <div className="mt-16 text-center">
                <button className="bg-[#242424] text-white px-12 py-6 rounded-full text-xs font-bold uppercase tracking-[0.4em] shadow-2xl hover:bg-[#00933b] hover:scale-105 transition-all active:scale-95">
                    Share Your Journey →
                </button>
            </div>
        </div>
    </section>
  );
};

export default Community;