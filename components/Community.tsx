import React, { useState, useEffect, useRef } from 'react';
import { getReviews } from '../services/supabaseService';
import { Review } from '../types';
import { Star, Quote, Apple, Play, CheckCircle } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import ImageWithLoader from './ImageWithLoader';

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

const Community: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
      target: sectionRef,
      offset: ["start end", "end start"]
  });

  const featuredScale = useTransform(scrollYProgress, [0, 0.4], [0.9, 1]);
  const featuredOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  useEffect(() => {
    const unsubscribe = getReviews((data) => {
      setReviews(data.length > 0 ? data : fallbackReviews);
    });
    return () => { if (typeof unsubscribe === 'function') unsubscribe(); };
  }, []);

  const featured = reviews.find(r => r.featured) || fallbackReviews[0];
  const regular = reviews.filter(r => r !== featured);

  return (
    <section ref={sectionRef} className="bg-[#FAF9F6] pt-12 pb-32 md:pb-48 overflow-hidden">
        
        {/* ─── POLAROID HERO SHOWCASE (IMAGE 1) ─── */}
        <div className="max-w-[1400px] mx-auto px-6 mb-32 relative">
            <motion.div 
                style={{ scale: featuredScale, opacity: featuredOpacity }}
                className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-1px relative z-10"
            >
                {/* Image Card (Polaroid Left) */}
                <motion.div 
                    initial={{ rotate: -4, x: -50, opacity: 0 }}
                    whileInView={{ rotate: -2, x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-cream p-4 pb-8 w-full md:w-[380px] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.15)] border border-black/[0.05] relative z-20"
                >
                    <div className="aspect-[4/5] bg-gray-200 overflow-hidden grayscale contrast-125 mb-6 border border-black/5">
                        <ImageWithLoader 
                            src={featured.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'} 
                            alt={featured.author} 
                            className="w-full h-full object-cover mix-blend-multiply" 
                        />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-serif font-black text-[#242424]">{featured.author}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#242424]/30 mt-1">{featured.role}</p>
                    </div>
                </motion.div>

                {/* Quote Card (Polaroid Right) */}
                <motion.div 
                    initial={{ rotate: 2, x: 50, opacity: 0 }}
                    whileInView={{ rotate: 1, x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-12 md:p-20 w-full md:w-[600px] shadow-[20px_40px_80px_-20px_rgba(0,0,0,0.1)] border border-black/[0.03] flex flex-col justify-center min-h-[400px] relative mt-[-20px] md:mt-0 md:ml-[-20px] z-10"
                >
                    <Quote className="text-[#242424]/10 absolute top-12 left-12" size={80} />
                    <div className="space-y-12 relative z-10">
                        <p className="text-3xl md:text-5xl font-heading font-black text-[#242424] tracking-tighter leading-tight italic">
                            "{featured.quote}"
                        </p>
                        <div className="pt-8 border-t border-[#242424]/5 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#242424]/20">From the desk of</span>
                            <span className="text-2xl font-serif italic font-medium text-[#242424]">{featured.company}</span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>

        {/* ─── REAL STORIES GRID (IMAGE 2) ─── */}
        <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center mb-24 space-y-4">
                <div className="inline-flex items-center gap-2 bg-[#047857]/5 px-6 py-2 rounded-full border border-[#047857]/10 text-[#047857] text-[10px] font-black uppercase tracking-[0.4em]">
                    <CheckCircle size={14} /> Social Validation
                </div>
                <h2 className="text-5xl md:text-8xl font-heading font-black tracking-tighter text-[#242424] leading-none uppercase">
                    Real Stories, <br />
                    <span className="text-[#047857] italic serif font-light lowercase">Real</span> Trust
                </h2>
            </div>

            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
                {regular.map((review, idx) => (
                    <div key={review.id || idx} className="break-inside-avoid">
                        <AppStoreCard review={review} />
                    </div>
                ))}
            </div>

            <div className="mt-24 text-center">
                <button className="bg-[#242424] text-white px-12 py-6 rounded-full text-xs font-bold uppercase tracking-[0.4em] shadow-2xl hover:bg-[#047857] hover:scale-105 transition-all active:scale-95">
                    Share Your Journey →
                </button>
            </div>
        </div>
    </section>
  );
};

export default Community;