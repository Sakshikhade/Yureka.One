import React, { useState, useMemo, useEffect } from 'react';
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

const CardExplorer: React.FC = () => {
    const [cardsList, setCardsList] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = getCards((fetchedCards) => {
            // Enriching default featuredCards if Supabase is empty with mock data for missing fields
            const enrichedDefaults = featuredCards.map(c => ({
                ...c,
                intro_offer: c.name.includes('Atlas') ? '2.5K Edge Miles' : c.name.includes('Infinia') ? '12.5K Reward Point, Club Marriott Member...' : '₹12.5K voucher of Luxe / Postcard Hotels / ...',
                joining_fee: c.annual_fee,
                rating: 4.5 + Math.random() * 0.4,
                tags: ['TRAVEL', 'PREMIUM', 'LOUNGE ACCESS', 'DINING']
            }));
            setCardsList(fetchedCards.length > 0 ? fetchedCards : enrichedDefaults as Card[]);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const categories = [
        { name: 'Travel', icon: <Plane /> },
        { name: 'Shopping', icon: <ShoppingBag /> },
        { name: 'Cashback', icon: <Landmark /> },
        { name: 'Fuel', icon: <Fuel /> },
        { name: 'Lifetime Free', icon: <CreditCard /> },
        { name: 'Dining', icon: <Coffee /> },
        { name: 'Business', icon: <Briefcase /> },
        { name: 'Lounge Access', icon: <Armchair /> },
        { name: 'UPI', icon: <Smartphone /> }
    ];

    const banks = ['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'Yes Bank', 'RBL', 'Amex', 'IndusInd', 'BOB'];

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
                <div className="text-xl font-sans font-medium text-blue-600 animate-pulse">Loading Credit Card Explorer...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20">
            {/* --- TOP CATEGORY GRID (SCREENSHOT 1) --- */}
            <div className="max-w-[1440px] mx-auto px-6 mb-12">
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
                    {categories.map((cat, i) => (
                        <button 
                            key={i}
                            onClick={() => toggleCategory(cat.name)}
                            className={`flex flex-col items-center justify-center min-w-[120px] p-6 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all border-2 ${selectedCategories.includes(cat.name) ? 'border-blue-500 bg-blue-50' : 'border-transparent'}`}
                        >
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-3">
                                {React.cloneElement(cat.icon as React.ReactElement<any>, { size: 32, className: 'text-blue-500' })}
                            </div>
                            <span className="text-xs font-bold text-gray-800 whitespace-nowrap">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* --- SIDEBAR FILTERS (SCREENSHOT 2 & 3) --- */}
                <div className="hidden lg:block lg:col-span-3 space-y-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-32">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Filter</h2>
                        <button 
                            onClick={() => { setSelectedBanks([]); setSelectedCategories([]); }}
                            className="text-blue-600 text-sm font-semibold hover:underline"
                        >Clear All</button>
                    </div>

                    {/* Bank Name Filter */}
                    <div>
                        <h3 className="text-base font-bold text-gray-700 mb-6 uppercase tracking-wider">Bank Name</h3>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {banks.map(bank => (
                                <label key={bank} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center font-bold text-[10px] text-blue-600">
                                            {bank[0]}
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors uppercase">{bank}</span>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedBanks.includes(bank)}
                                        onChange={() => toggleBank(bank)}
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Categories Filter */}
                    <div className="pt-8 border-t border-gray-100">
                        <h3 className="text-base font-bold text-gray-700 mb-6 uppercase tracking-wider">Categories</h3>
                        <div className="space-y-4">
                            {categories.slice(0, 6).map(cat => (
                                <label key={cat.name} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                                            {React.cloneElement(cat.icon as React.ReactElement<any>, { size: 18 })}
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors uppercase">{cat.name}</span>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedCategories.includes(cat.name)}
                                        onChange={() => toggleCategory(cat.name)}
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                </label>
                            ))}
                            <button className="text-blue-600 text-sm font-bold mt-4 hover:underline">View More</button>
                        </div>
                    </div>
                </div>

                {/* --- CARD RESULTS (SCREENSHOT 4) --- */}
                <div className="lg:col-span-9 space-y-6">
                    {/* Search Bar Mobile */}
                    <div className="lg:hidden mb-6 flex gap-4">
                         <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" placeholder="Search cards..." 
                                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                         </div>
                         <button 
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="bg-white p-3 rounded-xl border border-gray-200"
                        >
                             <FilterIcon size={20} className="text-gray-600" />
                         </button>
                    </div>

                    {filteredCards.map((card) => (
                        <div key={card.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-500">
                            {/* Main Info Section */}
                            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                                {/* Card Image */}
                                <div className="w-full md:w-[280px] shrink-0">
                                    <div className="relative aspect-[1.58/1] rounded-xl overflow-hidden shadow-2xl group-hover:scale-[1.02] transition-transform duration-500">
                                        <ImageWithLoader 
                                            src={card.image} 
                                            alt={card.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Content Center */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-wrap gap-3">
                                        {card.tags?.map((tag, i) => (
                                            <div key={i} className="flex items-center gap-1 bg-blue-50/50 px-3 py-1 rounded-full group cursor-pointer hover:bg-blue-100 transition-colors">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{tag}</span>
                                                <Info size={10} className="text-blue-300 ml-1" />
                                            </div>
                                        )) || (
                                            <div className="flex items-center gap-1 bg-blue-50/50 px-3 py-1 rounded-full">
                                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{card.category}</span>
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {card.name}
                                    </h2>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Landmark size={16} />
                                        <span className="text-sm font-medium">{card.issuer || card.bank}</span>
                                    </div>
                                </div>

                                {/* Actions Right */}
                                <div className="w-full md:w-48 flex flex-col gap-3 justify-start pt-2">
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95">
                                        Read more <ArrowRight size={18} />
                                    </button>
                                    <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                                        Ask AI <MessageSquareShare size={18} className="text-orange-400" />
                                    </button>
                                    <button className="text-gray-400 text-[10px] uppercase font-bold tracking-widest text-center hover:text-red-400 transition-colors mt-2">
                                        Report data issue
                                    </button>
                                </div>
                            </div>

                            {/* Stats Row Bottom */}
                            <div className="bg-[#F0F7FF] px-6 md:px-10 py-6 grid grid-cols-2 md:grid-cols-5 gap-6 border-t border-blue-50 overflow-x-auto no-scrollbar">
                                <div className="space-y-1">
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Intro Offer</p>
                                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{card.intro_offer || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Annual Fees</p>
                                    <p className="text-sm font-bold text-gray-900">{card.annual_fee} <span className="text-[10px] text-gray-400">+ GST</span></p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Joining Fees</p>
                                    <p className="text-sm font-bold text-gray-900">{card.joining_fee || card.annual_fee} <span className="text-[10px] text-gray-400">+ GST</span></p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Reward Rate</p>
                                    <p className="text-sm font-bold text-gray-900">{card.rewards_rate || '2% → 30%'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Rating</p>
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-sm font-bold text-gray-900">{card.rating?.toFixed(1) || '4.0'}</p>
                                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredCards.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                             <AlertCircle size={48} className="text-gray-200 mx-auto mb-4" />
                             <h3 className="text-xl font-bold text-gray-900">No cards found</h3>
                             <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                             <button 
                                onClick={() => { setSelectedBanks([]); setSelectedCategories([]); setSearchQuery(''); }}
                                className="mt-6 text-blue-600 font-bold hover:underline"
                            >Clear all filters</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Filter Modal */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in">
                    <div className="absolute right-0 top-0 h-full w-[85%] bg-white p-6 shadow-2xl animate-slide-left overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold">Filters</h2>
                            <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X size={24} />
                            </button>
                        </div>
                        {/* Repeat sidebar content for mobile */}
                        <div className="space-y-8">
                             <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-medium">Select Filters</span>
                                <button onClick={() => { setSelectedBanks([]); setSelectedCategories([]); }} className="text-blue-600 font-bold">Reset</button>
                             </div>
                             <div>
                                <h3 className="font-bold text-gray-900 mb-4">Banks</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {banks.map(bank => (
                                        <button 
                                            key={bank}
                                            onClick={() => toggleBank(bank)}
                                            className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${selectedBanks.includes(bank) ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
                                        >
                                            {bank}
                                        </button>
                                    ))}
                                </div>
                             </div>
                             {/* ... other mobile filters ... */}
                             <button 
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-xl mt-8"
                            >
                                Show Results ({filteredCards.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardExplorer;
