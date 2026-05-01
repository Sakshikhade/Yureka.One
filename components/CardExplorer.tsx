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
    { name: 'Travel', image: '/images/categories/travel.png' },
    { name: 'Hotels', image: '/images/categories/hotel.png' },
    { name: 'Cashback', image: '/images/categories/cashback.png' },
    { name: 'Shopping', image: '/images/categories/shopping.png' },
    { name: 'Dining', image: '/images/categories/dining.png' },
    { name: 'Lounge Access', image: '/images/categories/lounge-access.png' },
    { name: 'UPI', image: '/images/categories/upi.png' },
];

const BANK_LOGOS: Record<string, string> = {
    'HDFC': '/assets/banks/hdfc.png', 'SBI': '/assets/banks/sbi.png', 'Axis': '/assets/banks/axis.png',
    'ICICI': '/assets/banks/icici.png', 'Kotak': '/assets/banks/kotak.png', 'Yes Bank': '/assets/banks/yesbank.png',
    'Amex': '/assets/banks/amex.png', 'IDFC': '/assets/banks/idfc.png', 'HSBC': '/assets/banks/hsbc.png',
    'RBL': '/assets/banks/rbl.png', 'IndusInd': '/assets/banks/indusind.png', 'BOB': '/assets/banks/bob.png',
    'SC': '/assets/banks/sc.png', 'Indian': '/assets/banks/indian.png', 'PNB': '/assets/banks/pnb.png',
    'Canara': '/assets/banks/canara.png', 'DBS': '/assets/banks/dbs.png', 'IDBI': '/assets/banks/idbi.png',
    'AU': '/assets/banks/au.png', 'Equitas': '/assets/banks/equitas.png', 'CSB': '/assets/banks/csb.png',
    'Federal': '/assets/banks/federal.png', 'SBM': '/assets/banks/sbm.png', 'South Indian': '/assets/banks/southindian.png',
    'Utkarsh Bank': '/assets/banks/utkarsh.png', 'Suryoday Bank': '/assets/banks/suryoday.png', 'Union Bank': '/assets/banks/union.png',
    'Unity SFB': '/assets/banks/unity.png', 'DCB': '/assets/banks/dcb.png', 'Bank Of India': '/assets/banks/boi.png',
    'J&K Bank': '/assets/banks/jk.png', 'CUB': '/assets/banks/cub.png', 'Slice SFB': '/assets/banks/slice.png',
    'Dhanlaxmi Bank': '/assets/banks/dhanlaxmi.png', 'Indian Overseas Bank': '/assets/banks/iob.png'
};

function ShoppingBag(props: any) { return <Briefcase {...props} />; } // fallback

