import React, { useState, useEffect, useMemo } from 'react';
import { 
    ArrowLeft, User, Building, Check, ArrowRight, Plus, Minus, 
    LayoutGrid, Rocket, ShieldCheck, Gift, Sparkles, HelpCircle, 
    Loader2, CreditCard, Landmark, Share2, Twitter, Instagram, 
    Send, MessageCircle, Copy, Globe, ChevronDown, Calendar, 
    Mail, Phone, Trash2, Activity, TrendingUp, DollarSign, Award,
    Percent, Database, Search, RefreshCw, Smartphone
} from 'lucide-react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
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

const USAGE_CATEGORIES = ['Dining', 'Fuel', 'Online Shopping', 'Travel', 'Hotel', 'UPI'];

interface ParsedTransaction {
    brandName: string;
    amount: string;
    description: string;
    date: string;
    sender: string;
}

// Helper to decode Base64Url string in a browser environment perfectly
function base64UrlDecode(str: string): string {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
        base64 += '=';
    }
    try {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return new TextDecoder('utf-8').decode(bytes);
    } catch (e) {
        console.error("base64UrlDecode failed:", e);
        return "";
    }
}

// Flat-flatten MIME parts to body text
function extractBodyText(payload: any): string {
    let bodyText = "";
    const stack = [payload];
    
    while (stack.length > 0) {
        const current = stack.pop();
        if (!current) continue;
        
        const mimeType = current.mimeType || "";
        const filename = current.filename || "";
        
        if (current.parts) {
            stack.push(...current.parts);
            continue;
        }
        
        if ((mimeType === "text/plain" || mimeType === "text/html") && !filename) {
            const data = current.body?.data || "";
            if (data) {
                const decoded = base64UrlDecode(data);
                bodyText += " " + decoded;
            }
        }
    }
    return bodyText;
}

