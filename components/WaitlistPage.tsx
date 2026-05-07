import React, { useState, useEffect, useMemo } from 'react';
import { 
    ArrowLeft, User, Building, Check, ArrowRight, Plus, Minus, 
    LayoutGrid, Rocket, ShieldCheck, Gift, Sparkles, HelpCircle, 
    Loader2, CreditCard, Landmark, Share2, Twitter, Instagram, 
    Send, MessageCircle, Copy, Globe, ChevronDown, Calendar, 
    Mail, Phone, Trash2
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { joinWaitlist, fetchCardsPublic } from '../services/supabaseService';
import { useSupabase } from './SupabaseProvider';
import { motion, AnimatePresence } from 'motion/react';

// ─── MASTER DATA ───
const BANK_LOGOS: Record<string, string> = {
    'HDFC Bank': '/assets/banks/hdfc.png', 
    'SBI Card': '/assets/banks/sbi.png', 
    'Axis Bank': '/assets/banks/axis.png',
    'ICICI Bank': '/assets/banks/icici.png', 
    'Kotak Mahindra Bank': '/assets/banks/kotak.png', 
    'YES Bank': '/assets/banks/yesbank.png',
    'American Express': '/assets/banks/amex.png', 
    'IDFC FIRST Bank': '/assets/banks/idfc.png', 
    'HSBC': '/assets/banks/hsbc.png',
    'RBL Bank': '/assets/banks/rbl.png', 
    'IndusInd Bank': '/assets/banks/indusind.png', 
    'Bank of Baroda': '/assets/banks/bob.png',
    'Standard Chartered': '/assets/banks/sc.png', 
    'Indian Bank': '/assets/banks/indian.png', 
    'PNB': '/assets/banks/pnb.png',
    'Canara Bank': '/assets/banks/canara.png', 
    'DBS Bank': '/assets/banks/dbs.png', 
    'IDBI Bank': '/assets/banks/idbi.png',
    'AU Small Finance Bank': '/assets/banks/au.png', 
    'Equitas Small Finance Bank': '/assets/banks/equitas.png', 
    'CSB Bank': '/assets/banks/csb.png',
    'Federal Bank': '/assets/banks/federal.png', 
    'SBM Bank (India)': '/assets/banks/sbm.png', 
    'South Indian Bank': '/assets/banks/southindian.png',
    'Union Bank of India': '/assets/banks/union.png',
    'Unity SFB': '/assets/banks/unity.png', 
    'DCB Bank': '/assets/banks/dcb.png', 
    'Bank of India': '/assets/banks/boi.png',
    'J&K Bank': '/assets/banks/jk.png', 
    'City Union Bank': '/assets/banks/cub.png', 
    'Slice SFB': '/assets/banks/slice.png',
    'Dhanlaxmi Bank': '/assets/banks/dhanlaxmi.png', 
    'Indian Overseas Bank': '/assets/banks/iob.png'
};

const ALL_BANKS = Object.keys(BANK_LOGOS).sort();

const DISCOVERY_SOURCES = [
    'Linkedin', 'Instagram', 'WhatsApp', 'Referral', 'Youtube', 'Reddit', 'Product Hunt', 'Telegram', 'Twitter', 'Other'
];

const SPEND_BRACKETS = [
    '0-25K', '25K-50K', '50K-1 Lac', '1 Lac to 2.5Lac', '2.5 Lac to 5 Lac', 'More than 5 Lac'
];

const USAGE_CATEGORIES = ['Dining', 'Fuel', 'Online Shopping', 'Travel', 'Hotel', 'UPI'];

const WaitlistPage: React.FC = () => {
    const { supabase, user, session, cards: allCards } = useSupabase();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [step, setStep] = useState(1);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successData, setSuccessData] = useState<{ rank: number; referralCode: string } | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        dateOfBirth: '',
        gender: '',
        creditCardsCount: 1,
        creditCards: [{ bank: '', card: '' }],
        mostUsedFor: [] as string[],
        monthlySpend: 50000,
        referralCode: '',
        sourceChannel: '',
        otherSource: '',
        bankSearch: ''
    });

    const [openBankDropdown, setOpenBankDropdown] = useState<number | null>(null);
    const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

    // ─── REFERRAL PREFILLING ───
    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            setFormData(prev => ({ ...prev, referralCode: ref }));
        }
    }, [searchParams]);

    // ─── STEP 1: GOOGLE AUTH ───
    const handleGoogleSignup = async () => {
        setIsLoadingData(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: 'https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read',
                redirectTo: window.location.origin + '/join-waitlist'
            }
        });
        if (error) setError(error.message);
        setIsLoadingData(false);
    };

    // ─── DATA EXTRACTION ───
    useEffect(() => {
        if (user && step === 1) {
            extractUserData();
        }
    }, [user]);

    const extractUserData = async () => {
        setIsLoadingData(true);
        try {
            const { full_name, name, email } = user.user_metadata || {};
            const displayName = full_name || name || '';
            const nameParts = displayName.split(' ');
            const extractedFirstName = nameParts[0] || '';
            const extractedLastName = nameParts.slice(1).join(' ') || '';

            let phone = '';
            let dob = '';
            let gender = '';

            // If we have a provider token, fetch additional data from Google People API
            if (session?.provider_token) {
                try {
                    const response = await fetch('https://people.googleapis.com/v1/people/me?personFields=phoneNumbers,birthdays,genders', {
                        headers: {
                            Authorization: `Bearer ${session.provider_token}`
                        }
                    });
                    const data = await response.json();
                    
                    if (data.phoneNumbers && data.phoneNumbers.length > 0) {
                        phone = data.phoneNumbers[0].value || '';
                    }
                    if (data.birthdays && data.birthdays.length > 0) {
                        const date = data.birthdays[0].date;
                        if (date && date.year && date.month && date.day) {
                            dob = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
                        }
                    }
                    if (data.genders && data.genders.length > 0) {
                        const g = data.genders[0].value;
                        if (g === 'male') gender = 'Male';
                        else if (g === 'female') gender = 'Female';
                        else gender = 'Other';
                    }
                } catch (e) {
                    console.error("Failed to fetch Google People API:", e);
                }
            }

            setFormData(prev => ({
                ...prev,
                firstName: extractedFirstName || prev.firstName,
                lastName: extractedLastName || prev.lastName,
                email: email || user.email || prev.email,
                mobileNumber: phone || prev.mobileNumber,
                dateOfBirth: dob || prev.dateOfBirth,
                gender: gender || prev.gender
            }));
            
            // Advance to profile step if we have email
            if (user.email || email) setStep(2);
        } catch (err) {
            console.error("Profile extraction failed:", err);
        } finally {
            setIsLoadingData(false);
        }
    };

    // ─── HELPERS ───
    const handleCardCountChange = (count: number) => {
        const currentCards = [...formData.creditCards];
        if (count > currentCards.length) {
            const diff = count - currentCards.length;
            for (let i = 0; i < diff; i++) currentCards.push({ bank: '', card: '' });
        } else {
            currentCards.length = count;
        }
        setFormData({ ...formData, creditCardsCount: count, creditCards: currentCards });
    };

    const updateCardDetail = (index: number, field: 'bank' | 'card', value: string) => {
        const newCards = [...formData.creditCards];
        newCards[index][field] = value;
        if (field === 'bank') newCards[index].card = ''; // Reset card when bank changes
        setFormData({ ...formData, creditCards: newCards });
    };

    const filteredCardsForBank = (bank: string) => {
        if (!bank) return [];
        const searchBank = bank.toLowerCase().replace(' bank', '').trim();
        return allCards.filter(c => {
            const issuer = (c.issuer || '').toLowerCase();
            const cardBank = (c.bank || '').toLowerCase();
            return issuer.includes(searchBank) || cardBank.includes(searchBank) || searchBank.includes(issuer) || searchBank.includes(cardBank);
        });
    };

    const toggleUsageCategory = (cat: string) => {
        setFormData(prev => {
            const current = prev.mostUsedFor;
            if (current.includes(cat)) {
                if (current.length === 1) return prev; // Min 1
                return { ...prev, mostUsedFor: current.filter(c => c !== cat) };
            } else {
                if (current.length === 3) return prev; // Max 3
                return { ...prev, mostUsedFor: [...current, cat] };
            }
        });
    };

    // ─── VALIDATION HELPERS ───
    const validateStep2 = () => {
        const errors: Record<string, string> = {};
        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        if (!formData.mobileNumber.trim()) errors.mobileNumber = 'Mobile number is required';
        if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) errors.gender = 'Gender is required';
        setStepErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateStep3 = () => {
        const errors: Record<string, string> = {};
        formData.creditCards.forEach((card, idx) => {
            if (!card.bank) errors[`card_${idx}`] = `Card ${idx + 1}: please select a bank`;
        });
        setStepErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateStep4 = () => {
        const errors: Record<string, string> = {};
        if (!formData.sourceChannel) errors.sourceChannel = 'Please select how you discovered us';
        if (formData.sourceChannel === 'Other' && !formData.otherSource.trim()) errors.otherSource = 'Please specify your discovery source';
        setStepErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // ─── SUBMISSION ───
    const handleSubmit = async () => {
        if (!validateStep4()) return;
        setIsSubmitting(true);
        setError(null);
        try {
            // Always use the canonical email from the auth session
            const canonicalEmail = user?.email || formData.email;
            const entry = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: canonicalEmail,
                mobile_number: formData.mobileNumber,
                date_of_birth: formData.dateOfBirth,
                gender: formData.gender,
                credit_cards_count: formData.creditCardsCount,
                credit_cards_details: formData.creditCards,
                most_used_for: formData.mostUsedFor.join(', '),
                monthly_spend: `₹${formData.monthlySpend.toLocaleString()}`,
                referral_code: formData.referralCode,
                source_channel: formData.sourceChannel === 'Other' ? formData.otherSource : formData.sourceChannel,
                role: 'user',
                status: 'pending'
            };

            const result = await joinWaitlist(entry);
            setSuccessData({
                rank: result.rank,
                referralCode: result.personal_referral_code
            });
            setStep(5);
        } catch (err: any) {
            // Handle duplicate email gracefully
            if (err.message?.includes('duplicate key') || err.code === '23505') {
                setError('You are already on our waitlist! Check your email for your referral code.');
            } else {
                setError(err.message || 'Failed to join waitlist. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── SHARE LOGIC ───
    const shareLink = `https://yureka.money/join-waitlist?ref=${successData?.referralCode}`;
    const shareText = "I just joined the Yureka.Money waitlist! Use my referral code to get priority access.";

    const shareOnSocial = (platform: string) => {
        const urls: any = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareLink)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareLink)}`,
            reddit: `https://www.reddit.com/submit?title=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareLink)}`,
            telegram: `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(shareText)}`,
        };
        if (urls[platform]) window.open(urls[platform], '_blank');
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
        alert("Link copied to clipboard!");
    };

    // ─── RENDERERS ───

    const renderStep1 = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-20 h-20 bg-clay/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Sparkles size={40} className="text-clay" />
            </div>
            <h2 className="text-4xl md:text-5xl italic tracking-tighter text-white mb-6">Begin Your Journey</h2>
            <p className="text-white/40 text-lg mb-12 max-w-md mx-auto">Link your Gmail to unlock priority access and prefill your profile.</p>
            
            <button 
                onClick={handleGoogleSignup}
                disabled={isLoadingData}
                className="w-full max-w-md bg-white text-cream py-6 rounded-2xl flex items-center justify-center gap-4 group hover:bg-clay transition-all shadow-2xl active:scale-95 disabled:opacity-50 mx-auto"
            >
                {isLoadingData ? <Loader2 className="animate-spin" size={20} /> : <Globe size={20} />}
                <span className="text-xs font-black uppercase tracking-[0.3em]">Sign Up with Google</span>
            </button>
            <p className="mt-8 text-[10px] font-bold uppercase tracking-widest text-white/20">Secure OAuth 2.0 Encryption</p>
        </motion.div>
    );

    const renderStep2 = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
            <div className="text-center mb-12">
                <h3 className="text-3xl italic text-white mb-2">Refine Your Identity</h3>
                <p className="text-white/40 text-sm">We've prefilled what we could from your Google account.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">First Name <span className="text-red-400">*</span></label>
                    <input 
                        type="text" value={formData.firstName}
                        onChange={e => { setFormData({...formData, firstName: e.target.value}); setStepErrors(p => ({...p, firstName: ''})); }}
                        className={`w-full bg-white/5 border rounded-xl px-6 py-4 text-white outline-none focus:border-clay transition-all ${stepErrors.firstName ? 'border-red-500' : 'border-white/10'}`}
                    />
                    {stepErrors.firstName && <p className="text-red-400 text-[10px] mt-1">{stepErrors.firstName}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Last Name <span className="text-red-400">*</span></label>
                    <input 
                        type="text" value={formData.lastName}
                        onChange={e => { setFormData({...formData, lastName: e.target.value}); setStepErrors(p => ({...p, lastName: ''})); }}
                        className={`w-full bg-white/5 border rounded-xl px-6 py-4 text-white outline-none focus:border-clay transition-all ${stepErrors.lastName ? 'border-red-500' : 'border-white/10'}`}
                    />
                    {stepErrors.lastName && <p className="text-red-400 text-[10px] mt-1">{stepErrors.lastName}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Associated Mobile Number <span className="text-red-400">*</span></label>
                <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                        type="tel" value={formData.mobileNumber} placeholder="+91 XXXXX XXXXX"
                        onChange={e => { setFormData({...formData, mobileNumber: e.target.value}); setStepErrors(p => ({...p, mobileNumber: ''})); }}
                        className={`w-full bg-white/5 border rounded-xl pl-16 pr-6 py-4 text-white outline-none focus:border-clay transition-all ${stepErrors.mobileNumber ? 'border-red-500' : 'border-white/10'}`}
                    />
                </div>
                {stepErrors.mobileNumber && <p className="text-red-400 text-[10px] mt-1">{stepErrors.mobileNumber}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Date of Birth <span className="text-red-400">*</span></label>
                    <div className="relative">
                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input 
                            type="date" value={formData.dateOfBirth}
                            onChange={e => { setFormData({...formData, dateOfBirth: e.target.value}); setStepErrors(p => ({...p, dateOfBirth: ''})); }}
                            className={`w-full bg-white/5 border rounded-xl pl-16 pr-6 py-4 text-white outline-none focus:border-clay transition-all appearance-none ${stepErrors.dateOfBirth ? 'border-red-500' : 'border-white/10'}`}
                        />
                    </div>
                    {stepErrors.dateOfBirth && <p className="text-red-400 text-[10px] mt-1">{stepErrors.dateOfBirth}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Gender <span className="text-red-400">*</span></label>
                    <select 
                        value={formData.gender}
                        onChange={e => { setFormData({...formData, gender: e.target.value}); setStepErrors(p => ({...p, gender: ''})); }}
                        className={`w-full bg-white/5 border rounded-xl px-6 py-4 text-white outline-none focus:border-clay transition-all appearance-none ${stepErrors.gender ? 'border-red-500' : 'border-white/10'}`}
                    >
                        <option value="" className="bg-black">Select Gender</option>
                        <option value="male" className="bg-black">Male</option>
                        <option value="female" className="bg-black">Female</option>
                        <option value="other" className="bg-black">Other</option>
                    </select>
                    {stepErrors.gender && <p className="text-red-400 text-[10px] mt-1">{stepErrors.gender}</p>}
                </div>
            </div>

            <button 
                onClick={() => { if (validateStep2()) { setStep(3); setStepErrors({}); } }}
                className="w-full bg-clay text-cream py-5 rounded-2xl flex items-center justify-center gap-4 group shadow-xl active:scale-95 transition-all"
            >
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Continue to Financials</span>
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
        </motion.div>
    );

    const renderStep3 = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
            <div className="text-center mb-12">
                <h3 className="text-3xl italic text-white mb-2">Credit Portfolio</h3>
                <p className="text-white/40 text-sm">Help us understand your current credit reach.</p>
            </div>

            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Number of Credit Cards <span className="text-red-400">*</span></label>
                    <span className="text-clay font-black text-xl">{formData.creditCardsCount}</span>
                </div>
                <input 
                    type="range" min="1" max="10" step="1"
                    value={formData.creditCardsCount}
                    onChange={e => handleCardCountChange(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-clay"
                />
                <div className="flex justify-between text-[8px] font-black text-white/10 uppercase tracking-widest">
                    <span>01 Card</span>
                    <span>10 Cards</span>
                </div>
            </div>

            <div className="space-y-8">
                {formData.creditCards.map((card, idx) => (
                    <div key={idx} className="p-6 bg-white/[0.03] rounded-2xl border border-white/5 space-y-6 relative">
                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-clay text-cream rounded-lg flex items-center justify-center text-[10px] font-black shadow-lg">0{idx + 1}</div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 relative">
                                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Select Bank</label>
                                <button 
                                    onClick={() => setOpenBankDropdown(openBankDropdown === idx ? null : idx)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-clay transition-all text-xs flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        {card.bank && BANK_LOGOS[card.bank] ? (
                                            <div className="w-5 h-5 bg-white rounded-full p-0.5 flex items-center justify-center overflow-hidden shrink-0">
                                                <img src={BANK_LOGOS[card.bank]} alt="" className="w-full h-full object-contain" />
                                            </div>
                                        ) : (
                                            <Landmark size={14} className="text-white/20" />
                                        )}
                                        <span>{card.bank || 'Choose Bank'}</span>
                                    </div>
                                    <ChevronDown size={14} className={`text-white/20 transition-transform ${openBankDropdown === idx ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {openBankDropdown === idx && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setOpenBankDropdown(null)} />
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full left-0 right-0 mt-2 bg-cream border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                                            >
                                                <div className="p-2 border-b border-white/5 bg-white/5">
                                                    <input 
                                                        autoFocus
                                                        type="text" 
                                                        placeholder="Search Bank..."
                                                        value={formData.bankSearch}
                                                        onChange={e => setFormData({...formData, bankSearch: e.target.value})}
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white outline-none focus:border-clay"
                                                    />
                                                </div>
                                                <div className="max-h-60 overflow-y-auto no-scrollbar">
                                                    {ALL_BANKS.filter(b => b.toLowerCase().includes(formData.bankSearch.toLowerCase())).map(bank => (
                                                        <button 
                                                            key={bank}
                                                            onClick={() => { updateCardDetail(idx, 'bank', bank); setOpenBankDropdown(null); setFormData({...formData, bankSearch: ''}); }}
                                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-white transition-colors text-xs text-left"
                                                        >
                                                            <div className="w-6 h-6 bg-white rounded-full p-1 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                                                <img src={BANK_LOGOS[bank]} alt="" className="w-full h-full object-contain" />
                                                            </div>
                                                            <span className="font-bold tracking-tight">{bank}</span>
                                                        </button>
                                                    ))}
                                                    {ALL_BANKS.filter(b => b.toLowerCase().includes(formData.bankSearch.toLowerCase())).length === 0 && (
                                                        <div className="p-4 text-center text-white/20 text-[10px] uppercase tracking-widest">No Bank Found</div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Select Card</label>
                                <select 
                                    disabled={!card.bank}
                                    value={card.card}
                                    onChange={e => updateCardDetail(idx, 'card', e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-clay transition-all text-xs disabled:opacity-30"
                                >
                                    <option value="" className="bg-black">Choose Card</option>
                                    {filteredCardsForBank(card.bank).map(c => <option key={c.id} value={c.name} className="bg-black">{c.name}</option>)}
                                    <option value="Other" className="bg-black">Other / Not Listed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="flex-1 border border-white/10 text-white/40 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all">Back</button>
                <button onClick={() => { if (validateStep3()) { setStep(4); setStepErrors({}); } }} className="flex-[2] bg-clay text-cream py-5 rounded-2xl flex items-center justify-center gap-4 group shadow-xl active:scale-95 transition-all">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Next Step</span>
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
            </div>
            {Object.keys(stepErrors).some(k => k.startsWith('card_')) && (
                <p className="text-red-400 text-[10px] text-center">{Object.values(stepErrors).find(Boolean)}</p>
            )}
        </motion.div>
    );

    const renderStep4 = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
            <div className="text-center mb-12">
                <h3 className="text-3xl italic text-white mb-2">Spending DNA</h3>
                <p className="text-white/40 text-sm">Tell us how you use your capital.</p>
            </div>

            <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Primary Credit Use Case (Min 1, Max 3)</label>
                <div className="flex flex-wrap gap-3">
                    {USAGE_CATEGORIES.map(cat => {
                        const isSelected = formData.mostUsedFor.includes(cat);
                        return (
                            <button 
                                key={cat}
                                onClick={() => toggleUsageCategory(cat)}
                                className={`px-6 py-4 rounded-xl border text-xs font-black uppercase tracking-widest transition-all ${isSelected ? 'bg-clay border-clay text-cream shadow-lg' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Monthly Average Spend <span className="text-red-400">*</span></label>
                    <span className="text-clay font-black text-xl">₹{formData.monthlySpend.toLocaleString()}</span>
                </div>
                <input 
                    type="range" min="1000" max="1000000" step="5000"
                    value={formData.monthlySpend}
                    onChange={e => setFormData({...formData, monthlySpend: parseInt(e.target.value)})}
                    className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-clay"
                />
                <div className="flex justify-between text-[8px] font-black text-white/10 uppercase tracking-widest">
                    <span>₹1K</span>
                    <span>₹10 Lacs</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Discovery Channel</label>
                    <select 
                        value={formData.sourceChannel}
                        onChange={e => setFormData({...formData, sourceChannel: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white outline-none focus:border-clay transition-all appearance-none text-xs"
                    >
                        {DISCOVERY_SOURCES.map(s => <option key={s} value={s} className="bg-black">{s}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Referral Code (Optional)</label>
                    <input 
                        type="text" placeholder="YRKMNY-XXXX"
                        value={formData.referralCode}
                        onChange={e => setFormData({...formData, referralCode: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white outline-none focus:border-clay transition-all text-xs"
                    />
                </div>
            </div>

            {formData.sourceChannel === 'Other' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Please Specify Source</label>
                    <input 
                        type="text" placeholder="e.g. Newspaper, Billboard..."
                        value={formData.otherSource}
                        onChange={e => setFormData({...formData, otherSource: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white outline-none focus:border-clay transition-all text-xs"
                    />
                </motion.div>
            )}

            <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-white text-cream py-6 rounded-2xl flex items-center justify-center gap-6 group shadow-2xl active:scale-95 transition-all disabled:opacity-50"
            >
                <span className="text-sm font-black uppercase tracking-[0.4em] text-black">{isSubmitting ? 'Securing Spot...' : 'Join the Inner Circle'}</span>
                {!isSubmitting && <Sparkles size={20} className="group-hover:rotate-12 transition-transform text-black" />}
            </button>
        </motion.div>
    );

    const renderStep5 = () => (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-24 h-24 bg-clay text-cream rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl animate-pulse">
                <Check size={48} strokeWidth={2} />
            </div>
            
            <h2 className="text-5xl md:text-7xl italic tracking-tighter text-white mb-6 leading-none">Confirmed.</h2>
            <p className="text-xl text-white/40 mb-12 italic">You've secured your place in the future of credit.</p>

            <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 mb-12 max-w-lg mx-auto relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-clay/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="relative z-10 space-y-10">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 mb-4">Overall Global Rank</p>
                        <p className="text-7xl md:text-8xl font-heading font-black text-white tracking-tighter leading-none">#{successData?.rank}</p>
                    </div>
                    
                    <div className="pt-10 border-t border-white/5">
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 mb-6">Personal Referral Core</p>
                        <div className="flex items-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/5">
                            <span className="flex-1 font-mono text-lg font-bold text-clay tracking-wider pl-4">{successData?.referralCode}</span>
                            <button onClick={copyToClipboard} className="w-12 h-12 bg-clay text-cream rounded-xl flex items-center justify-center hover:scale-105 transition-transform"><Copy size={18} /></button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <p className="text-sm italic text-white/40">Higher referral density correlates with accelerated approval rates.</p>
                
                <div className="flex justify-center gap-4 flex-wrap">
                    {[
                        { icon: Twitter, color: 'hover:bg-[#1DA1F2]', action: () => shareOnSocial('twitter') },
                        { icon: MessageCircle, color: 'hover:bg-[#25D366]', action: () => shareOnSocial('whatsapp') },
                        { icon: Instagram, color: 'hover:bg-[#E4405F]', action: () => shareOnSocial('instagram') },
                        { icon: Send, color: 'hover:bg-[#0088cc]', action: () => shareOnSocial('telegram') },
                        { icon: Share2, color: 'hover:bg-white hover:text-black', action: copyToClipboard }
                    ].map((btn, i) => (
                        <button 
                            key={i} 
                            onClick={btn.action}
                            className={`w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white transition-all ${btn.color} hover:scale-110 active:scale-95`}
                        >
                            <btn.icon size={20} />
                        </button>
                    ))}
                </div>
            </div>

            <Link to="/" className="inline-block mt-16 text-[10px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-clay transition-all">Back to Archive</Link>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-cream pt-24 md:pt-32 pb-40 px-6 relative overflow-hidden font-serif selection:bg-clay/20">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="fixed top-1/4 -left-1/4 w-[60%] h-[60%] bg-clay/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-1/4 -right-1/4 w-[60%] h-[60%] bg-clay/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Progress Bar */}
                {step < 5 && (
                    <div className="mb-16 md:mb-24">
                        <div className="flex justify-between items-end mb-4">
                            <p className="text-clay font-bold text-[10px] uppercase tracking-[0.5em]">Phase 0{step}</p>
                            <p className="text-white/20 font-bold text-[9px] uppercase tracking-[0.3em]">Step {step} of 4</p>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(step / 4) * 100}%` }}
                                className="h-full bg-clay shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                            />
                        </div>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                    {step === 5 && renderStep5()}
                </AnimatePresence>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center"
                    >
                        {error}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default WaitlistPage;