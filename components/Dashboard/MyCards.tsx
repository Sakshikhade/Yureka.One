import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    Plus, Trash2, Search, CreditCard, Landmark, 
    ChevronDown, Loader2, Sparkles, AlertCircle
} from 'lucide-react';
import { useSupabase } from '../SupabaseProvider';
import { fetchUserCards, addUserCard, removeUserCard } from '../../services/supabaseService';

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

const ALL_BANKS = Object.keys(BANK_LOGOS).sort();

const MyCards: React.FC = () => {
    const { user, cards: allCards } = useSupabase();
    const [ownedCards, setOwnedCards] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedBank, setSelectedBank] = useState('');
    const [selectedCardId, setSelectedCardId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openBankDropdown, setOpenBankDropdown] = useState(false);

    useEffect(() => {
        if (user) loadCards();
    }, [user]);

    const loadCards = async () => {
        try {
            const data = await fetchUserCards(user!.id);
            setOwnedCards(data || []);
        } catch (err) {
            console.error("Failed to load cards:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCard = async () => {
        if (!selectedBank || !selectedCardId) return;
        setIsSubmitting(true);
        try {
            const cardDetail = allCards.find(c => c.id === selectedCardId);
            const payload = {
                user_id: user!.id,
                card_id: selectedCardId === 'Other' ? null : selectedCardId,
                bank_name: selectedBank,
                card_name: selectedCardId === 'Other' ? 'Other Card' : cardDetail?.name || 'Unknown Card',
                card_image: cardDetail?.image || null
            };
            await addUserCard(payload);
            await loadCards();
            setIsAdding(false);
            setSelectedBank('');
            setSelectedCardId('');
        } catch (err) {
            alert("Failed to add card. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCard = async (id: string) => {
        if (!confirm("Are you sure you want to remove this card?")) return;
        try {
            await removeUserCard(id);
            setOwnedCards(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            alert("Failed to delete card.");
        }
    };

    const filteredCards = allCards.filter(c => {
        const searchBank = selectedBank.toLowerCase();
        const issuer = (c.issuer || '').toLowerCase();
        const bank = (c.bank || '').toLowerCase();
        return issuer.includes(searchBank) || bank.includes(searchBank) || searchBank.includes(issuer) || searchBank.includes(bank);
    });

    if (isLoading) return (
        <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-clay" size={40} />
        </div>
    );

    return (
        <div className="space-y-10">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 flex flex-col justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4">Portfolio Size</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black italic text-white tracking-tighter">{ownedCards.length}</span>
                        <span className="text-white/40 text-sm italic">Cards</span>
                    </div>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 flex flex-col justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4">Monthly Value</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black italic text-clay tracking-tighter">15%</span>
                        <span className="text-white/40 text-sm italic">Savings</span>
                    </div>
                </div>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 hover:bg-clay/5 hover:border-clay/20 transition-all group"
                >
                    <div className="w-12 h-12 bg-clay text-cream rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus size={24} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white">Add New Card</span>
                </button>
            </div>

            {/* Owned Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {ownedCards.map((card) => (
                        <motion.div 
                            key={card.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group relative bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-6 hover:border-clay/30 transition-all hover:shadow-2xl hover:shadow-clay/5"
                        >
                            <div className="aspect-[1.6/1] bg-black/40 rounded-2xl overflow-hidden mb-6 relative group-hover:scale-[1.02] transition-transform">
                                {card.card_image ? (
                                    <img src={card.card_image} alt={card.card_name} className="w-full h-full object-contain p-4" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <CreditCard size={48} className="text-white/10" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded-lg p-1.5 shadow-xl">
                                    <img src={BANK_LOGOS[card.bank_name] || '/assets/logo.png'} alt="" className="w-full h-full object-contain" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 mb-1">{card.bank_name}</p>
                                    <h4 className="text-sm font-bold text-white tracking-tight">{card.card_name}</h4>
                                </div>
                                <button 
                                    onClick={() => handleDeleteCard(card.id)}
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-red-400/40 hover:bg-red-500/10 hover:text-red-400 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Add Card Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-cream/80 backdrop-blur-xl"
                            onClick={() => setIsAdding(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-black/60 border border-white/10 w-full max-w-lg rounded-[3rem] p-10 relative z-10 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-clay/20">
                                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-clay" />
                            </div>

                            <h3 className="text-3xl italic tracking-tighter text-white mb-8">Add to Portfolio</h3>

                            <div className="space-y-8">
                                <div className="space-y-2 relative">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Select Bank</label>
                                    <button 
                                        onClick={() => setOpenBankDropdown(!openBankDropdown)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-left flex items-center justify-between group hover:border-clay/30 transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            {selectedBank ? (
                                                <img src={BANK_LOGOS[selectedBank]} className="w-5 h-5 object-contain" alt="" />
                                            ) : <Landmark size={18} className="text-white/20" />}
                                            <span className="text-xs font-bold uppercase tracking-widest">{selectedBank || 'Choose Issuer'}</span>
                                        </div>
                                        <ChevronDown size={16} className={`text-white/20 transition-transform ${openBankDropdown ? 'rotate-180' : ''}`} />
                                    </button>

                                    {openBankDropdown && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-cream border border-white/10 rounded-2xl shadow-2xl z-[110] max-h-60 overflow-y-auto no-scrollbar py-2"
                                        >
                                            {ALL_BANKS.map(bank => (
                                                <button 
                                                    key={bank}
                                                    onClick={() => { setSelectedBank(bank); setOpenBankDropdown(false); setSelectedCardId(''); }}
                                                    className="w-full flex items-center gap-4 px-6 py-3 hover:bg-white/5 text-white transition-colors"
                                                >
                                                    <div className="w-8 h-8 bg-white rounded-lg p-1.5">
                                                        <img src={BANK_LOGOS[bank]} className="w-full h-full object-contain" alt="" />
                                                    </div>
                                                    <span className="text-xs font-bold tracking-tight uppercase">{bank}</span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Select Card</label>
                                    <select 
                                        disabled={!selectedBank}
                                        value={selectedCardId}
                                        onChange={e => setSelectedCardId(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-clay transition-all appearance-none text-xs font-bold uppercase tracking-widest disabled:opacity-30"
                                    >
                                        <option value="" className="bg-black">Choose Variant</option>
                                        {filteredCards.map(c => (
                                            <option key={c.id} value={c.id} className="bg-black">{c.name}</option>
                                        ))}
                                        <option value="Other" className="bg-black">Other / Not Listed</option>
                                    </select>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        onClick={() => setIsAdding(false)}
                                        className="flex-1 border border-white/10 text-white/40 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button 
                                        onClick={handleAddCard}
                                        disabled={isSubmitting || !selectedCardId}
                                        className="flex-[2] bg-clay text-cream py-5 rounded-2xl flex items-center justify-center gap-4 group shadow-xl active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">{isSubmitting ? 'Syncing...' : 'Add to Collection'}</span>
                                        {!isSubmitting && <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyCards;
