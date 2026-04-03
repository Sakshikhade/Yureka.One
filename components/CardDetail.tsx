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

const CardDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [card, setCard] = useState<Card | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
                <div className="text-3xl font-serif italic animate-pulse text-ink/40">Loading Instrument Details...</div>
            </div>
        );
    }

    if (!card) {
        return (
            <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-serif italic text-ink mb-4">Instrument not found</h1>
                <p className="text-ink/60 mb-8 max-w-md">The credit instrument you are looking for may have been delisted or moved.</p>
                <Link to="/cards" className="bg-ink text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px]">
                    Return to Explorer
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream pb-32">
            {/* Sticky Sub-nav */}
            <div className="sticky top-20 z-40 bg-white/40 backdrop-blur-md border-b border-ink/5 px-6 py-4">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                    <Link to="/cards" className="flex items-center gap-2 text-ink/40 hover:text-clay transition-colors group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Back to Gallery</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#overview" className="text-[10px] font-bold uppercase tracking-widest text-ink/60 hover:text-ink">Overview</a>
                        <a href="#benefits" className="text-[10px] font-bold uppercase tracking-widest text-ink/60 hover:text-ink">Benefits</a>
                        <a href="#fees" className="text-[10px] font-bold uppercase tracking-widest text-ink/60 hover:text-ink">Fees</a>
                    </div>
                    <button className="bg-ink text-white px-6 py-2 rounded-full font-bold uppercase tracking-widest text-[9px] hover:bg-clay transition-colors shadow-lg">
                        Apply Now
                    </button>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 pt-20">
                {/* Hero Section */}
                <section id="overview" className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32 items-center">
                    <div className="relative group">
                        {/* 3D-ish Card Presentation */}
                        <div className="absolute inset-0 bg-ink/5 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000"></div>
                        <div className="relative aspect-[1.58/1] rounded-3xl overflow-hidden shadow-2xl transform rotate-[-2deg] group-hover:rotate-0 transition-transform duration-1000 border border-ink/10">
                            <ImageWithLoader 
                                src={card.image} 
                                alt={card.name} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Floating Badges */}
                        <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-3xl shadow-2xl border border-ink/5 animate-fade-in-up">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center">
                                    <Star className="text-clay fill-clay/20" size={24} />
                                </div>
                                <div>
                                    <p className="text-[8px] font-bold text-ink/40 uppercase tracking-widest">Elite Rating</p>
                                    <p className="text-2xl font-serif italic text-ink">{card.elite_rating?.toFixed(1) || card.rating?.toFixed(1) || '4.5'}/5.0</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-clay font-bold">
                                <Landmark size={18} />
                                <span className="text-xs uppercase tracking-[0.4em]">{card.issuer || card.bank}</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter text-ink leading-tight">
                                {card.name}
                            </h1>
                            <p className="text-2xl font-serif text-ink/40 leading-snug max-w-xl">
                                {card.best_for} • {card.category} Portfolio
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 pt-10 border-t border-ink/5">
                            <div className="space-y-2">
                                <p className="text-ink/30 text-[9px] font-bold uppercase tracking-[0.4em]">Annual Fee</p>
                                <p className="text-2xl font-serif italic text-ink">{card.annual_fee}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-ink/30 text-[9px] font-bold uppercase tracking-[0.4em]">Joining Fee</p>
                                <p className="text-2xl font-serif italic text-ink">{card.joining_fee || card.annual_fee}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-10">
                            <button className="bg-ink text-white px-10 py-5 rounded-full font-bold flex items-center justify-center gap-4 transition-all shadow-xl hover:bg-clay text-[10px] uppercase tracking-[0.3em]">
                                Apply Now <ArrowRight size={16} />
                            </button>
                            <button className="bg-white border border-ink/10 text-ink px-10 py-5 rounded-full font-bold flex items-center justify-center gap-4 transition-all hover:bg-ink group text-[10px] uppercase tracking-[0.3em] hover:text-white">
                                Ask Yureka AI <MessageSquareShare size={16} className="text-clay group-hover:text-white" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section id="benefits" className="mb-32">
                    <div className="flex items-end justify-between mb-16 border-b-2 border-ink pb-8">
                        <div>
                            <p className="text-clay text-[10px] font-bold uppercase tracking-[0.5em] mb-4">The Advantage</p>
                            <h2 className="text-5xl font-serif italic tracking-tighter text-ink">Elite Benefits Portfolio</h2>
                        </div>
                        <div className="hidden md:block text-right">
                            <p className="text-ink/30 text-[10px] font-bold uppercase tracking-widest max-w-[200px]">Curated analysis of reward structures and lifestyle perks.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1px bg-ink/10 border border-ink/10 rounded-[3rem] overflow-hidden shadow-2xl">
                        {card.benefit_items && card.benefit_items.length > 0 && card.benefit_items[0].heading ? (
                            card.benefit_items.map((benefit, idx) => (
                                <div key={idx} className="bg-white p-12 hover:bg-cream/40 transition-colors group">
                                    <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center mb-8 border border-ink/5 group-hover:scale-110 transition-transform">
                                        <CheckCircle2 className="text-clay" size={24} />
                                    </div>
                                    <h3 className="text-xl font-serif text-ink leading-tight mb-4">{benefit.heading}</h3>
                                    <p className="text-sm text-ink/40 font-medium italic">{benefit.subheading || 'Premium lifestyle benefit included in the standard portfolio.'}</p>
                                </div>
                            ))
                        ) : card.benefits && card.benefits.length > 0 && card.benefits[0] ? (
                            card.benefits.map((benefit, idx) => (
                                <div key={idx} className="bg-white p-12 hover:bg-cream/40 transition-colors group">
                                    <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center mb-8 border border-ink/5 group-hover:scale-110 transition-transform">
                                        <CheckCircle2 className="text-clay" size={24} />
                                    </div>
                                    <h3 className="text-xl font-serif text-ink leading-tight mb-4">{benefit}</h3>
                                    <p className="text-sm text-ink/40 font-medium italic">Premium lifestyle benefit included in the standard portfolio.</p>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center bg-white">
                                <Info className="mx-auto text-ink/10 mb-6" size={48} />
                                <p className="text-ink/40 font-serif italic">Benefit breakdown currently under audit.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* The Verdict - Editorial Context */}
                <section className="bg-ink text-white rounded-[4rem] p-12 md:p-24 relative overflow-hidden mb-32 shadow-2xl">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-[-20deg] translate-x-20"></div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-7 space-y-10">
                            <div className="inline-block border border-clay px-4 py-2 rounded-full">
                                <p className="text-clay text-[10px] font-bold uppercase tracking-[0.4em]">Yureka Insights</p>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-serif leading-none italic tracking-tighter">
                                The <span className="text-white/40">Verdict</span>
                            </h2>
                            <p className="text-xl md:text-2xl font-serif text-white/60 leading-relaxed italic border-l-4 border-clay pl-8">
                                "{card.verdict || `The ${card.name} remains a cornerstone of the ${card.issuer || card.bank} ecosystem. While the ${card.annual_fee} fee is significant, the projected savings of ${card.projected_savings || '₹12,000/yr'} creates an undeniable value proposition for high-spend portfolios.`}"
                            </p>
                            <div className="flex items-center gap-6 pt-10">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-2 border-ink bg-cream overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Analyst" />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs font-bold uppercase tracking-widest text-white/40">Verified by Yureka Council</p>
                            </div>
                        </div>
                        <div className="lg:col-span-5 bg-white/10 backdrop-blur-xl p-12 rounded-[3rem] border border-white/10 space-y-8 shadow-inner">
                            <h3 className="text-xs font-bold uppercase tracking-[0.5em] text-clay">Technical Profile</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                    <span className="text-sm font-medium text-white/40 italic uppercase tracking-widest">Reward Rate</span>
                                    <span className="text-xl font-serif italic text-white">{card.rewards_rate || '5% Base'}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                    <span className="text-sm font-medium text-white/40 italic uppercase tracking-widest">Best For</span>
                                    <span className="text-xl font-serif italic text-white">{card.best_for}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                    <span className="text-sm font-medium text-white/40 italic uppercase tracking-widest">Status</span>
                                    <div className="flex items-center gap-2 text-green-400">
                                        <Zap size={14} className="fill-green-400" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Highly Liquid</span>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full bg-white text-ink font-bold py-6 rounded-[2rem] text-[10px] uppercase tracking-[0.4em] hover:bg-clay hover:text-white transition-all shadow-2xl">
                                Request Full Audit
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {/* Floating Action Button for AI */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
                <button className="bg-clay text-white px-10 py-6 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 hover:scale-105 transition-all group backdrop-blur-xl border border-white/10">
                    <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                    <div className="text-left leading-none">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Talk to engine</p>
                        <p className="text-lg font-serif italic">Optimize this instrument</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default CardDetail;
