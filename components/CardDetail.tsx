import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { 
    ArrowLeft, Share2, Star, CheckCircle2, 
    Zap, ExternalLink, ShieldCheck, CreditCard,
    ArrowRight, Clock, Sparkles, ChevronRight,
    TrendingUp, Info, ChevronDown, Landmark, Globe, Trophy
} from 'lucide-react';
import { api, isApiError } from '../lib/api/client';
import { fromApiCard } from '../lib/api/mappers';
import type { Card as ApiCard } from '../lib/api/types';
import { Card } from '../types';
import { supabase } from '../supabase';
import ImageWithLoader from './ImageWithLoader';
import { motion, AnimatePresence } from 'motion/react';
import SEO from './SEO';
import { breadcrumbSchema, financialProductSchema } from '../lib/seo/structuredData';

const CardDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/dashboard');
    const basePath = isDashboard ? '/dashboard' : '';
    
    const [card, setCard] = useState<Card | null>(null);
    const [related, setRelated] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        benefits: true,
        fees: true,
        details: true,
        proscons: true
    });

    useEffect(() => {
        if (!slug) return;
        setIsLoading(true);
        const fetchCard = async () => {
            // Try Java API first
            const res = await api.get<ApiCard>(`/api/v1/cms/cards/${slug}`, { skipAuth: true });
            if (!isApiError(res) && res.data) {
                const data = fromApiCard(res.data);
                setCard(data);
                const allRes = await api.get<ApiCard[]>('/api/v1/cms/cards', { skipAuth: true });
                if (!isApiError(allRes)) {
                    setRelated((allRes.data ?? []).map(fromApiCard).filter(c => c.id !== data.id && c.bank === data.bank).slice(0, 3));
                }
            } else {
                // Java API unavailable — fall back to Supabase direct
                try {
                    const { data: sbCard } = await supabase
                        .from('cards')
                        .select('*')
                        .or(`slug.eq.${slug},id.eq.${slug}`)
                        .eq('status', 'published')
                        .single();
                    if (sbCard) {
                        const data = sbCard as unknown as Card;
                        setCard(data);
                        // Fetch related cards from same bank
                        const { data: sbRelated } = await supabase
                            .from('cards')
                            .select('*')
                            .eq('status', 'published')
                            .eq('bank', data.bank)
                            .neq('id', data.id)
                            .limit(3);
                        setRelated((sbRelated ?? []) as unknown as Card[]);
                    }
                } catch {
                    // card stays null → shows 404 state
                }
            }
            setIsLoading(false);
        };
        fetchCard();
        window.scrollTo(0, 0);
    }, [slug]);

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="space-y-4 text-center">
                    <div className="w-12 h-12 border-2 border-[#00933b]/30 border-t-[#00933b] rounded-full animate-spin mx-auto" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60">Loading Card Review...</p>
                </div>
            </div>
        );
    }

    if (!card) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-clay mb-6">404 Card Not Found</p>
                <h1 className="text-5xl font-sans font-extrabold text-white mb-4 tracking-tight uppercase">Credit Card Not Found</h1>
                <p className="text-white/60 mb-10 max-w-md font-serif italic text-lg leading-relaxed">The credit card you are looking for may have been delisted or archived.</p>
                <Link to={`${basePath}/cards`} className="bg-white text-[#0a0a0a] px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-clay hover:text-white transition-all">
                    Return to Explorer
                </Link>
            </div>
        );
    }

    const updatedOn = card.updated_on || new Date(card.updated_at || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white/90 font-sans selection:bg-clay selection:text-white pb-32">
            <SEO
                title={`${card.name} | Detailed Review & Strategic Analysis`}
                description={card.description || `Comprehensive reward analysis of ${card.name} by ${card.bank}. Rewards, fees, and eligibility data.`}
                image={card.image}
                schema={[
                    breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Cards', path: '/cards' }, { name: card.name, path: `/cards/${card.slug || card.id}` }]),
                    financialProductSchema({ name: card.name, bank: card.bank, slug: card.slug, image: card.image, description: card.description, annualFee: card.annual_fee, joiningFee: card.joining_fee }),
                ]}
            />

            {/* ── TOP NAV ── */}
            <div className="sticky top-[104px] md:top-20 z-[45] bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to={`${basePath}/cards`} className="flex items-center gap-2 text-white/60 hover:text-clay transition-colors group text-[10px] font-bold uppercase tracking-widest">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Card Explorer
                    </Link>
                    <div className="flex items-center gap-4">
                        <button className="text-white/40 hover:text-white transition-colors"><Share2 size={16} /></button>
                        <a href={card.apply_link || "#"} target="_blank" rel="noopener noreferrer" className="bg-clay text-black px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-clay/20">
                            Apply Now
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 pt-12 md:pt-24">
                
                {/* ── HEADER ── */}
                <header className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-clay">{card.bank || card.issuer || 'Prime'}</span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60">Verified Review</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-sans font-extrabold tracking-tighter text-white leading-[0.9] mb-12">
                        {card.name}
                    </h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-white/5">
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/60 mb-2">Last Updated</p>
                            <p className="text-sm font-bold text-white">{updatedOn}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/60 mb-2">Verification Status</p>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-clay" />
                                <p className="text-sm font-bold text-white uppercase tracking-tight">Verified Credit Card</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/60 mb-2">Author</p>
                            <p className="text-sm font-bold text-white">{card.author || 'Yureka Research'}</p>
                        </div>
                    </div>
                </header>

                {/* ── CORE STATS GRID ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
                    {/* Visual Node */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <div className="aspect-[1.58/1] rounded-[2.5rem] bg-white/[0.03] border border-white/5 p-10 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[#00933b]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <ImageWithLoader src={card.image} alt={card.name} className="w-full h-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="bg-white/5 rounded-[2rem] border border-white/5 p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Rating</span>
                                <div className="flex items-center gap-2 text-clay">
                                    <Trophy size={16} />
                                    <span className="text-2xl font-sans font-bold tracking-tight">{card.elite_rating || card.rating || '4.8'}</span>
                                    <span className="text-white/40 text-xs font-bold">/ 5.0</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-clay rounded-full" style={{ width: `${((card.elite_rating || card.rating || 4.8) / 5) * 100}%` }} />
                                </div>
                                <p className="text-[11px] text-white/70 font-serif italic leading-relaxed">
                                    Top 2% of surveyed cards in the {card.category || 'General'} sector based on net yield and usability.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Data Specs */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: 'Annual Fee', value: card.annual_fee ? `₹${String(card.annual_fee).replace(/[^0-9]/g, '')} + GST` : '₹0 + GST', icon: <Landmark size={20} /> },
                            { label: 'Joining Fee', value: card.joining_fee ? `₹${String(card.joining_fee).replace(/[^0-9]/g, '')} + GST` : '₹0 + GST', icon: <CreditCard size={20} /> },
                            { label: 'Rewards Rate', value: card.rewards_rate || 'Accelerated', icon: <Zap size={20} /> },
                            { label: 'Best For', value: card.best_for || 'Lifestyle', icon: <Trophy size={20} /> },
                            { label: 'Projected Savings', value: card.projected_savings || '₹12,000+', icon: <TrendingUp size={20} /> },
                            { label: 'Card Type', value: card.type || 'Premium', icon: <Globe size={20} /> },
                        ].map((spec, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between hover:bg-white/[0.07] transition-all">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-clay mb-6">
                                    {spec.icon}
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60 mb-1">{spec.label}</p>
                                    <p className="text-lg font-bold text-white tracking-tight">{spec.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── ANALYSIS ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32">
                    <div className="lg:col-span-8">
                        <div className="pl-6 border-l-4 border-clay mb-12">
                            <h2 className="text-3xl font-sans font-bold text-white uppercase tracking-tight">Expert Verdict</h2>
                        </div>
                        <div className="prose prose-invert prose-lg max-w-none prose-p:font-serif prose-p:italic prose-p:text-white/90 prose-p:leading-relaxed prose-p:text-xl">
                            <p>{card.description || `The ${card.name} is a high-performance credit card from ${card.bank || 'the issuer'}.`}</p>
                            <p className="mt-6">{card.verdict || card.final_verdict_text}</p>
                        </div>

                        {/* Expandable Sections */}
                        <div className="mt-20 space-y-4">
                            {[
                                { 
                                    id: 'benefits', 
                                    title: 'Rewards & Benefits', 
                                    data: [
                                        ...(Array.isArray(card.grid_benefits) ? card.grid_benefits : []),
                                        ...(Array.isArray(card.benefit_items) ? card.benefit_items.map(b => ({ title: b?.heading || 'Benefit', value: b?.subheading || (typeof b === 'string' ? b : '') })) : []),
                                        ...(Array.isArray(card.cashback_details) ? card.cashback_details.map(c => ({ title: 'Cashback', value: String(c) })) : []),
                                        ...(card.welcome_benefits ? [{ title: 'Welcome Benefits', value: String(card.welcome_benefits) }] : []),
                                        ...(card.intro_offer ? [{ title: 'Intro Offer', value: String(card.intro_offer) }] : [])
                                    ]
                                },
                                { 
                                    id: 'details', 
                                    title: 'Card Details', 
                                    data: [
                                        ...(Array.isArray(card.product_details) ? card.product_details.map((d: any) => ({ title: String(d), value: '' })) : []),
                                        ...(Array.isArray(card.detailed_features) ? card.detailed_features.map(f => ({ title: f?.title || 'Feature', value: f?.content || (typeof f === 'string' ? f : '') })) : [])
                                    ]
                                },
                                { 
                                    id: 'eligibility', 
                                    title: 'Eligibility Criteria', 
                                    data: Array.isArray(card.eligibility_criteria) ? card.eligibility_criteria.map(e => ({ 
                                        title: e?.criteria || 'General Eligibility', 
                                        value: `Salaried: ${e?.salaried || 'N/A'} | Self-Employed: ${e?.self_employed || 'N/A'}` 
                                    })) : [] 
                                },
                                { 
                                    id: 'redemption', 
                                    title: 'Redemption & Value', 
                                    data: Array.isArray(card.redemption_table) ? card.redemption_table.map(r => ({ title: r?.category || 'Category', value: r?.value || '' })) : [] 
                                },
                                { id: 'fees', title: 'Fees & Charges', data: card.grid_fees || [] },
                            ].map((section) => (
                                section.data && Array.isArray(section.data) && section.data.length > 0 && (
                                    <div key={section.id} className="bg-white/5 rounded-[2rem] border border-white/5 overflow-hidden">
                                        <button onClick={() => toggleSection(section.id)} className="w-full px-10 py-8 flex items-center justify-between group">
                                            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-white group-hover:text-clay transition-colors">{section.title}</h3>
                                            <ChevronDown className={`text-white/40 transition-transform duration-500 ${openSections[section.id] ? 'rotate-180' : ''}`} size={20} />
                                        </button>
                                        <AnimatePresence>
                                            {openSections[section.id] && (
                                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                                    <div className="px-10 pb-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                                        {section.data.map((item: any, i: number) => (
                                                            <div key={i} className="space-y-1.5">
                                                                <h4 className="text-[11px] font-bold text-clay uppercase tracking-widest">{item?.title || item || 'Detail'}</h4>
                                                                {item?.value && <p className="text-sm text-white/80 font-serif italic leading-relaxed">{item.value}</p>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>

                    <aside className="lg:col-span-4 space-y-8">
                        {/* Pros/Cons Sidecard */}
                        <div className="bg-white/5 rounded-[2.5rem] border border-white/5 p-10 space-y-12 sticky top-48">
                            <div className="space-y-6">
                                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-clay">Pros</p>
                                <div className="space-y-4">
                                    {(Array.isArray(card.pros) ? card.pros : ['Accelerated rewards', 'LTF Potential', 'Premium Lounge Access']).map((p: any, i: number) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="w-5 h-5 rounded-full bg-clay/20 flex items-center justify-center shrink-0 text-clay"><Sparkles size={10} /></div>
                                            <p className="text-xs font-bold text-white/90 leading-tight">{typeof p === 'string' ? p : p?.title || 'Pros'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-red-500/80">Cons</p>
                                <div className="space-y-4">
                                    {(Array.isArray(card.cons) ? card.cons : ['High interest rate', 'Fee waiver milestone', 'Capped rewards']).map((c: any, i: number) => (
                                        <div key={i} className="flex gap-4 items-start">
                                            <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 text-red-500"><Info size={10} /></div>
                                            <p className="text-xs font-bold text-white/90 leading-tight">{typeof c === 'string' ? c : c?.title || 'Cons'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* ── RELATED ── */}
                {related.length > 0 && (
                    <section className="mt-32 pt-20 border-t border-white/5">
                        <div className="flex items-center gap-4 mb-12">
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Similar Cards</span>
                            <div className="flex-1 h-px bg-white/5" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {related.map(item => (
                                <Link key={item.id} to={`${basePath}/cards/${item.slug || item.id}`} className="group">
                                    <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 hover:bg-white/10 transition-all">
                                        <div className="aspect-[1.58/1] rounded-xl overflow-hidden mb-6 bg-white/5 p-4">
                                            <ImageWithLoader src={item.image} alt="" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <h4 className="text-base font-bold text-white mb-2 group-hover:text-[#00933b] transition-colors">{item.name}</h4>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-white/50">{item.bank}</span>
                                            <ArrowRight size={14} className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── FINAL CTA ── */}
                <div className="mt-48 bg-gradient-to-br from-[#00933b] to-[#00933b] rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L0 20z' fill='%23fff' fill-opacity='1'/%3E%3C/svg%3E")` }} />
                    <div className="relative z-10 max-w-2xl mx-auto space-y-10">
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/80">Final Verdict</p>
                        <h2 className="text-4xl md:text-7xl font-sans font-extrabold text-white leading-[0.9] tracking-tighter">
                            Ready to <br /><span className="text-black/30 italic font-serif font-light">Optimize?</span>
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                            <a href={card.apply_link || "#"} className="bg-white text-black px-12 py-5 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-slate-900 hover:text-white transition-all shadow-2xl">
                                Apply Now
                            </a>
                            <Link to={`${basePath}/join-waitlist`} className="bg-black/10 border border-white/20 text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-white/5 transition-all">
                                Get Early Access
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardDetail;
