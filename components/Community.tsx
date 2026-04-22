import React, { useState, useEffect, useRef } from 'react';
import { getReviews } from '../services/supabaseService';
import { Review } from '../types';
import { Star, Quote, Apple, Play, CheckCircle } from 'lucide-react';
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
      message: "Highly recommend 👍",
      created_at: '2025-06-18T00:00:00Z'
  },
  {
    author: "AB BABY 13",
    role: 'User',
    company: 'App Store',
    avatar: 'https://i.pravatar.cc/100?u=abbaby',
    quote: "Using it for some time now. Processing fee is waived off again. That was the USP. So happy to use for card payment.",
    rating: 5,
    source: 'App Store',
    created_at: '2025-04-23T00:00:00Z'
  }
];

const AppStoreCard: React.FC<{ review: Review }> = ({ review }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] border border-black/[0.03] space-y-4 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 group"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-cream grayscale border border-black/5">
                        <img src={review.avatar || `https://ui-avatars.com/api/?name=${review.author}&background=random`} alt={review.author} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <h4 className="text-[14px] font-bold text-[#242424] uppercase tracking-wider">{review.author}</h4>
                        <div className="flex items-center gap-1 text-[#242424]/40 text-[10px] uppercase font-bold tracking-widest mt-0.5">
                             <span>{review.source || 'Verified User'}</span>
                             {review.source && (
                                 review.source === 'App Store' ? <Apple size={10} className="fill-current" /> : <Play size={10} className="fill-current" />
                             )}
                        </div>
                    </div>
                </div>
                <div className="w-8 h-8 bg-cream rounded-xl flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                    {review.source === 'App Store' ? <Apple size={16} /> : <Play size={16} />}
                </div>
            </div>

            <div className="flex items-center gap-1 py-1">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className={`${i < (review.rating || 5) ? 'text-[#047857] fill-[#047857]' : 'text-gray-200'}`} />
                ))}
                <span className="text-[10px] font-bold text-[#242424]/40 ml-2 uppercase tracking-widest">
                    {new Date(review.created_at || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
            </div>

            <p className="text-[15px] text-[#242424]/70 leading-relaxed font-sans">
                {review.quote}
            </p>
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
    const unsubscribe = getReviews((data) => {
      setReviews(data.length > 0 ? data : fallbackReviews);
    });
    return () => { if (typeof unsubscribe === 'function') unsubscribe(); };
  }, []);

  const featured = reviews.find(r => r.featured) || fallbackReviews[0];
  const regular = reviews.filter(r => r !== featured);
  
  // Distribute regular reviews into 3 columns
  const col1 = regular.filter((_, i) => i % 3 === 0);
  const col2 = regular.filter((_, i) => i % 3 === 1);
  const col3 = regular.filter((_, i) => i % 3 === 2);

  return (
    <section ref={sectionRef} className="bg-[#FAF9F6] pt-12 pb-32 md:pb-48 overflow-hidden">
        
        {/* ─── TRI-STREAM MARQUEE GRID (IMAGE 3) ─── */}
        <div className="w-full px-6 md:px-12">
            <div className="text-center mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 bg-[#047857]/5 px-6 py-2 rounded-full border border-[#047857]/10 text-[#047857] text-[10px] font-black uppercase tracking-[0.4em]">
                    <CheckCircle size={14} /> Social Validation
                </div>
                <h2 className="text-5xl md:text-8xl font-heading font-black tracking-tighter text-[#242424] leading-none uppercase">
                    Real Stories, <br />
                    <span className="text-[#047857] italic serif font-light lowercase">Real</span> Trust
                </h2>
            </div>

            {/* 5-Column Display */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start max-w-[1600px] mx-auto">
                {/* Column 1: Empty */}
                <div className="hidden md:block" />

                {/* Column 2: Upwards (Faster) */}
                <InfiniteColumn reviews={col1} speed={35} reverse={false} />

                {/* Column 3: Downwards (Slightly slower for parallax effect) */}
                <InfiniteColumn reviews={col2} speed={45} reverse={true} />

                {/* Column 4: Upwards (Medium) */}
                <InfiniteColumn reviews={col3} speed={40} reverse={false} />

                {/* Column 5: Empty */}
                <div className="hidden md:block" />
            </div>

            <div className="mt-16 text-center">
                <button className="bg-[#242424] text-white px-12 py-6 rounded-full text-xs font-bold uppercase tracking-[0.4em] shadow-2xl hover:bg-[#047857] hover:scale-105 transition-all active:scale-95">
                    Share Your Journey →
                </button>
            </div>
        </div>
    </section>
  );
};

export default Community;