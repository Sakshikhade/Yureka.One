import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
    ArrowUpRight, Zap, ShieldCheck, Plane, Search, 
    X, ChevronRight, Star, Landmark, Coffee, Fuel, CreditCard, 
    Hotel, Briefcase, Armchair, Popcorn, Smartphone,
    ChevronDown, Check, ArrowRight, Calculator, TrendingUp, Sparkles
} from 'lucide-react';
import ImageWithLoader from './ImageWithLoader';
import { useSupabase } from './SupabaseProvider';
import { SkeletonCard } from './SkeletonLoaders';
import { motion, AnimatePresence } from 'motion/react';
import SEO from './SEO';

// ─── MASTER LISTS ───
const ALL_BANKS = [
    'HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'Yes Bank', 'RBL', 'Amex',
    'IndusInd', 'BOB', 'SC', 'Indian', 'PNB', 'IDFC', 'Canara', 'HSBC',
    'DBS', 'IDBI', 'AU', 'Equitas', 'CSB', 'Federal', 'SBM', 'South Indian',
    'Utkarsh Bank', 'Suryoday Bank', 'Union Bank', 'Unity SFB', 'DCB',
    'Bank Of India', 'J&K Bank', 'CUB', 'Slice SFB', 'Dhanlaxmi Bank', 'Indian Overseas Bank'
];

const ALL_CATEGORIES = [
    { name: 'Travel', icon: <Plane size={14} /> },
    { name: 'Hotels', icon: <Hotel size={14} /> },
    { name: 'Cashback', icon: <Landmark size={14} /> },
    { name: 'Shopping', icon: <ShoppingBag size={14} /> },
    { name: 'Dining', icon: <Coffee size={14} /> },
    { name: 'Lounge Access', icon: <Armchair size={14} /> },
    { name: 'UPI', icon: <Smartphone size={14} /> },
];

const BANK_LOGOS: Record<string, string> = {
    'HDFC': '/assets/banks/hdfc.png', 'SBI': '/assets/banks/sbi.png', 'Axis': '/assets/banks/axis.png',
    'ICICI': '/assets/banks/icici.png', 'Kotak': '/assets/banks/kotak.png', 'Yes Bank': '/assets/banks/yesbank.png',
    'Amex': '/assets/banks/amex.png', 'IDFC': '/assets/banks/idfc.png', 'HSBC': '/assets/banks/hsbc.png'
};

function ShoppingBag(props: any) { return <Briefcase {...props} />; } // fallback