const CardExplorer: React.FC = () => {
    const { cards: cardsList, isLoading } = useSupabase();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [cardType, setCardType] = useState('All Types');
    const [isBankMenuOpen, setIsBankMenuOpen] = useState(false);
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);
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
            <div className="min-h-screen bg-cream pt-32 px-6">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream pb-32 overflow-x-hidden text-white/90 selection:bg-clay selection:text-cream">
            <SEO title="Card Explorer | Yureka Credit Intelligence" description="Find the absolute best credit cards tailored to your spending habits using our advanced analysis engine." />

            {/* ── HERO ── */}
            <div className="relative pt-24 md:pt-40 pb-20 border-b border-white/5">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c0-16.569-13.431-30-30-30v60c16.569 0 30-13.431 30-30zm0 0c0 16.569 13.431 30 30 30V0c-16.569 0-30 13.431-30 30z' fill='%23fff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }} 
                />
                
                <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-clay mb-6">Credit Card Intelligence</p>
                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-heading font-extrabold text-white leading-[0.9] tracking-tighter mb-8">
                            Find Your<br /><span className="text-clay italic font-serif font-light">Perfect Card.</span>
                        </h1>
                        <p className="text-white/70 text-base md:text-xl font-serif italic max-w-2xl mx-auto leading-relaxed mb-16">
                            Filtering {cardsList.length} cards to find your specific <br className="hidden md:block" /> path to maximum reward yield.
                        </p>
                    </motion.div>

                    {/* ── FILTER BAR ── */}
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-6xl mx-auto px-4">
                        <div className="bg-cream/60 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-5 flex flex-col lg:flex-row items-stretch lg:items-center gap-3 shadow-2xl relative group/bar">
                            <div className="absolute inset-0 bg-gradient-to-r from-clay/5 to-transparent opacity-0 group-hover/bar:opacity-100 transition-opacity duration-1000 rounded-[3rem]" />
                            
                            {/* Bank */}
                            <div className={`flex-1 px-8 py-4 border-b lg:border-b-0 lg:border-r border-white/5 text-left relative ${isBankMenuOpen ? 'z-50' : 'z-10'}`}>
                                <label className="text-[9px] font-black uppercase tracking-[0.25em] text-white/60 mb-2 block">Select Bank</label>
                                <button onClick={() => { setIsBankMenuOpen(!isBankMenuOpen); setIsCategoryMenuOpen(false); setIsTypeMenuOpen(false); }} className="flex items-center justify-between w-full text-white font-black text-sm outline-none group/btn">
                                    <span className="truncate">{selectedBanks.length === 0 ? 'All Banks' : selectedBanks.length === 1 ? selectedBanks[0] : `${selectedBanks.length} Banks`}</span>
                                    <ChevronDown className={`text-white/40 transition-all duration-500 ${isBankMenuOpen ? 'rotate-180 text-clay' : ''}`} size={16} />
                                </button>
                                <AnimatePresence>
                                    {isBankMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsBankMenuOpen(false)} />
                                            <motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                                className="absolute top-full left-0 mt-6 w-80 bg-cream rounded-[2.5rem] shadow-2xl overflow-hidden z-50 border border-white/10 backdrop-blur-3xl"
                                            >
                                                <div className="max-h-[50vh] sm:max-h-96 overflow-y-auto p-3 no-scrollbar overscroll-contain touch-pan-y">
                                                    {['All Banks', ...ALL_BANKS].map(bank => {
                                                        const isSelected = bank === 'All Banks' ? selectedBanks.length === 0 : selectedBanks.includes(bank);
                                                        return (
                                                            <button key={bank} onClick={() => { if(bank === 'All Banks') { setSelectedBanks([]); setIsBankMenuOpen(false); } else { setSelectedBanks(prev => prev.includes(bank) ? prev.filter(b => b !== bank) : [...prev, bank]); } }}
                                                                className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-500 ${isSelected ? 'bg-clay/10 text-clay' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                                                            >
                                                                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center p-1.5 overflow-hidden shrink-0 border border-white/10 shadow-sm">
                                                                    {BANK_LOGOS[bank] ? <img src={BANK_LOGOS[bank]} alt="" className="w-full h-full object-contain" /> : <Landmark size={14} className="text-cream" />}
                                                                </div>
                                                                <span className="text-[10px] font-black uppercase tracking-[0.15em]">{bank}</span>
                                                                {isSelected && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-clay shadow-[0_0_10px_rgba(52,211,153,0.5)]" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Category - Refactored to Custom Dropdown */}
                            <div className={`flex-1 px-8 py-4 border-b lg:border-b-0 lg:border-r border-white/5 text-left relative ${isCategoryMenuOpen ? 'z-50' : 'z-10'}`}>
                                <label className="text-[9px] font-black uppercase tracking-[0.25em] text-white/60 mb-2 block">Category</label>
                                <button onClick={() => { setIsCategoryMenuOpen(!isCategoryMenuOpen); setIsBankMenuOpen(false); setIsTypeMenuOpen(false); }} className="flex items-center justify-between w-full text-white font-black text-sm outline-none group/btn">
                                    <span className="truncate">{selectedCategories.length === 0 ? 'All Categories' : selectedCategories.length === 1 ? selectedCategories[0] : `${selectedCategories.length} Categories`}</span>
                                    <ChevronDown className={`text-white/40 transition-all duration-500 ${isCategoryMenuOpen ? 'rotate-180 text-clay' : ''}`} size={16} />
                                </button>
                                <AnimatePresence>
                                    {isCategoryMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsCategoryMenuOpen(false)} />
                                            <motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                                className="absolute top-full left-0 lg:-left-24 mt-6 w-80 bg-cream rounded-[2.5rem] shadow-2xl overflow-hidden z-50 border border-white/10 backdrop-blur-3xl"
                                            >
                                                <div className="max-h-[50vh] sm:max-h-96 overflow-y-auto p-3 no-scrollbar overscroll-contain touch-pan-y">
                                                    {[{name: 'All Categories', image: null}, ...ALL_CATEGORIES].map(catObj => {
                                                        const cat = catObj.name;
                                                        const isSelected = cat === 'All Categories' ? selectedCategories.length === 0 : selectedCategories.includes(cat);
                                                        return (
                                                            <button key={cat} onClick={() => { if(cat === 'All Categories') { setSelectedCategories([]); setIsCategoryMenuOpen(false); } else { setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]); } }}
                                                                className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-500 ${isSelected ? 'bg-clay/10 text-clay' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                                                            >
                                                                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center p-1.5 shrink-0 border border-white/10 shadow-sm">
                                                                    {catObj.image ? <img src={catObj.image} alt="" className="w-full h-full object-contain drop-shadow-md" /> : <Sparkles size={14} className={isSelected ? 'text-clay' : 'text-white/40'} />}
                                                                </div>
                                                                <span className="text-[10px] font-black uppercase tracking-[0.15em]">{cat}</span>
                                                                {isSelected && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-clay shadow-[0_0_10px_rgba(52,211,153,0.5)]" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Type - Refactored to Custom Dropdown */}
                            <div className={`flex-1 px-8 py-4 text-left relative ${isTypeMenuOpen ? 'z-50' : 'z-10'}`}>
                                <label className="text-[9px] font-black uppercase tracking-[0.25em] text-white/60 mb-2 block">Card Type</label>
                                <button onClick={() => { setIsTypeMenuOpen(!isTypeMenuOpen); setIsBankMenuOpen(false); setIsCategoryMenuOpen(false); }} className="flex items-center justify-between w-full text-white font-black text-sm outline-none group/btn">
                                    <span className="truncate">{cardType}</span>
                                    <ChevronDown className={`text-white/40 transition-all duration-500 ${isTypeMenuOpen ? 'rotate-180 text-clay' : ''}`} size={16} />
                                </button>
                                <AnimatePresence>
                                    {isTypeMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsTypeMenuOpen(false)} />
                                            <motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                                className="absolute top-full left-0 lg:right-0 lg:left-auto mt-6 w-80 bg-cream rounded-[2.5rem] shadow-2xl overflow-hidden z-50 border border-white/10 backdrop-blur-3xl"
                                            >
                                                <div className="max-h-[50vh] sm:max-h-96 overflow-y-auto p-3 no-scrollbar overscroll-contain touch-pan-y">
                                                    {['All Types', 'Premium', 'Entry-Level'].map(type => {
                                                        const isSelected = type === cardType;
                                                        return (
                                                            <button key={type} onClick={() => { setCardType(type); setIsTypeMenuOpen(false); }}
                                                                className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-500 ${isSelected ? 'bg-clay/10 text-clay' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                                                            >
                                                                <span className="text-[10px] font-black uppercase tracking-[0.15em]">{type}</span>
                                                                {isSelected && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-clay shadow-[0_0_10px_rgba(52,211,153,0.5)]" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* CTA */}
                            <div className="px-3 shrink-0 relative z-10">
                                <button className="w-full lg:w-auto bg-clay text-cream px-12 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.25em] shadow-2xl shadow-clay/10 hover:shadow-clay/30 hover:-translate-y-1 transition-all duration-500">
                                    Search Cards
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
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-clay transition-colors" size={18} />
                        <input type="text" placeholder="Search cards..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-clay transition-all text-sm text-white"
                        />
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em]">Sort By:</span>
                        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar w-full md:w-auto">
                            {(['featured', 'rewards', 'fees', 'rating'] as const).map((s) => (
                                <button key={s} onClick={() => setSortBy(s)}
                                    className={`px-5 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${sortBy === s ? 'bg-clay text-cream shadow-lg' : 'text-white/60 hover:text-white'}`}
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
                                    <div className="bg-white/5 rounded-[2.5rem] border border-white/5 p-2 h-full flex flex-col hover:border-clay/30 hover:bg-white/[0.07] transition-all duration-500 group">
                                        <div className="relative aspect-video md:aspect-[1.6/1] rounded-[2rem] overflow-hidden mb-4 md:mb-6 bg-white/[0.03]">
                                            <ImageWithLoader src={card.image} alt={card.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-clay" />
                                                <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">{card.issuer || 'Prime'}</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 px-6 pb-6 flex flex-col">
                                            <h3 className="text-lg font-heading font-extrabold text-white leading-tight tracking-tight mb-4 group-hover:text-clay transition-colors">{card.name}</h3>
                                            
                                            <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-white/5">
                                                <div>
                                                    <p className="text-[8px] font-bold uppercase tracking-widest text-white/40 mb-1">Annual Fee</p>
                                                    <p className="text-xs font-bold text-white">₹{card.annual_fee?.replace(/[^0-9]/g, '') || '0'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-bold uppercase tracking-widest text-white/40 mb-1">Rating</p>
                                                    <p className="text-xs font-bold text-clay">{card.elite_rating || card.rating || '4.5'}/5</p>
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                                                <div className="space-y-1">
                                                    <p className="text-[8px] font-bold uppercase tracking-widest text-white/40">Projected Savings</p>
                                                    <p className="text-xl font-heading font-extrabold text-white tracking-tighter">
                                                        {card.projected_savings || '—'} <span className="text-[9px] font-serif italic text-white/40 lowercase">/yr</span>
                                                    </p>
                                                </div>
                                                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-clay group-hover:text-cream transition-all">
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
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40 italic">No cards found matching criteria</p>
                        <button onClick={() => { setSelectedBanks([]); setSelectedCategories([]); setSearchQuery(''); setCardType('All Types'); }}
                            className="mt-8 text-clay text-[11px] font-bold uppercase tracking-widest hover:underline">Reset Filters</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardExplorer;
