import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    ArrowLeft, Share2, MessageSquareShare, Star, CheckCircle2, 
    Zap, Info, ExternalLink, ShieldCheck, CreditCard, Landmark,
    ArrowRight, Bookmark, Clock, Sparkles
} from 'lucide-react';
import { getCardBySlug } from '../services/supabaseService';
import { Card } from '../types';
import ImageWithLoader from './ImageWithLoader';
import { motion } from 'motion/react';

import SEO from './SEO';

const CardDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [card, setCard] = useState<Card | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const cardSchema = card ? {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      "name": card.name,
      "description": card.description,
      "brand": {
        "@type": "Brand",
        "name": card.issuer || card.bank
      },
      "category": card.category || card.type,
      "feesAndCommissionsSpecification": `Annual Fee: ${card.annualFee || card.annual_fee || 'N/A'}`
    } : undefined;


    useEffect(() => {
        if (!slug) return;
        const fetchCard = async () => {
            const data = await getCardBySlug(slug);
            setCard(data);
            setIsLoading(false);
        };
        fetchCard();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-3xl font-serif italic animate-pulse text-[#242424]/40">Loading Instrument Details...</div>
            </div>
        );
    }

    if (!card) {
        return (
            <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-serif italic text-[#242424] mb-4">Instrument not found</h1>
                <p className="text-[#242424]/60 mb-8 max-w-md">The credit instrument you are looking for may have been delisted or moved.</p>
                <Link to="/cards" className="bg-[#242424] text-cream px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px]">
                    Return to Explorer
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F2EFE9] pb-32 font-serif overflow-x-hidden">
            <SEO 
                title={`${card.name} | Instrument Analysis`}
                description={card.description || `Detailed review and rewards breakdown for the ${card.name} by ${card.bank || card.issuer}.`}
                schema={cardSchema}
            />
            {/* Sticky Sub-nav */}

            <div className="sticky top-[80px] md:top-[96px] z-40 bg-cream/80 backdrop-blur-md border-b border-ink/5 px-6 py-3 md:py-4">

                <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                    <Link to="/cards" className="flex items-center gap-2 text-[#242424]/40 hover:text-[#047857] transition-colors group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Back to Gallery</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#overview" className="text-[10px] font-bold uppercase tracking-widest text-[#242424]/60 hover:text-[#242424]">Overview</a>
                        <a href="#benefits" className="text-[10px] font-bold uppercase tracking-widest text-[#242424]/60 hover:text-[#242424]">Benefits</a>
                        <a href="#fees" className="text-[10px] font-bold uppercase tracking-widest text-[#242424]/60 hover:text-[#242424]">Fees</a>
                    </div>
                    {card.apply_link ? (
                        <a href={card.apply_link} target="_blank" rel="noopener noreferrer" className="bg-[#242424] text-cream px-6 py-2 rounded-full font-bold uppercase tracking-widest text-[9px] hover:bg-[#047857] transition-colors shadow-lg block">
                            Apply Now
                        </a>
                    ) : (
                        <button className="bg-[#242424] text-cream px-6 py-2 rounded-full font-bold uppercase tracking-widest text-[9px] hover:bg-[#047857] transition-colors shadow-lg">
                            Apply Now
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 pt-12 md:pt-20">

                {/* Hero Section */}
                <section id="overview" className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-32 items-center">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-[#047857]/5 blur-[120px] rounded-full scale-125 group-hover:scale-150 transition-transform duration-1000 opacity-50"></div>
                        <motion.div 
                            whileHover={{ 
                                rotateY: 5, 
                                rotateX: -5,
                                scale: 1.05
                            }}
                            style={{ perspective: 1500 }}
                            className="relative aspect-[1.58/1] rounded-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(36,36,36,0.25)] transition-all duration-700 border border-ink/5 bg-cream"
                        >
                            <ImageWithLoader 
                                src={card.image} 
                                alt={card.name} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                        </motion.div>
                        {/* Floating Badges */}
                        <div className="absolute -bottom-8 -right-8 bg-cream p-6 rounded-3xl shadow-2xl border border-ink/5 animate-fade-in-up">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center">
                                    <Star className="text-[#047857] fill-clay/20" size={24} />
                                </div>
                                <div>
                                    <p className="text-[8px] font-bold text-[#242424]/40 uppercase tracking-widest">Elite Rating</p>
                                    <p className="text-2xl font-serif italic text-[#242424]">{card.elite_rating?.toFixed(1) || card.rating?.toFixed(1) || '4.5'}/5.0</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-[#047857] font-bold">
                                <Landmark size={18} />
                                <span className="text-xs uppercase tracking-[0.4em]">{card.issuer || card.bank}</span>
                            </div>
                             <h1 className="text-3xl sm:text-6xl md:text-7xl font-heading font-extrabold tracking-tighter text-ink leading-[1.1] break-words">
                                 {card.name}
                             </h1>
                            <p className="text-lg md:text-2xl font-sans font-medium text-[#242424]/40 leading-snug max-w-xl">
                                {card.best_for} • {card.category} Portfolio
                            </p>

                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-10 border-t border-ink/5">
                            <div className="space-y-2">
                                <p className="text-[#242424] text-[11px] font-bold uppercase tracking-[0.3em]">Annual Fee</p>
                                 <p className="text-2xl font-heading font-extrabold text-ink">₹{String(card.annual_fee).replace(/^₹/, '')}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[#242424] text-[11px] font-bold uppercase tracking-[0.3em]">Joining Fee</p>
                                 <p className="text-2xl font-heading font-extrabold text-ink">₹{String(card.joining_fee || card.annual_fee).replace(/^₹/, '')}</p>
                            </div>

                        </div>

                        <div className="flex flex-wrap gap-4 pt-10">
                            {card.apply_link ? (
                                <a href={card.apply_link} target="_blank" rel="noopener noreferrer" className="bg-[#242424] text-cream px-10 py-5 rounded-full font-bold flex items-center justify-center gap-4 transition-all shadow-xl hover:bg-[#047857] text-[10px] uppercase tracking-[0.3em]">
                                    Apply Now <ArrowRight size={16} />
                                </a>
                            ) : (
                                <button className="bg-[#242424] text-cream px-10 py-5 rounded-full font-bold flex items-center justify-center gap-4 transition-all shadow-xl hover:bg-[#047857] text-[10px] uppercase tracking-[0.3em]">
                                    Apply Now <ArrowRight size={16} />
                                </button>
                            )}
                            <button className="bg-cream border border-ink/10 text-[#242424] px-10 py-5 rounded-full font-bold flex items-center justify-center gap-4 transition-all hover:bg-[#242424] group text-[10px] uppercase tracking-[0.3em] hover:text-cream">
                                Ask Yureka AI <MessageSquareShare size={16} className="text-[#047857] group-hover:text-cream" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section id="benefits" className="mb-32">
                    <div className="flex items-end justify-between mb-16 border-b-2 border-ink pb-8">
                         <div>
                            <p className="text-[#047857] text-[10px] font-bold uppercase tracking-[0.5em] mb-4">The Advantage</p>
                             <h2 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tighter text-ink uppercase">Elite Benefits Portfolio</h2>
                        </div>

                        <div className="hidden md:block text-right">
                            <p className="text-[#242424]/30 text-[10px] font-bold uppercase tracking-widest max-w-[200px]">Curated analysis of reward structures and lifestyle perks.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1px bg-ink/10 border border-ink/10 rounded-[3rem] overflow-hidden shadow-2xl">
                        {card.benefit_items && card.benefit_items.length > 0 && card.benefit_items[0].heading ? (
                            card.benefit_items.map((benefit, idx) => (
                                <div key={idx} className="bg-cream p-8 md:p-10 hover:bg-cream/40 transition-colors group">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-cream rounded-2xl flex items-center justify-center mb-6 md:mb-8 border border-ink/5 group-hover:scale-110 transition-transform">
                                        <CheckCircle2 className="text-teal" size={20} />
                                    </div>
                                     <h3 className="text-xs font-bold text-ink/40 leading-tight mb-2 uppercase tracking-widest">{benefit.heading}</h3>
                                    <p className="text-xl md:text-2xl font-heading font-extrabold text-ink uppercase tracking-tight">{benefit.subheading}</p>
                                </div>


                            ))
                        ) : card.benefits && card.benefits.length > 0 && card.benefits[0] ? (
                            card.benefits.map((benefit, idx) => (
                                <div key={idx} className="bg-cream p-8 md:p-10 hover:bg-cream/40 transition-colors group">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-cream rounded-2xl flex items-center justify-center mb-6 md:mb-8 border border-ink/5 group-hover:scale-110 transition-transform">
                                        <CheckCircle2 className="text-teal" size={20} />
                                    </div>
                                    <h3 className="text-xs font-bold text-ink/40 leading-tight mb-2 uppercase tracking-widest">{benefit}</h3>
                                    <p className="text-xl md:text-2xl font-heading font-extrabold text-ink uppercase tracking-tight italic">Premium Feature</p>
                                </div>

                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center bg-cream">
                                <Info className="mx-auto text-[#242424]/10 mb-6" size={48} />
                                <p className="text-[#242424]/40 font-sans">Benefit breakdown currently under audit.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* The Verdict - Editorial Context */}
                <section className="bg-[#242424] text-cream rounded-[4rem] p-12 md:p-24 relative overflow-hidden mb-32 shadow-2xl">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-cream/5 skew-x-[-20deg] translate-x-20"></div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-7 space-y-10">
                            <div className="inline-block border border-clay px-4 py-2 rounded-full">
                                <p className="text-[#047857] text-[10px] font-bold uppercase tracking-[0.4em]">Yureka Insights</p>
                            </div>
                             <h2 className="text-3xl md:text-6xl font-heading font-extrabold leading-none tracking-tighter uppercase">
                                 The <span className="text-ink/30">Verdict</span>
                              </h2>
                             <p className="text-xl md:text-2xl font-sans font-semibold text-ink/70 leading-relaxed italic border-l-4 border-clay pl-8">
                                "{card.verdict
                                    ? card.verdict
                                    : `The ${card.name} remains a cornerstone of the ${card.issuer || card.bank} ecosystem. While the ${card.annual_fee} fee is significant, the projected savings of ${card.projected_savings || '₹12,000/yr'} creates an undeniable value proposition for high-spend portfolios.`
                                }"
                             </p>

                            <div className="flex items-center gap-6 pt-10">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 md:w-12 md:h-12 border-2 border-clay/10 bg-cream shadow-xl overflow-hidden rounded-full shrink-0">
                                            <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt={`Analysis specialist ${i+1}`} loading="lazy" />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs font-bold uppercase tracking-widest text-cream/40">Verified by Yureka Council</p>
                            </div>
                        </div>
                        <div className="lg:col-span-5 bg-cream/10 backdrop-blur-xl p-12 rounded-[3rem] border border-cream/10 space-y-8 shadow-inner">
                            <h3 className="text-xs font-bold uppercase tracking-[0.5em] text-[#047857]">Technical Profile</h3>
                            <div className="space-y-6">
                                 <div className="flex justify-between items-center border-b border-cream/5 pb-4">
                                    <span className="text-lg font-bold text-cream uppercase tracking-widest">Reward Rate</span>
                                    <span className="text-xl font-heading font-bold text-cream">{card.rewards_rate || '5% Base'}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-cream/5 pb-4">
                                    <span className="text-lg font-bold text-cream uppercase tracking-widest">Best For</span>
                                    <span className="text-xl font-heading font-bold text-cream">{card.best_for}</span>
                                </div>

                                <div className="flex justify-between items-center border-b border-cream/5 pb-4">
                                    <span className="text-lg font-bold text-cream uppercase tracking-widest">Status</span>
                                    <div className="flex items-center gap-2 text-green-400">
                                        <Zap size={14} className="fill-green-400" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Highly Liquid</span>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full bg-cream text-[#242424] font-black py-7 rounded-[2rem] text-sm uppercase tracking-[0.3em] hover:bg-[#047857] hover:text-cream transition-all shadow-2xl">
                                Request Full Audit
                            </button>

                        </div>
                    </div>
                </section>
            </div>


        </div>
    );
};

export default CardDetail;