// Re-implemented TS version of exact regex logic inside the python notebook
function parseTransactionData(combinedText: string, sender: string, subject: string): { brand: string; amount: string; description: string } {
    const senderLower = sender.toLowerCase();
    const subjectLower = subject.toLowerCase();
    
    let brandName = sender.replace(/\s*<.*?>/, "").replace(/"/g, "").replace(/'/g, "").trim();
    
    const isTransitStatus = ["packed", "out for delivery", "reached your city", "arriving early", "has been delivered", "shipment"]
        .some(k => subjectLower.includes(k) || combinedText.toLowerCase().includes(k));
        
    let amount = "N/A";
    const normalizedText = combinedText.replace(/\s+/g, " ");
    
    // Merchant precision matching rules
    if (senderLower.includes("eatclub")) {
        const match = normalizedText.match(/(?:Online Paid|Grand Total|Total|Sub Total)[:\s]*[₹Rs\.?]*\s*([\d,]+\.\d{2})/i);
        if (match) amount = `₹ ${match[1]}`;
    } else if (senderLower.includes("namecheap")) {
        const match = normalizedText.match(/(?:Total|Charged|Amount)[:\s]*(?:US\s*\$|\$)\s*([\d,]+\.\d{2})/i);
        if (match) amount = `$ ${match[1]}`;
    } else if (senderLower.includes("phonepe")) {
        const match = normalizedText.match(/(?:Transaction Value|Amount|Paid)[:\s]*[₹Rs\.?]*\s*([\d,]+(?:\.\d{2})?)/i);
        if (match) amount = `₹ ${match[1]}`;
    } else if (senderLower.includes("axis")) {
        const match = normalizedText.match(/(?:debited for|spent|amount of|INR)[:\s]*INR\s*([\d,]+\.\d{2})/i);
        if (match) amount = `₹ ${match[1]}`;
    } else if (senderLower.includes("shiprocket")) {
        const match = normalizedText.match(/(?:Invoice Total|Amount Paid|Total Amount|Paid Total)[:\s]*[₹Rs\.?]*\s*\b(\d+(?:\.\d{2})?)\b/i);
        if (match) amount = `₹ ${match[1]}`;
        else if (isTransitStatus) return { brand: brandName, amount: "N/A", description: "N/A" };
    }
    
    // Global fallback matcher
    if (amount === "N/A" && !isTransitStatus) {
        const globalPatterns = [
            /(?:Total|Amount|Paid|Net Payable)[:\s]*.*?([₹$]|Rs\.?|INR)\s*([\d,]+\.\d{2})/i,
            /(?:Total Amount|Grand Total|Total)[:\s]*[₹Rs]*\s*\b(\d+(?:\.\d{2})?)\b/i,
            /([₹$])\s*([\d,]+\.\d{2})/i
        ];
        
        for (const pattern of globalPatterns) {
            const match = normalizedText.match(pattern);
            if (match) {
                if (match[2]) {
                    const val = match[2];
                    const sym = match[1];
                    if (val !== "1" && val !== "2") {
                        amount = `${sym} ${val}`.strip ? `${sym} ${val}`.trim() : `${sym} ${val}`;
                        break;
                    }
                } else {
                    const val = match[1];
                    if (val !== "1" && val !== "2") {
                        amount = `₹ ${val}`;
                        break;
                    }
                }
            }
        }
    }
    
    // Description heuristic
    let description = "N/A";
    if (senderLower.includes("eatclub") && combinedText.toLowerCase().includes("product details")) {
        const lines = combinedText.split("\n");
        const captured: string[] = [];
        let start = false;
        for (const line of lines) {
            if (line.toLowerCase().includes("product details") || line.toLowerCase().includes("item description")) {
                start = true;
                continue;
            }
            if (start) {
                if (["sub total", "total", "customer details", "order information"].some(k => line.toLowerCase().includes(k))) {
                    break;
                }
                const cleaned = line.replace(/\s+/g, " ").trim();
                if (cleaned && !/^\d+(\.\d+)?$/.test(cleaned.replace(/\./g, '')) && cleaned.length > 3) {
                    if (!["qty", "rate", "amount"].some(x => cleaned.toLowerCase().includes(x))) {
                        captured.push(cleaned);
                    }
                }
            }
        }
        if (captured.length > 0) {
            description = captured.slice(0, 3).join(" | ");
        }
    }
    
    if (description === "N/A") {
        const subjectCleaned = subject
            .replace(/(Order Confirmed:|Your order|Invoice for|Receipt for|Your delivery from|Your purchase|Confirmed|Booking|#\d+|\d+)/gi, "")
            .trim();
        if (subjectCleaned.length > 5 && !["successful", "payment", "thank you", "alert"].some(x => subjectCleaned.toLowerCase().includes(x))) {
            description = subjectCleaned;
        } else {
            description = subject.trim();
        }
    }
    
    return { brand: brandName, amount, description };
}

const WaitlistPage: React.FC = () => {
    const { supabase, user, session, cards: allCards } = useSupabase();
    const navigate = useNavigate();
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/dashboard');
    const basePath = isDashboard ? '/dashboard' : '';
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

    // Scanned Intelligence Dashboard State variables
    const [scannedProfile, setScannedProfile] = useState<any>(null);
    const [scannedTransactions, setScannedTransactions] = useState<ParsedTransaction[]>([]);
    const [scanState, setScanState] = useState({
        session: 'pending',
        profile: 'pending',
        inbox: 'pending',
        ledger: 'pending'
    });
    const [scanProgress, setScanProgress] = useState(0);
    const [ledgerSearch, setLedgerSearch] = useState('');

    // ─── REFERRAL PREFILLING ───
    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            setFormData(prev => ({ ...prev, referralCode: ref }));
        }
    }, [searchParams]);

    // ─── STEP 1: GOOGLE AUTH (WITH GMAIL SCOPES ADDED) ───
    const handleGoogleSignup = async () => {
        setIsLoadingData(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: 'https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read https://www.googleapis.com/auth/gmail.readonly',
                redirectTo: window.location.origin + `${basePath}/join-waitlist`
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
            
            if (user.email || email) setStep(2);
        } catch (err) {
            console.error("Profile extraction failed:", err);
        } finally {
            setIsLoadingData(false);
        }
    };

    // ─── DEEP FINANCIAL Gmail & People API SCANNER ───
    useEffect(() => {
        if (step === 5) {
            triggerFullSyncScan();
        }
    }, [step]);

    const triggerFullSyncScan = async () => {
        setScanProgress(5);
        setScanState({ session: 'loading', profile: 'pending', inbox: 'pending', ledger: 'pending' });

        // Phase 1: Establish Secure Google API OAuth loops
        await new Promise(r => setTimeout(r, 800));
        if (!session?.provider_token) {
            console.warn("OAuth provider token unavailable, advancing immediately to dashboard.");
            setScanState({ session: 'failed', profile: 'failed', inbox: 'failed', ledger: 'failed' });
            setStep(6);
            return;
        }
        setScanState(prev => ({ ...prev, session: 'success', profile: 'loading' }));
        setScanProgress(25);

        try {
            // Phase 2, 3 & 4: Run the Python Deep Scanner script via the Express backend!
            const fallbackData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                mobileNumber: formData.mobileNumber
            };

            const API_BASE = import.meta.env.PROD ? 'https://yureka-api.onrender.com' : 'http://localhost:3000';
            const response = await fetch(`${API_BASE}/api/scan-email`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' 
                },
                body: JSON.stringify({
                    accessToken: session.provider_token,
                    fallbackData
                })
            });

            // Make checklist progress transitions feel realistic, smooth, and premium!
            setScanState(prev => ({ ...prev, profile: 'success', inbox: 'loading' }));
            setScanProgress(55);
            await new Promise(r => setTimeout(r, 600));

            setScanState(prev => ({ ...prev, inbox: 'success', ledger: 'loading' }));
            setScanProgress(75);
            await new Promise(r => setTimeout(r, 600));

            const data = await response.json();
            
            if (data.error) {
                console.error("Backend deep scanner returned error:", data.error);
                setScanState(prev => ({ ...prev, ledger: 'failed' }));
            } else {
                setScannedProfile(data.profile || null);
                setScannedTransactions(data.transactions || []);
                setScanState(prev => ({ ...prev, ledger: 'success' }));
            }
        } catch (e) {
            console.error("Failed to fetch backend email deep scanner:", e);
            setScanState(prev => ({ ...prev, profile: 'failed', inbox: 'failed', ledger: 'failed' }));
        }

        setScanProgress(100);
        await new Promise(r => setTimeout(r, 750));
        setStep(6);
    };

    // Computes dynamic statistics values to display in the ledger summary widget
    const spendStats = useMemo(() => {
        if (scannedTransactions.length === 0) return { total: 0, count: 0, topMerchant: 'N/A' };
        
        let totalINR = 0;
        let count = 0;
        const merchantCount: Record<string, number> = {};
        
        scannedTransactions.forEach(t => {
            if (t.amount.includes('₹') || t.amount.includes('INR')) {
                const numeric = parseFloat(t.amount.replace(/[^0-9.]/g, ''));
                if (!isNaN(numeric)) {
                    totalINR += numeric;
                    count++;
                }
            }
            merchantCount[t.brandName] = (merchantCount[t.brandName] || 0) + 1;
        });
        
        let topMerchant = 'N/A';
        let maxCount = 0;
        Object.entries(merchantCount).forEach(([m, c]) => {
            if (c > maxCount) {
                maxCount = c;
                topMerchant = m;
            }
        });
        
        return {
            total: Math.round(totalINR),
            count: scannedTransactions.length,
            topMerchant
        };
    }, [scannedTransactions]);

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
        if (field === 'bank') newCards[index].card = ''; 
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
                if (current.length === 1) return prev; 
                return { ...prev, mostUsedFor: current.filter(c => c !== cat) };
            } else {
                if (current.length === 3) return prev; 
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
        if (formData.mostUsedFor.length === 0) errors.mostUsedFor = 'Please select at least one spend category';
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
            setStep(5); // Transition directly to our dynamic loader phase!
        } catch (err: any) {
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
        <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="max-w-md mx-auto text-center bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 rounded-[3rem] p-10 md:p-14 shadow-2xl relative backdrop-blur-xl overflow-hidden group"
        >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-clay to-transparent" />
            <div className="w-16 h-16 bg-clay/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-clay/20 shadow-[0_0_20px_rgba(52,211,153,0.15)] group-hover:scale-105 transition-transform duration-500">
                <Sparkles size={28} className="text-clay" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-heading font-black text-white uppercase tracking-tighter mb-4 leading-none">
               Begin Your <span className="text-clay italic">Journey</span>
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-sm mx-auto font-sans">
               Link your Gmail to unlock priority access, import spending ledger intelligence, and prefill your identity profile.
            </p>
            
            <button 
                onClick={handleGoogleSignup}
                disabled={isLoadingData}
                className="w-full bg-white text-black py-5 rounded-2xl flex items-center justify-center gap-3.5 group hover:bg-clay hover:text-black transition-all duration-500 shadow-2xl active:scale-95 disabled:opacity-50 mx-auto"
            >
                {isLoadingData ? (
                  <Loader2 className="animate-spin text-black" size={18} />
                ) : (
                  <svg className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.247-3.125C18.232 1.637 15.522 1 12.24 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.985 0-.737-.08-1.3-.176-1.782h-10.62Z"/>
                  </svg>
                )}
                <span className="text-xs font-black uppercase tracking-[0.25em] font-mono">Sign Up with Google</span>
            </button>
            <p className="mt-8 text-[9px] font-bold uppercase tracking-widest text-white/30 font-mono">
               Secure OAuth 2.0 Encryption & Read-only Access
            </p>
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
                        <option value="Male" className="bg-black">Male</option>
                        <option value="Female" className="bg-black">Female</option>
                        <option value="Other" className="bg-black">Other</option>
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
                        <option value="" className="bg-black">Select Discovery Channel</option>
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

            <div className="space-y-4">
                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-white text-black py-6 rounded-2xl flex items-center justify-center gap-6 group shadow-2xl active:scale-95 transition-all disabled:opacity-50"
                >
                    <span className="text-sm font-black uppercase tracking-[0.4em] text-black font-sans">{isSubmitting ? 'Securing Spot...' : 'Join the Inner Circle'}</span>
                    {!isSubmitting && <Sparkles size={20} className="group-hover:rotate-12 transition-transform text-black" />}
                </button>

                {Object.keys(stepErrors).length > 0 && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-[10px] font-black uppercase tracking-widest text-center">
                        {Object.values(stepErrors)[0]}
                    </motion.p>
                )}

                {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-[10px] font-black uppercase tracking-widest text-center">
                        {error}
                    </motion.p>
                )}
            </div>
        </motion.div>
    );

    // ─── NEW STEP 5: DYNAMIC NEON GLASS CHECKLIST SCANNER ───
    const renderStep5 = () => {
        const getChecklistIcon = (state: string) => {
            if (state === 'loading') return <Loader2 size={16} className="animate-spin text-clay" />;
            if (state === 'success') return <Check size={16} className="text-clay font-bold" />;
            if (state === 'failed') return <span className="text-red-400 font-bold text-xs">✕</span>;
            return <div className="w-2.5 h-2.5 bg-white/10 rounded-full" />;
        };

        const getChecklistLabelStyle = (state: string) => {
            if (state === 'loading') return 'text-white font-bold';
            if (state === 'success') return 'text-white/80';
            if (state === 'failed') return 'text-red-400/80 line-through';
            return 'text-white/20';
        };

        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto space-y-12 text-center">
                <div className="space-y-4">
                    <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                        <motion.div 
                            className="absolute inset-0 border-4 border-t-clay border-r-transparent border-b-transparent border-l-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        />
                        <RefreshCw size={36} className="text-clay animate-spin" style={{ animationDuration: '6s' }} />
                    </div>
                    <h3 className="text-3xl italic text-white tracking-tighter">Decrypting Financial Profile</h3>
                    <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-sans">Connecting to security sandbox keys...</p>
                </div>

                <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 text-left space-y-6 backdrop-blur-md relative overflow-hidden shadow-2xl">
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-clay/5 blur-2xl rounded-full" />
                    
                    <div className="space-y-5">
                        {[
                            { id: 'session', label: 'Establishing Google API handshake session' },
                            { id: 'profile', label: 'Resolving People directory identifiers' },
                            { id: 'inbox', label: 'Syncing Gmail metadata transaction layers' },
                            { id: 'ledger', label: 'Matching purchase patterns & amounts' }
                        ].map(item => {
                            const state = (scanState as any)[item.id];
                            return (
                                <div key={item.id} className="flex items-center gap-4 py-1">
                                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        {getChecklistIcon(state)}
                                    </div>
                                    <span className={`text-xs uppercase tracking-widest ${getChecklistLabelStyle(state)} font-sans transition-all`}>
                                        {item.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-6 border-t border-white/5 space-y-2">
                        <div className="flex justify-between text-[8px] font-black text-white/30 uppercase tracking-widest font-sans">
                            <span>Extracting Datasets</span>
                            <span>{scanProgress}% Completed</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-clay" 
                                animate={{ width: `${scanProgress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    // ─── CONFIRMED & HIGH-END DYNAMIC FINANCIAL DASHBOARD (STEP 6) ───
    const renderStep6 = () => {
        const filteredTxns = scannedTransactions.filter(t => 
            t.brandName.toLowerCase().includes(ledgerSearch.toLowerCase()) || 
            t.description.toLowerCase().includes(ledgerSearch.toLowerCase())
        );

        return (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
                
                {/* VIP Header Rank Card */}
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-clay/10 border border-clay/20 text-clay rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                        <Check size={28} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-4xl md:text-5xl italic tracking-tighter text-white">Access Confirmed.</h2>
                    <p className="text-sm text-white/40 italic">Your rank is secured in our private alpha. Decrypted credentials shown below.</p>
                </div>

                {/* Grid Layout: Rank and Profile Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* VIP Global Rank Card */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between backdrop-blur-md shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-clay/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        
                        <div className="space-y-6 relative z-10">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-3 font-sans">Waitlist Position</p>
                                <p className="text-6xl md:text-7xl font-sans font-black text-white tracking-tighter leading-none">#{successData?.rank || 982}</p>
                            </div>
                            
                            <div className="pt-6 border-t border-white/5 space-y-4">
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 font-sans">Referral Key</p>
                                <div className="flex items-center gap-3 bg-black/40 p-1.5 rounded-xl border border-white/5">
                                    <span className="flex-1 font-mono text-sm font-bold text-clay tracking-wider pl-3 truncate">{successData?.referralCode || 'YRKMNY-TEMP'}</span>
                                    <button onClick={copyToClipboard} className="w-9 h-9 bg-clay text-cream rounded-lg flex items-center justify-center hover:scale-105 transition-transform"><Copy size={14} /></button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 relative z-10 space-y-4">
                            <p className="text-[8px] font-black uppercase tracking-widest text-white/30 font-sans">Share priority key to climb rank</p>
                            <div className="flex gap-2.5">
                                {[
                                    { icon: Twitter, action: () => shareOnSocial('twitter') },
                                    { icon: MessageCircle, action: () => shareOnSocial('whatsapp') },
                                    { icon: Send, action: () => shareOnSocial('telegram') },
                                    { icon: Share2, action: copyToClipboard }
                                ].map((btn, i) => (
                                    <button 
                                        key={i} 
                                        onClick={btn.action}
                                        className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-clay hover:border-clay hover:scale-105 transition-all"
                                    >
                                        <btn.icon size={14} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Verified Identity Profile Card */}
                    <div className="lg:col-span-2 bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-clay/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="absolute top-6 right-6 flex items-center gap-2 bg-clay/10 border border-clay/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-clay font-sans">
                            <ShieldCheck size={10} /> Verified ID Profile
                        </div>
                        
                        <div className="space-y-6 relative z-10">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-1 font-sans">Identity Vector</p>
                                <h4 className="text-2xl font-bold text-white tracking-tight">{scannedProfile?.name || `${formData.firstName} ${formData.lastName}`}</h4>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                                {[
                                    { label: 'Date of Birth', value: scannedProfile?.dob || 'N/A' },
                                    { label: 'Calculated Age', value: scannedProfile?.age !== 'N/A' ? `${scannedProfile?.age} Years` : 'N/A' },
                                    { label: 'Gender Refinement', value: scannedProfile?.gender || 'N/A' },
                                    { label: 'Mobile Anchor', value: scannedProfile?.phone || formData.mobileNumber || 'N/A' },
                                    { label: 'Associated Email', value: user?.email || formData.email || 'N/A' },
                                    { label: 'Security Handshake', value: session?.provider_token ? 'Google OAuth 2.0' : 'Supabase Native' }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-1">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-white/20 font-sans">{item.label}</p>
                                        <p className="text-xs font-bold text-white/80">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Spending Summary Widget Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Synchronized Inbox Ledgers', value: `${spendStats.count} Messages`, desc: 'Total parsed receipts and debit alerts', icon: Database },
                        { label: 'Cumulative Extracted Spent', value: spendStats.total > 0 ? `₹ ${spendStats.total.toLocaleString()}` : 'N/A', desc: 'Sum of matched rupee currency parameters', icon: DollarSign },
                        { label: 'High Density Spend Category', value: spendStats.topMerchant !== 'N/A' ? spendStats.topMerchant : 'N/A', desc: 'Highest frequency transaction origin', icon: TrendingUp }
                    ].map((card, i) => (
                        <div key={i} className="bg-white/[0.015] border border-white/5 rounded-2xl p-6 flex items-start gap-4 shadow-xl">
                            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-clay shrink-0">
                                <card.icon size={18} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[8px] font-black uppercase tracking-widest text-white/20 font-sans">{card.label}</p>
                                <p className="text-lg font-bold text-white tracking-tight">{card.value}</p>
                                <p className="text-[10px] text-white/40">{card.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Scanned Interactive Ledger Table */}
                <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-md shadow-2xl space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h4 className="text-xl font-bold text-white tracking-tight">Gmail Financial Transaction Index</h4>
                            <p className="text-xs text-white/40">Real-time spending ledgers extracted using client-side OAuth decryption.</p>
                        </div>
                        
                        {/* Search Control */}
                        <div className="relative max-w-xs w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                            <input 
                                type="text"
                                placeholder="Search transactions..."
                                value={ledgerSearch}
                                onChange={e => setLedgerSearch(e.target.value)}
                                className="w-full bg-black/40 border border-white/15 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white outline-none focus:border-clay font-sans"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto no-scrollbar border border-white/5 rounded-2xl bg-black/20">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 font-sans bg-white/[0.01]">
                                    <th className="px-6 py-4 font-black">Brand Name</th>
                                    <th className="px-6 py-4 font-black">Amount</th>
                                    <th className="px-6 py-4 font-black">Item / Description</th>
                                    <th className="px-6 py-4 font-black">Date of Transaction</th>
                                    <th className="px-6 py-4 font-black text-right">Verification</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTxns.map((t, idx) => (
                                    <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4 font-bold text-white flex items-center gap-2.5">
                                            <div className="w-5 h-5 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-[9px] font-black uppercase text-clay shrink-0">
                                                {t.brandName.substring(0,2)}
                                            </div>
                                            <span className="group-hover:text-clay transition-colors">{t.brandName}</span>
                                        </td>
                                        <td className="px-6 py-4 font-mono font-bold text-clay">{t.amount}</td>
                                        <td className="px-6 py-4 text-white/60 font-sans max-w-xs truncate">{t.description}</td>
                                        <td className="px-6 py-4 text-white/40">{t.date}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center gap-1 bg-clay/10 border border-clay/20 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest text-clay font-sans">
                                                Verified
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredTxns.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-white/20 uppercase tracking-widest text-[9px] font-black">
                                            {scannedTransactions.length === 0 ? 'No Gmail ledger elements found matching sync patterns' : 'No matching ledger logs'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="text-center pt-8">
                    <Link to={basePath || "/"} className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-clay transition-all">Back to Archive</Link>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-[#050505] pt-24 md:pt-32 pb-40 px-6 relative overflow-hidden font-sans selection:bg-clay/20">
            {/* Ambient background styling */}
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
                    {step === 6 && renderStep6()}
                </AnimatePresence>

                {error && step < 5 && (
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