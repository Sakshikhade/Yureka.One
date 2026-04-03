import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    ArrowUpRight, Zap, ShieldCheck, Plane, Search, Filter as FilterIcon, 
    X, ChevronRight, Info, Star, MessageSquareShare, AlertCircle,
    ShoppingBag, Landmark, Coffee, Fuel, CreditCard, Hotel, Briefcase, 
    Armchair, GraduationCap, Popcorn, Smartphone, Heart, Home, GraduationCap as Education,
    ChevronDown, Check, ArrowRight
} from 'lucide-react';
import ImageWithLoader from './ImageWithLoader';
import { getCards } from '../services/supabaseService';
import { Card } from '../types';
import { featuredCards } from '../data';

// --- CUSTOM 3D-STYLE CATEGORY ICON COMPONENT ---
const CategoryIcon = ({ type }: { type: string }) => {
    switch(type) {
        case 'Travel': return <Plane className="text-blue-500" size={32} />;
        case 'Shopping': return <ShoppingBag className="text-pink-500" size={32} />;
        case 'Cashback': return <Landmark className="text-purple-500" size={32} />;
        case 'Fuel': return <Fuel className="text-orange-500" size={32} />;
        case 'Dining': return <Coffee className="text-red-500" size={32} />;
        case 'Business': return <Briefcase className="text-blue-500" size={32} />;
        case 'Lounge Access': return <Armchair className="text-teal-500" size={32} />;
        default: return <CreditCard className="text-gray-500" size={32} />;
    }
};

// ─── Shared master lists (synced with AdminDashboard) ───────────────────────
const ALL_BANKS = [
    'HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'Yes Bank', 'RBL', 'Amex',
    'IndusInd', 'BOB', 'SC', 'Indian', 'PNB', 'IDFC', 'Canara', 'HSBC',
    'DBS', 'IDBI', 'AU', 'Equitas', 'CSB', 'Federal', 'SBM', 'South Indian',
    'Utkarsh Bank', 'Suryoday Bank', 'Union Bank', 'Unity SFB', 'DCB',
    'Bank Of India', 'J&K Bank', 'CUB', 'Slice SFB', 'Dhanlaxmi Bank', 'Indian Overseas Bank'
];

const ALL_CATEGORIES = [
    { name: 'Travel',            icon: <Plane /> },
    { name: 'Hotels',            icon: <Hotel /> },
    { name: 'Cashback',          icon: <Landmark /> },
    { name: 'Brand Voucher',     icon: <ShoppingBag /> },
    { name: 'Fuel',              icon: <Fuel /> },
    { name: 'Catalogue Products',icon: <Briefcase /> },
    { name: 'Travel Bookings',   icon: <Plane /> },
    { name: 'Brand Wallet',      icon: <CreditCard /> },
    { name: 'Experience',        icon: <Popcorn /> },
    { name: 'Shopping',          icon: <ShoppingBag /> },
    { name: 'Dining',            icon: <Coffee /> },
    { name: 'Lounge Access',     icon: <Armchair /> },
    { name: 'Lifetime Free',     icon: <CreditCard /> },
    { name: 'Business',          icon: <Briefcase /> },
    { name: 'UPI',               icon: <Smartphone /> },
];
// ─────────────────────────────────────────────────────────────────────────────