const CardExplorer: React.FC = () => {
    const { cards: cardsList, isLoading } = useSupabase();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [cardType, setCardType] = useState('All Types');
    const [isBankMenuOpen, setIsBankMenuOpen] = useState(false);
    const [sortBy, setSortBy] = useState<'featured' | 'rewards' | 'fees' | 'rating'>('featured');

    const filteredCards = useMemo(() => {
        let result = cardsList.filter(card => {
            const matchesSearch = (card.name + ' ' + (card.issuer || '')).toLowerCase().includes(searchQuery.toLowerCase());
            const matchesBank = selectedBanks.length === 0 || selectedBanks.some(b => card.issuer?.includes(b) || card.bank?.includes(b));
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.some(c => card.category?.includes(c));
            const matchesType = cardType === 'All Types' || (cardType === 'Premium' && (Number(card.annual_fee?.replace(/[^0-9]/g, '')) > 2000)) || true;
            return matchesSearch && matchesBank && matchesCategory && matchesType;
        });

        switch(sortBy) {
            case 'rewards': return [...result].sort((a, b) => parseFloat(b.rewards_rate?.replace(/[^0-9.]/g, '') || '0') - parseFloat(a.rewards_rate?.replace(/[^0-9.]/g, '') || '0'));
            case 'fees': return [...result].sort((a, b) => parseFloat(a.annual_fee?.replace(/[^0-9.]/g, '') || '0') - parseFloat(b.annual_fee?.replace(/[^0-9.]/g, '') || '0'));
            case 'rating': return [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
            default: return result;
        }
    }, [cardsList, searchQuery, selectedBanks, selectedCategories, cardType, sortBy]);

    if (isLoading && cardsList.length === 0) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] pt-32 px-6">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] pb-32 overflow-x-hidden text-cream selection:bg-[#34d399] selection:text-[#0a0a0a]">
            <SEO title="Card Explorer | Yureka Credit Intelligence" description="Find the absolute best credit cards tailored to your spending habits using our advanced analysis engine." />

            {/* ── HERO ── */}
            <div className="relative pt-24 md:pt-40 pb-20 border-b border-white/5 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c0-16.569-13.431-30-30-30v60c16.569 0 30-13.431 30-30zm0 0c0 16.569 13.431 30 30 30V0c-16.569 0-30 13.431-30 30z' fill='%23fff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }} 
                />
                
                <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#34d399] mb-6">Financial Intelligence</p>
                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-heading font-extrabold text-white leading-[0.9] tracking-tighter mb-8">
                            Deploy the<br /><span className="text-[#34d399] italic font-serif font-light">Analyzer.</span>
                        </h1>
                        <p className="text-white/50 text-base md:text-xl font-serif italic max-w-2xl mx-auto leading-relaxed mb-16">
                            Filtering {cardsList.length} global instruments to find your specific <br className="hidden md:block" /> path to maximum reward yield.
                        </p>
                    </motion.div>

                    {/* ── FILTER BAR ── */}
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-5xl mx-auto">
                        <div className="bg-[#1a1a1a] rounded-[2.5rem] border border-white/10 p-4 flex flex-col lg:flex-row items-stretch lg:items-center gap-2 shadow-2xl">
                            {/* Bank */}
                            <div className="flex-1 px-6 py-3 border-b lg:border-b-0 lg:border-r border-white/5 text-left relative">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1 block">Bank / Issuer</label>
                                <button onClick={() => setIsBankMenuOpen(!isBankMenuOpen)} className="flex items-center justify-between w-full text-white font-bold text-sm outline-none">
                                    <span className="truncate">{selectedBanks.length === 0 ? 'All Banks' : selectedBanks.length === 1 ? selectedBanks[0] : `${selectedBanks.length} Selected`}</span>
                                    <ChevronDown className={`text-white/20 transition-transform ${isBankMenuOpen ? 'rotate-180' : ''}`} size={14} />
                                </button>
                                <AnimatePresence>
                                    {isBankMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsBankMenuOpen(false)} />
                                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute top-full left-0 mt-4 w-72 bg-[#1a1a1a] rounded-3xl shadow-2xl overflow-hidden z-50 border border-white/10"
                                            >
                                                <div className="max-h-80 overflow-y-auto p-2 no-scrollbar">
                                                    {['All Banks', ...ALL_BANKS].map(bank => {
                                                        const isSelected = bank === 'All Banks' ? selectedBanks.length === 0 : selectedBanks.includes(bank);
                                                        return (
                                                            <button key={bank} onClick={() => { if(bank === 'All Banks') { setSelectedBanks([]); setIsBankMenuOpen(false); } else { setSelectedBanks(prev => prev.includes(bank) ? prev.filter(b => b !== bank) : [...prev, bank]); } }}
                                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${isSelected ? 'bg-[#34d399]/10 text-[#34d399]' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                                                            >
                                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center p-1 overflow-hidden shrink-0">
                                                                    {BANK_LOGOS[bank] ? <img src={BANK_LOGOS[bank]} alt="" className="w-full h-full object-contain grayscale opacity-50" /> : <Landmark size={12} />}
                                                                </div>
                                                                <span className="text-[11px] font-bold uppercase tracking-widest">{bank}</span>
                                                                {isSelected && <Check size={12} className="ml-auto" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Category */}
                            <div className="flex-1 px-6 py-3 border-b lg:border-b-0 lg:border-r border-white/5 text-left relative">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1 block">Reward Focus</label>
                                <select value={selectedCategories[0] || 'All Categories'} onChange={(e) => setSelectedCategories(e.target.value === 'All Categories' ? [] : [e.target.value])}
                                    className="bg-transparent text-white text-sm font-bold appearance-none outline-none w-full cursor-pointer pr-8"
                                >
                                    <option className="bg-[#1a1a1a]">All Categories</option>
                                    {ALL_CATEGORIES.map(cat => <option key={cat.name} className="bg-[#1a1a1a]">{cat.name}</option>)}
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={14} />
                            </div>

                            {/* Type */}
                            <div className="flex-1 px-6 py-3 text-left relative">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1 block">Tier Level</label>
                                <select value={cardType} onChange={(e) => setCardType(e.target.value)}
                                    className="bg-transparent text-white text-sm font-bold appearance-none outline-none w-full cursor-pointer pr-8"
                                >
                                    <option className="bg-[#1a1a1a]">All Types</option>
                                    <option className="bg-[#1a1a1a]">Premium</option>
                                    <option className="bg-[#1a1a1a]">Lifestyle</option>
                                    <option className="bg-[#1a1a1a]">Entry-level</option>
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" size={14} />
                            </div>

                            {/* CTA */}
                            <div className="px-4 shrink-0">
                                <button className="w-full lg:w-auto bg-[#34d399] text-[#0a0a0a] px-8 py-4 rounded-3xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-[#34d399]/20 hover:scale-105 transition-all">
                                    Calculate Yield
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── CONTROLS ── */}
            <div className="max-w-[1400px] mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
                    <div className="relative w-full max-w-md group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#34d399] transition-colors" size={18} />
                        <input type="text" placeholder="Search archives..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#34d399] transition-all text-sm text-white"
                        />
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Sort Protocols:</span>
                        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                            {(['featured', 'rewards', 'fees', 'rating'] as const).map((s) => (
                                <button key={s} onClick={() => setSortBy(s)}
                                    className={`px-5 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${sortBy === s ? 'bg-[#34d399] text-[#0a0a0a] shadow-lg' : 'text-white/30 hover:text-white'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── GRID ── */}
                <AnimatePresence mode="popLayout">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCards.map((card, index) => (
                            <motion.div key={card.id} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: (index % 4) * 0.05 }} className="group">
                                <Link to={`/cards/${card.slug || card.id}`} className="block h-full">
                                    <div className="bg-white/5 rounded-[2.5rem] border border-white/5 p-2 h-full flex flex-col hover:border-[#34d399]/30 hover:bg-white/[0.07] transition-all duration-500 group">
                                        <div className="relative aspect-[1.6/1] rounded-[2rem] overflow-hidden mb-6 bg-white/[0.03]">
                                            <ImageWithLoader src={card.image} alt={card.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
                                                <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">{card.issuer || 'Prime'}</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 px-6 pb-6 flex flex-col">
                                            <h3 className="text-lg font-heading font-extrabold text-white leading-tight tracking-tight mb-4 group-hover:text-[#34d399] transition-colors">{card.name}</h3>
                                            
                                            <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-white/5">
                                                <div>
                                                    <p className="text-[8px] font-bold uppercase tracking-widest text-white/20 mb-1">Annual Fee</p>
                                                    <p className="text-xs font-bold text-white">₹{card.annual_fee?.replace(/[^0-9]/g, '') || '0'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-bold uppercase tracking-widest text-white/20 mb-1">Elite Rating</p>
                                                    <p className="text-xs font-bold text-[#34d399]">{card.elite_rating || card.rating || '4.5'}/5</p>
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                                                <div className="space-y-1">
                                                    <p className="text-[8px] font-bold uppercase tracking-widest text-white/20">Projected Yield</p>
                                                    <p className="text-xl font-heading font-extrabold text-white tracking-tighter">
                                                        {card.projected_savings || '—'} <span className="text-[9px] font-serif italic text-white/20 lowercase">/yr</span>
                                                    </p>
                                                </div>
                                                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-[#34d399] group-hover:text-[#0a0a0a] transition-all">
                                                    <ArrowRight size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>

                {filteredCards.length === 0 && (
                    <div className="text-center py-48">
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20 italic">No instruments found matching criteria</p>
                        <button onClick={() => { setSelectedBanks([]); setSelectedCategories([]); setSearchQuery(''); setCardType('All Types'); }}
                            className="mt-8 text-[#34d399] text-[11px] font-bold uppercase tracking-widest hover:underline">Reset Protocols</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardExplorer;