// Helper to generate a slug in case one isn't present
const generateSlug = (name: string, bank: string) => {
    return `${name}-${bank}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const CardExplorer: React.FC = () => {
    const [cardsList, setCardsList] = useState<Card[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [showAllBanks, setShowAllBanks] = useState(false);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [showAllPillCategories, setShowAllPillCategories] = useState(false);

    const BANKS_INITIAL_COUNT = 10;
    const CATEGORIES_INITIAL_COUNT = 6;
    const PILL_CATEGORIES_INITIAL_COUNT = 9;

    useEffect(() => {
        const unsubscribe = getCards((fetchedCards) => {
            setCardsList(fetchedCards);
            setIsLoading(false);
            setError(null);
        }, (err) => {
            console.error("Cards Fetch Error:", err);
            setError(err);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const categories = ALL_CATEGORIES;
    const banks = ALL_BANKS;
    const visibleBanks = showAllBanks ? banks : banks.slice(0, BANKS_INITIAL_COUNT);
    const visibleCategories = showAllCategories ? categories : categories.slice(0, CATEGORIES_INITIAL_COUNT);
    const visiblePillCategories = showAllPillCategories ? categories : categories.slice(0, PILL_CATEGORIES_INITIAL_COUNT);

    const filteredCards = useMemo(() => {
        return cardsList.filter(card => {
            const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                card.issuer.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesBank = selectedBanks.length === 0 || selectedBanks.some(b => card.issuer.includes(b));
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.some(c => card.category?.includes(c));
            return matchesSearch && matchesBank && matchesCategory;
        });
    }, [cardsList, searchQuery, selectedBanks, selectedCategories]);

    const toggleBank = (bank: string) => {
        setSelectedBanks(prev => prev.includes(bank) ? prev.filter(b => b !== bank) : [...prev, bank]);
    };

    const toggleCategory = (cat: string) => {
        setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-clay border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-xl font-sans font-medium text-ink/60">Loading Credit Card Explorer...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl border border-red-100 text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-serif italic mb-4">Connection Issue</h2>
                    <p className="text-ink/60 mb-8 leading-relaxed">
                        We're having trouble reaching the database. This usually means the Supabase RLS policies need a minor adjustment.
                    </p>
                    <div className="bg-red-50 p-4 rounded-2xl mb-8 text-left">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-1">Error Detail</p>
                        <p className="text-xs font-mono text-red-600 break-words">{error}</p>
                    </div>
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-clay transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream pt-24 pb-20 overflow-x-hidden font-serif">
            {/* --- TOP CATEGORY GRID (SCREENSHOT 1) --- */}
            <div className="max-w-[1440px] mx-auto px-6 mb-12">
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
                    {categories.map((cat, i) => (
                        <button 
                            key={i}
                            onClick={() => toggleCategory(cat.name)}
                            className={`flex flex-col items-center justify-center min-w-[120px] p-6 bg-white/40 backdrop-blur-sm rounded-3xl shadow-sm hover:shadow-md transition-all border-2 ${selectedCategories.includes(cat.name) ? 'border-clay/40 bg-white/60' : 'border-transparent'}`}
                        >
                            <div className="w-16 h-16 bg-cream/80 rounded-2xl flex items-center justify-center mb-3 shadow-inner">
                                {React.cloneElement(cat.icon as React.ReactElement<any>, { size: 32, className: 'text-clay/80' })}
                            </div>
                            <span className="text-[10px] font-bold text-ink/70 uppercase tracking-widest whitespace-nowrap">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* --- SIDEBAR FILTERS (SCREENSHOT 2 & 3) --- */}
                <div className="hidden lg:block lg:col-span-3 space-y-8 bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-ink/5 h-fit sticky top-32">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-serif tracking-tighter text-ink italic">Filter</h2>
                        <button 
                            onClick={() => { setSelectedBanks([]); setSelectedCategories([]); }}
                            className="text-clay text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
                        >Clear All</button>
                    </div>

                    {/* Bank Name Filter */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-bold text-ink/30 uppercase tracking-[0.4em] mb-4">Bank Name</h3>
                        <div className="space-y-4 pr-2">
                            {visibleBanks.map(bank => (
                                <label key={bank} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-cream border border-ink/5 flex items-center justify-center font-bold text-[10px] text-clay/60 group-hover:bg-white group-hover:border-clay/20 transition-all shrink-0">
                                            {bank[0]}
                                        </div>
                                        <span className="text-sm font-medium text-ink/60 group-hover:text-ink transition-colors">{bank}</span>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedBanks.includes(bank)}
                                        onChange={() => toggleBank(bank)}
                                        className="w-4 h-4 rounded border-ink/10 text-clay focus:ring-clay cursor-pointer bg-cream shrink-0"
                                    />
                                </label>
                            ))}
                        </div>
                        {banks.length > BANKS_INITIAL_COUNT && (
                            <button
                                onClick={() => setShowAllBanks(v => !v)}
                                className="text-clay text-[9px] font-bold uppercase tracking-widest mt-2 hover:opacity-70 transition-opacity"
                            >
                                {showAllBanks ? '− View Less' : `+ View ${banks.length - BANKS_INITIAL_COUNT} More Banks`}
                            </button>
                        )}
                    </div>

                    {/* Categories Filter */}
                    <div className="pt-10 border-t border-ink/5">
                        <h3 className="text-[10px] font-bold text-ink/30 uppercase tracking-[0.4em] mb-4">Categories</h3>
                        <div className="space-y-4">
                            {visibleCategories.map(cat => (
                                <label key={cat.name} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="text-ink/20 group-hover:text-clay/60 transition-colors shrink-0">
                                            {React.cloneElement(cat.icon as React.ReactElement<any>, { size: 16 })}
                                        </div>
                                        <span className="text-sm font-medium text-ink/60 group-hover:text-ink transition-colors">{cat.name}</span>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedCategories.includes(cat.name)}
                                        onChange={() => toggleCategory(cat.name)}
                                        className="w-4 h-4 rounded border-ink/10 text-clay focus:ring-clay cursor-pointer bg-cream shrink-0"
                                    />
                                </label>
                            ))}
                        </div>
                        {categories.length > CATEGORIES_INITIAL_COUNT && (
                            <button
                                onClick={() => setShowAllCategories(v => !v)}
                                className="text-clay text-[9px] font-bold uppercase tracking-widest mt-6 hover:opacity-70 transition-opacity"
                            >
                                {showAllCategories ? '− View Less' : `+ View ${categories.length - CATEGORIES_INITIAL_COUNT} More Options`}
                            </button>
                        )}
                    </div>
                </div>

                {/* --- CARD RESULTS (SCREENSHOT 4) --- */}
                <div className="lg:col-span-9 space-y-12">
                    {/* Search Bar Mobile */}
                    <div className="lg:hidden mb-8 flex gap-4">
                         <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" size={16} />
                            <input 
                                type="text" placeholder="Search curated cards..." 
                                className="w-full pl-12 pr-6 py-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-ink/5 outline-none focus:border-clay/30 transition-all font-serif italic text-ink"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                         </div>
                         <button 
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-ink/5"
                        >
                             <FilterIcon size={18} className="text-ink/60" />
                         </button>
                    </div>

                    {filteredCards.map((card) => {
                        const cardSlug = card.slug || generateSlug(card.name, card.issuer);
                        return (
                        <div key={card.id} className="relative group">
                            {/* Glass background layer */}
                            <div className="absolute inset-0 bg-white/60 blur-[2px] rounded-[2.5rem] -m-1 group-hover:m-[-1.25rem] transition-all duration-700 opacity-40"></div>
                            
                            <div className="relative bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-sm border border-ink/5 overflow-hidden group hover:shadow-2xl transition-all duration-700">
                                {/* Main Info Section */}
                                <div className="p-8 md:p-12 flex flex-col md:flex-row gap-12">
                                    {/* Card Image */}
                                    <div className="w-full md:w-[320px] shrink-0">
                                        <div className="relative aspect-[1.58/1] rounded-2xl overflow-hidden shadow-2xl group-hover:scale-[1.05] transition-transform duration-1000 border border-ink/5">
                                            <ImageWithLoader 
                                                src={card.image} 
                                                alt={card.name} 
                                                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000"
                                            />
                                        </div>
                                    </div>

                                    {/* Content Center */}
                                    <div className="flex-1 space-y-6">
                                        <div className="flex flex-wrap gap-2">
                                            {card.tags?.map((tag, i) => (
                                                <div key={i} className="flex items-center gap-1.5 bg-ink/5 px-4 py-1.5 rounded-full group/tag cursor-pointer hover:bg-clay hover:text-white transition-all duration-500">
                                                    <div className="w-1 h-1 rounded-full bg-clay group-hover/tag:bg-white transition-colors"></div>
                                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{tag}</span>
                                                    <Info size={9} className="opacity-40 ml-1" />
                                                </div>
                                            )) || (
                                                <div className="flex items-center gap-1.5 bg-ink/5 px-4 py-1.5 rounded-full">
                                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{card.category}</span>
                                                </div>
                                            )}
                                        </div>
                                        <h2 className="text-3xl md:text-5xl font-serif italic tracking-tighter text-ink leading-none group-hover:text-clay transition-colors duration-700">
                                            {card.name}
                                        </h2>
                                        <div className="flex items-center gap-3 text-ink/40">
                                            <Landmark size={14} className="opacity-60" />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">{card.issuer || card.bank}</span>
                                        </div>
                                    </div>

                                    {/* Actions Right */}
                                    <div className="w-full md:w-56 flex flex-col gap-4 justify-start pt-4">
                                        <Link to={`/cards/${card.id}`} className="w-full">
                                            <button className="w-full bg-ink text-white font-bold py-4 rounded-full flex items-center justify-center gap-3 transition-all shadow-xl hover:bg-clay active:scale-95 text-[10px] uppercase tracking-[0.3em] cursor-pointer">
                                                Read more <ArrowRight size={14} className="opacity-60" />
                                            </button>
                                        </Link>
                                        <button className="w-full bg-white border border-ink/10 hover:border-clay/30 text-ink font-bold py-4 rounded-full flex items-center justify-center gap-3 transition-all active:scale-95 text-[10px] uppercase tracking-[0.3em]">
                                            Ask AI <MessageSquareShare size={14} className="text-clay" />
                                        </button>
                                        <button className="text-ink/30 text-[8px] uppercase font-bold tracking-[0.4em] text-center hover:text-clay transition-colors mt-4">
                                            Report data discrepancy
                                        </button>
                                    </div>
                                </div>

                                {/* Stats Row Bottom */}
                                <div className="bg-cream/40 px-8 md:px-16 py-10 grid grid-cols-2 md:grid-cols-5 gap-8 border-t border-ink/5 overflow-x-auto no-scrollbar">
                                    <div className="space-y-2">
                                        <p className="text-ink/20 text-[8px] font-bold uppercase tracking-[0.5em]">Intro Offer</p>
                                        <p className="text-sm font-medium text-ink leading-tight italic line-clamp-2">{card.intro_offer || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-ink/20 text-[8px] font-bold uppercase tracking-[0.5em]">Annual Fees</p>
                                        <p className="text-sm font-medium text-ink italic">{card.annual_fee} <span className="text-[10px] opacity-40 font-sans font-bold">+ GST</span></p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-ink/20 text-[8px] font-bold uppercase tracking-[0.5em]">Joining Fees</p>
                                        <p className="text-sm font-medium text-ink italic">{card.joining_fee || card.annual_fee} <span className="text-[10px] opacity-40 font-sans font-bold">+ GST</span></p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-ink/20 text-[8px] font-bold uppercase tracking-[0.5em]">Reward Rate</p>
                                        <p className="text-sm font-medium text-clay italic">{card.rewards_rate || '2% → 30%'}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-ink/20 text-[8px] font-bold uppercase tracking-[0.5em]">Rating</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-ink italic">{card.rating?.toFixed(1) || '4.0'}</p>
                                            <Star size={12} className="fill-clay/40 text-clay/40" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        );
                    })}

                    {filteredCards.length === 0 && (
                        <div className="text-center py-32 bg-white/40 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-ink/10">
                             <AlertCircle size={48} className="text-ink/10 mx-auto mb-6" />
                             <h3 className="text-3xl font-serif italic text-ink/30tracking-tighter">No matching instruments</h3>
                             <p className="text-ink/40 mt-4 font-medium italic">Adjust filters to discover new rewards.</p>
                             <button 
                                onClick={() => { setSelectedBanks([]); setSelectedCategories([]); setSearchQuery(''); }}
                                className="mt-10 text-clay font-bold uppercase tracking-[0.3em] text-[10px] hover:opacity-70 transition-opacity border-b-2 border-clay/20 pb-1"
                            >Clear All Constraints</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Filter Modal */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-md lg:hidden animate-fade-in">
                    <div className="absolute right-0 top-0 h-full w-[90%] bg-cream p-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-slide-left overflow-y-auto">
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="text-4xl font-serif italic tracking-tighter">Filters</h2>
                            <button onClick={() => setIsMobileFilterOpen(false)} className="p-3 hover:bg-ink/5 rounded-full transition-colors">
                                <X size={24} className="text-ink/40" />
                            </button>
                        </div>
                        {/* Repeat sidebar content for mobile */}
                        <div className="space-y-12">
                             <div className="flex justify-between items-center border-b border-ink/5 pb-4">
                                <span className="text-ink/40 font-bold uppercase tracking-[0.2em] text-[10px]">Refine Catalog</span>
                                <button onClick={() => { setSelectedBanks([]); setSelectedCategories([]); }} className="text-clay font-bold uppercase tracking-[0.2em] text-[10px]">Reset All</button>
                             </div>
                             <div>
                                <h3 className="font-serif italic text-2xl text-ink mb-6">Banks</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {(showAllBanks ? banks : banks.slice(0, BANKS_INITIAL_COUNT)).map(bank => (
                                        <button 
                                            key={bank}
                                            onClick={() => toggleBank(bank)}
                                            className={`py-3 px-4 rounded-2xl border text-[10px] font-bold tracking-widest transition-all ${selectedBanks.includes(bank) ? 'bg-clay border-clay text-white shadow-xl scale-[1.02]' : 'bg-white border-ink/5 text-ink/40 hover:border-ink/10'}`}
                                        >
                                            {bank}
                                        </button>
                                    ))}
                                </div>
                                {banks.length > BANKS_INITIAL_COUNT && (
                                    <button
                                        onClick={() => setShowAllBanks(v => !v)}
                                        className="text-clay text-[9px] font-bold uppercase tracking-widest mt-4 hover:opacity-70 transition-opacity"
                                    >
                                        {showAllBanks ? '− View Less' : `+ View ${banks.length - BANKS_INITIAL_COUNT} More`}
                                    </button>
                                )}
                             </div>

                             <div>
                                <h3 className="font-serif italic text-2xl text-ink mb-6">Categories</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {(showAllCategories ? categories : categories.slice(0, CATEGORIES_INITIAL_COUNT)).map(cat => (
                                        <button 
                                            key={cat.name}
                                            onClick={() => toggleCategory(cat.name)}
                                            className={`py-3 px-4 rounded-2xl border text-[10px] font-bold tracking-widest text-left transition-all ${selectedCategories.includes(cat.name) ? 'bg-clay border-clay text-white shadow-xl scale-[1.02]' : 'bg-white border-ink/5 text-ink/40 hover:border-ink/10'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                                {categories.length > CATEGORIES_INITIAL_COUNT && (
                                    <button
                                        onClick={() => setShowAllCategories(v => !v)}
                                        className="text-clay text-[9px] font-bold uppercase tracking-widest mt-4 hover:opacity-70 transition-opacity"
                                    >
                                        {showAllCategories ? '− View Less' : `+ View ${categories.length - CATEGORIES_INITIAL_COUNT} More`}
                                    </button>
                                )}
                             </div>
                             
                             <button 
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="w-full bg-ink text-white font-bold py-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] mt-12 uppercase tracking-[0.3em] text-[10px]"
                            >
                                Reveal Results ({filteredCards.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardExplorer;
