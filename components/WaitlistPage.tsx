import React, { useState, useEffect, useMemo } from 'react';
import { 
    ArrowLeft, User, Building, Check, ArrowRight, Plus, Minus, 
    LayoutGrid, Rocket, ShieldCheck, Gift, Sparkles, HelpCircle, 
    Loader2, CreditCard, Landmark, Share2, Twitter, Instagram, 
    Send, MessageCircle, Copy, Globe, ChevronDown, Calendar, 
    Mail, Phone, Trash2, Activity, TrendingUp, DollarSign, Award,
    Percent, Database, Search, RefreshCw, Smartphone, LogIn
} from 'lucide-react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { api, isApiError } from '../lib/api/client';
import type { Waitlist as ApiWaitlist, WaitlistJoinResult } from '../lib/api/types';
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
                        amount = `${sym} ${val}`.trim();
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
    const { supabase, user, session, cards: allCards, currentUserStatus } = useSupabase();
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

    // ─── DATA EXTRACTION (skip for existing accounts — route them to where they belong) ───
    useEffect(() => {
        if (!user || step !== 1 || currentUserStatus === 'loading') return;

        if (currentUserStatus === 'admin') { navigate('/admin'); return; }
        if (currentUserStatus === 'accepted') { navigate('/dashboard'); return; }
        if (currentUserStatus === 'pending' || currentUserStatus === 'on-hold' || currentUserStatus === 'rejected') {
            navigate('/waiting');
            return;
        }

        extractUserData();
    }, [user, currentUserStatus]);

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

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 60_000);

            const scanRes = await api.post<{ profile: any; transactions: any[] }>(
                '/api/v1/ledger/scan',
                { accessToken: session.provider_token, email: session.user?.email, fallbackData }
            );
            clearTimeout(timeout);

            // Make checklist progress transitions feel realistic, smooth, and premium!
            setScanState(prev => ({ ...prev, profile: 'success', inbox: 'loading' }));
            setScanProgress(55);
            await new Promise(r => setTimeout(r, 600));

            setScanState(prev => ({ ...prev, inbox: 'success', ledger: 'loading' }));
            setScanProgress(75);
            await new Promise(r => setTimeout(r, 600));

            if (isApiError(scanRes)) {
                console.error("Ledger scan returned error:", scanRes.error);
                setScanState(prev => ({ ...prev, ledger: 'failed' }));
            } else {
                setScannedProfile(scanRes.data?.profile || null);
                setScannedTransactions(scanRes.data?.transactions || []);
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

            const res = await api.post<WaitlistJoinResult>('/api/v1/waitlist/join', entry, { skipAuth: true });
            if (isApiError(res)) {
                setError(res.error || 'Failed to join waitlist. Please try again.');
                return;
            }
            const joined = res.data!.data;
            setSuccessData({
                rank: joined.rank ?? 1000,
                referralCode: joined.personalReferralCode ?? ''
            });
            setStep(5);
        } catch (err: any) {
            setError(err.message || 'Failed to join waitlist. Please try again.');
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
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-sm mx-auto"
        >
            <div id="join-waitlist-card" className="text-center bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative backdrop-blur-xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-clay/50 to-transparent" />

                <div className="w-14 h-14 bg-clay/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-clay/20">
                    <Sparkles size={22} className="text-clay" />
                </div>

                <h2 className="text-3xl font-heading font-black text-white uppercase tracking-tighter mb-3 leading-tight">
                    Get Early Access
                </h2>
                <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-xs mx-auto">
                    Already on the list? Sign in below. New here? We'll set up your profile automatically.
                </p>

                <button
                    onClick={handleGoogleSignup}
                    disabled={isLoadingData}
                    className="w-full bg-white text-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-clay transition-all duration-300 shadow-xl active:scale-[0.98] disabled:opacity-50"
                >
                    {isLoadingData ? (
                        <Loader2 className="animate-spin" size={18} />
                    ) : (
                        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                    )}
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                        {isLoadingData ? 'Connecting…' : 'Continue with Google'}
                    </span>
                </button>

                <p className="mt-6 text-[9px] font-bold uppercase tracking-widest text-white/25">
                    Read-only · No spam · Secure OAuth 2.0
                </p>
            </div>
        </motion.div>
    );

    const renderStep2 = () => (
        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center">
                <h3 className="text-3xl font-heading font-black text-white uppercase tracking-tighter mb-2">Your Profile</h3>
                <p className="text-white/40 text-sm">We've auto-filled what we could from your Google account.</p>
            </div>

            <div className="bg-white/[0.02] border border-white/8 rounded-[2rem] p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">First Name <span className="text-red-400">*</span></label>
                        <input
                            type="text" value={formData.firstName} placeholder="Jane"
                            onChange={e => { setFormData({...formData, firstName: e.target.value}); setStepErrors(p => ({...p, firstName: ''})); }}
                            className={`w-full bg-black/30 border rounded-xl px-5 py-3.5 text-white text-sm outline-none focus:border-clay/60 focus:bg-white/5 transition-all ${stepErrors.firstName ? 'border-red-500/60' : 'border-white/10'}`}
                        />
                        {stepErrors.firstName && <p className="text-red-400 text-[10px]">{stepErrors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Last Name <span className="text-red-400">*</span></label>
                        <input
                            type="text" value={formData.lastName} placeholder="Doe"
                            onChange={e => { setFormData({...formData, lastName: e.target.value}); setStepErrors(p => ({...p, lastName: ''})); }}
                            className={`w-full bg-black/30 border rounded-xl px-5 py-3.5 text-white text-sm outline-none focus:border-clay/60 focus:bg-white/5 transition-all ${stepErrors.lastName ? 'border-red-500/60' : 'border-white/10'}`}
                        />
                        {stepErrors.lastName && <p className="text-red-400 text-[10px]">{stepErrors.lastName}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Mobile Number <span className="text-red-400">*</span></label>
                    <div className="relative">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-white/25" size={16} />
                        <input
                            type="tel" value={formData.mobileNumber} placeholder="+91 XXXXX XXXXX"
                            onChange={e => { setFormData({...formData, mobileNumber: e.target.value}); setStepErrors(p => ({...p, mobileNumber: ''})); }}
                            className={`w-full bg-black/30 border rounded-xl pl-14 pr-5 py-3.5 text-white text-sm outline-none focus:border-clay/60 focus:bg-white/5 transition-all ${stepErrors.mobileNumber ? 'border-red-500/60' : 'border-white/10'}`}
                        />
                    </div>
                    {stepErrors.mobileNumber && <p className="text-red-400 text-[10px]">{stepErrors.mobileNumber}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Date of Birth <span className="text-red-400">*</span></label>
                        <div className="relative">
                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-white/25" size={16} />
                            <input
                                type="date" value={formData.dateOfBirth}
                                onChange={e => { setFormData({...formData, dateOfBirth: e.target.value}); setStepErrors(p => ({...p, dateOfBirth: ''})); }}
                                className={`w-full bg-black/30 border rounded-xl pl-14 pr-5 py-3.5 text-white text-sm outline-none focus:border-clay/60 focus:bg-white/5 transition-all appearance-none ${stepErrors.dateOfBirth ? 'border-red-500/60' : 'border-white/10'}`}
                            />
                        </div>
                        {stepErrors.dateOfBirth && <p className="text-red-400 text-[10px]">{stepErrors.dateOfBirth}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Gender <span className="text-red-400">*</span></label>
                        <select
                            value={formData.gender}
                            onChange={e => { setFormData({...formData, gender: e.target.value}); setStepErrors(p => ({...p, gender: ''})); }}
                            className={`w-full bg-black/30 border rounded-xl px-5 py-3.5 text-white text-sm outline-none focus:border-clay/60 focus:bg-white/5 transition-all appearance-none ${stepErrors.gender ? 'border-red-500/60' : 'border-white/10'}`}
                        >
                            <option value="" className="bg-black">Select</option>
                            <option value="Male" className="bg-black">Male</option>
                            <option value="Female" className="bg-black">Female</option>
                            <option value="Other" className="bg-black">Other</option>
                        </select>
                        {stepErrors.gender && <p className="text-red-400 text-[10px]">{stepErrors.gender}</p>}
                    </div>
                </div>
            </div>

            <button
                onClick={() => { if (validateStep2()) { setStep(3); setStepErrors({}); } }}
                className="w-full bg-clay text-black py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-[0.25em] shadow-xl active:scale-[0.98] transition-all group"
            >
                Continue
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </motion.div>
    );

    const renderStep3 = () => (
        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center">
                <h3 className="text-3xl font-heading font-black text-white uppercase tracking-tighter mb-2">Your Cards</h3>
                <p className="text-white/40 text-sm">Tell us about the credit cards you currently hold.</p>
            </div>

            <div className="bg-white/[0.02] border border-white/8 rounded-[2rem] p-8 space-y-5">
                <div className="flex justify-between items-center">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Number of credit cards</label>
                    <span className="text-clay font-black text-2xl tabular-nums">{formData.creditCardsCount}</span>
                </div>
                <input
                    type="range" min="1" max="10" step="1"
                    value={formData.creditCardsCount}
                    onChange={e => handleCardCountChange(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-clay"
                />
                <div className="flex justify-between text-[8px] font-black text-white/15 uppercase tracking-widest">
                    <span>1 card</span><span>10 cards</span>
                </div>
            </div>

            <div className="space-y-4">
                {formData.creditCards.map((card, idx) => (
                    <div key={idx} className="p-6 bg-white/[0.02] rounded-[2rem] border border-white/8 space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-clay/15 border border-clay/20 text-clay rounded-lg flex items-center justify-center text-[10px] font-black shrink-0">
                                {String(idx + 1).padStart(2, '0')}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Card {idx + 1}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 relative">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/25">Bank</label>
                                <button
                                    onClick={() => setOpenBankDropdown(openBankDropdown === idx ? null : idx)}
                                    className="w-full bg-black/30 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-white text-sm flex items-center justify-between transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        {card.bank && BANK_LOGOS[card.bank] ? (
                                            <div className="w-5 h-5 bg-white rounded-full p-0.5 flex items-center justify-center overflow-hidden shrink-0">
                                                <img src={BANK_LOGOS[card.bank]} alt="" className="w-full h-full object-contain" />
                                            </div>
                                        ) : (
                                            <Landmark size={14} className="text-white/25" />
                                        )}
                                        <span className={card.bank ? 'text-white' : 'text-white/30 text-sm'}>{card.bank || 'Select bank'}</span>
                                    </div>
                                    <ChevronDown size={14} className={`text-white/25 transition-transform duration-200 ${openBankDropdown === idx ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {openBankDropdown === idx && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setOpenBankDropdown(null)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                                                className="absolute top-full left-0 right-0 mt-2 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                                            >
                                                <div className="p-2 border-b border-white/5">
                                                    <input
                                                        autoFocus type="text" placeholder="Search bank…"
                                                        value={formData.bankSearch}
                                                        onChange={e => setFormData({...formData, bankSearch: e.target.value})}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-clay/50 placeholder:text-white/25"
                                                    />
                                                </div>
                                                <div className="max-h-56 overflow-y-auto">
                                                    {ALL_BANKS.filter(b => b.toLowerCase().includes(formData.bankSearch.toLowerCase())).map(bank => (
                                                        <button
                                                            key={bank}
                                                            onClick={() => { updateCardDetail(idx, 'bank', bank); setOpenBankDropdown(null); setFormData(p => ({...p, bankSearch: ''})); }}
                                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-white text-sm transition-colors text-left"
                                                        >
                                                            <div className="w-6 h-6 bg-white rounded-full p-1 flex items-center justify-center overflow-hidden shrink-0">
                                                                <img src={BANK_LOGOS[bank]} alt="" className="w-full h-full object-contain" />
                                                            </div>
                                                            {bank}
                                                        </button>
                                                    ))}
                                                    {ALL_BANKS.filter(b => b.toLowerCase().includes(formData.bankSearch.toLowerCase())).length === 0 && (
                                                        <div className="p-4 text-center text-white/25 text-xs">No banks found</div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/25">Card Name</label>
                                <select
                                    disabled={!card.bank}
                                    value={card.card}
                                    onChange={e => updateCardDetail(idx, 'card', e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-clay/60 transition-all appearance-none disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <option value="" className="bg-black">Select card</option>
                                    {filteredCardsForBank(card.bank).map(c => <option key={c.id} value={c.name} className="bg-black">{c.name}</option>)}
                                    <option value="Other" className="bg-black">Other / Not listed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {Object.keys(stepErrors).some(k => k.startsWith('card_')) && (
                <p className="text-red-400 text-[10px] text-center">{Object.values(stepErrors).find(Boolean)}</p>
            )}

            <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 border border-white/10 text-white/40 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-white/5 transition-all">Back</button>
                <button onClick={() => { if (validateStep3()) { setStep(4); setStepErrors({}); } }} className="flex-[2] bg-clay text-black py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-[0.25em] shadow-xl active:scale-[0.98] transition-all group">
                    Continue
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );

    const renderStep4 = () => (
        <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="text-center">
                <h3 className="text-3xl font-heading font-black text-white uppercase tracking-tighter mb-2">Spending Habits</h3>
                <p className="text-white/40 text-sm">Help us understand how you use your cards.</p>
            </div>

            <div className="bg-white/[0.02] border border-white/8 rounded-[2rem] p-8 space-y-8">
                {/* Usage categories */}
                <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Where do you spend most? <span className="text-white/20 normal-case tracking-normal font-medium">(pick up to 3)</span></label>
                    <div className="flex flex-wrap gap-2">
                        {USAGE_CATEGORIES.map(cat => {
                            const isSelected = formData.mostUsedFor.includes(cat);
                            return (
                                <button
                                    key={cat}
                                    onClick={() => toggleUsageCategory(cat)}
                                    className={`px-5 py-2.5 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all ${
                                        isSelected
                                            ? 'bg-clay/15 border-clay/40 text-clay'
                                            : 'bg-white/[0.03] border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                                    }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                    {stepErrors.mostUsedFor && <p className="text-red-400 text-[10px]">{stepErrors.mostUsedFor}</p>}
                </div>

                {/* Monthly spend */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Average monthly spend</label>
                        <span className="text-clay font-black text-lg tabular-nums">₹{formData.monthlySpend.toLocaleString()}</span>
                    </div>
                    <input
                        type="range" min="1000" max="1000000" step="5000"
                        value={formData.monthlySpend}
                        onChange={e => setFormData({...formData, monthlySpend: parseInt(e.target.value)})}
                        className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-clay"
                    />
                    <div className="flex justify-between text-[8px] font-black text-white/15 uppercase tracking-widest">
                        <span>₹1K</span><span>₹10 Lacs</span>
                    </div>
                </div>

                {/* Discovery + Referral */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">How did you find us?</label>
                        <select
                            value={formData.sourceChannel}
                            onChange={e => setFormData({...formData, sourceChannel: e.target.value})}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3.5 text-white text-sm outline-none focus:border-clay/60 focus:bg-white/5 transition-all appearance-none"
                        >
                            <option value="" className="bg-black">Select a source</option>
                            {DISCOVERY_SOURCES.map(s => <option key={s} value={s} className="bg-black">{s}</option>)}
                        </select>
                        {stepErrors.sourceChannel && <p className="text-red-400 text-[10px]">{stepErrors.sourceChannel}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Referral code <span className="text-white/20 normal-case tracking-normal font-medium">(optional)</span></label>
                        <input
                            type="text" placeholder="YRKMNY-XXXX"
                            value={formData.referralCode}
                            onChange={e => setFormData({...formData, referralCode: e.target.value})}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3.5 text-white text-sm outline-none focus:border-clay/60 focus:bg-white/5 transition-all placeholder:text-white/20"
                        />
                    </div>
                </div>

                {formData.sourceChannel === 'Other' && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Please specify</label>
                        <input
                            type="text" placeholder="e.g. Newspaper, Billboard…"
                            value={formData.otherSource}
                            onChange={e => setFormData({...formData, otherSource: e.target.value})}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3.5 text-white text-sm outline-none focus:border-clay/60 focus:bg-white/5 transition-all placeholder:text-white/20"
                        />
                        {stepErrors.otherSource && <p className="text-red-400 text-[10px]">{stepErrors.otherSource}</p>}
                    </motion.div>
                )}
            </div>

            {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-[10px] font-black uppercase tracking-widest text-center">
                    {error}
                </motion.p>
            )}

            <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex-1 border border-white/10 text-white/40 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-white/5 transition-all">Back</button>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-[2] bg-clay text-black py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-[0.25em] shadow-xl active:scale-[0.98] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <>Join the Waitlist <Sparkles size={16} className="group-hover:rotate-12 transition-transform" /></>}
                </button>
            </div>
        </motion.div>
    );

    const renderStep5 = () => (
        <motion.div key="step5" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center space-y-10">
            <div className="space-y-4">
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
                    <motion.div
                        className="absolute inset-0 border-2 border-t-clay border-r-transparent border-b-transparent border-l-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                    <Sparkles size={26} className="text-clay" />
                </div>
                <h3 className="text-2xl font-heading font-black text-white uppercase tracking-tighter">Setting things up…</h3>
                <p className="text-white/40 text-xs uppercase tracking-[0.2em]">Hang tight, this only takes a moment</p>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 text-left space-y-5">
                {[
                    { id: 'session', label: 'Verifying your Google account' },
                    { id: 'profile', label: 'Reading your profile information' },
                    { id: 'inbox',   label: 'Scanning your inbox' },
                    { id: 'ledger',  label: 'Identifying spending patterns' }
                ].map(item => {
                    const state = (scanState as any)[item.id];
                    return (
                        <div key={item.id} className="flex items-center gap-4">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-300 ${
                                state === 'success' ? 'bg-clay/10 border-clay/30' :
                                state === 'failed'  ? 'bg-red-500/10 border-red-500/20' :
                                state === 'loading' ? 'bg-white/5 border-clay/20' :
                                'bg-white/[0.02] border-white/8'
                            }`}>
                                {state === 'loading' && <Loader2 size={14} className="animate-spin text-clay" />}
                                {state === 'success' && <Check size={14} className="text-clay" strokeWidth={3} />}
                                {state === 'failed'  && <span className="text-red-400 text-xs font-black">✕</span>}
                                {state === 'pending' && <div className="w-2 h-2 bg-white/15 rounded-full" />}
                            </div>
                            <span className={`text-sm transition-colors duration-300 ${
                                state === 'loading' ? 'text-white font-medium' :
                                state === 'success' ? 'text-white/55' :
                                state === 'failed'  ? 'text-red-400/60 line-through' :
                                'text-white/25'
                            }`}>
                                {item.label}
                            </span>
                        </div>
                    );
                })}

                <div className="pt-5 border-t border-white/5 space-y-2">
                    <div className="flex justify-between text-[9px] font-black text-white/25 uppercase tracking-[0.2em]">
                        <span>Progress</span>
                        <span>{scanProgress}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-clay rounded-full"
                            animate={{ width: `${scanProgress}%` }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderStep6 = () => {
        const filteredTxns = scannedTransactions.filter(t =>
            t.brandName.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
            t.description.toLowerCase().includes(ledgerSearch.toLowerCase())
        );

        return (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">

                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="w-14 h-14 bg-clay/10 border border-clay/20 rounded-full flex items-center justify-center mx-auto">
                        <Check size={24} className="text-clay" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter">You're on the list!</h2>
                    <p className="text-sm text-white/40">Your spot is saved. Here's a summary of what we found.</p>
                </div>

                {/* Rank + Profile */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Rank card */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 flex flex-col justify-between shadow-2xl">
                        <div className="space-y-6">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-3">Your Position</p>
                                <p className="text-6xl font-black text-white tracking-tighter leading-none">#{successData?.rank || 982}</p>
                            </div>
                            <div className="pt-5 border-t border-white/5 space-y-3">
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Referral Code</p>
                                <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5">
                                    <span className="flex-1 font-mono text-sm font-bold text-clay pl-3 truncate">{successData?.referralCode || 'YRKMNY-TEMP'}</span>
                                    <button onClick={copyToClipboard} className="w-9 h-9 bg-clay text-black rounded-lg flex items-center justify-center hover:scale-105 transition-transform"><Copy size={14} /></button>
                                </div>
                            </div>
                        </div>
                        <div className="pt-6 space-y-3">
                            <p className="text-[8px] font-black uppercase tracking-widest text-white/25">Share to move up the list</p>
                            <div className="flex gap-2">
                                {[
                                    { icon: Twitter, action: () => shareOnSocial('twitter') },
                                    { icon: MessageCircle, action: () => shareOnSocial('whatsapp') },
                                    { icon: Send, action: () => shareOnSocial('telegram') },
                                    { icon: Share2, action: copyToClipboard }
                                ].map((btn, i) => (
                                    <button key={i} onClick={btn.action} className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-clay hover:border-clay hover:text-black hover:scale-105 transition-all">
                                        <btn.icon size={14} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Profile card */}
                    <div className="lg:col-span-2 bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 shadow-2xl relative">
                        <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-clay/10 border border-clay/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-clay">
                            <ShieldCheck size={10} /> Verified
                        </div>
                        <div className="space-y-5">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-1">Name</p>
                                <h4 className="text-2xl font-bold text-white">{scannedProfile?.name || `${formData.firstName} ${formData.lastName}`}</h4>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 pt-5 border-t border-white/5">
                                {[
                                    { label: 'Date of Birth', value: scannedProfile?.dob || 'N/A' },
                                    { label: 'Age', value: scannedProfile?.age !== 'N/A' ? `${scannedProfile?.age} yrs` : 'N/A' },
                                    { label: 'Gender', value: scannedProfile?.gender || 'N/A' },
                                    { label: 'Phone', value: scannedProfile?.phone || formData.mobileNumber || 'N/A' },
                                    { label: 'Email', value: user?.email || formData.email || 'N/A' },
                                    { label: 'Auth Method', value: session?.provider_token ? 'Google OAuth 2.0' : 'Supabase' }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-1">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-white/20">{item.label}</p>
                                        <p className="text-xs font-bold text-white/80 truncate">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: 'Emails Scanned', value: `${spendStats.count}`, desc: 'Receipts and transaction alerts found', icon: Database },
                        { label: 'Total Spending Found', value: spendStats.total > 0 ? `₹${spendStats.total.toLocaleString()}` : 'N/A', desc: 'Across all scanned emails', icon: DollarSign },
                        { label: 'Top Merchant', value: spendStats.topMerchant !== 'N/A' ? spendStats.topMerchant : 'N/A', desc: 'Where you spend the most', icon: TrendingUp }
                    ].map((card, i) => (
                        <div key={i} className="bg-white/[0.015] border border-white/8 rounded-2xl p-5 flex items-start gap-4">
                            <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-clay shrink-0">
                                <card.icon size={16} />
                            </div>
                            <div className="space-y-0.5 min-w-0">
                                <p className="text-[8px] font-black uppercase tracking-widest text-white/20">{card.label}</p>
                                <p className="text-base font-bold text-white truncate">{card.value}</p>
                                <p className="text-[10px] text-white/35">{card.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Transactions table */}
                <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-xl space-y-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h4 className="text-lg font-bold text-white">Your Spending Summary</h4>
                            <p className="text-xs text-white/35 mt-0.5">Transactions pulled from your Gmail inbox</p>
                        </div>
                        <div className="relative max-w-xs w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={13} />
                            <input
                                type="text" placeholder="Search transactions…"
                                value={ledgerSearch}
                                onChange={e => setLedgerSearch(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-clay/50 placeholder:text-white/20"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/20">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-white/25 bg-white/[0.01]">
                                    <th className="px-5 py-3.5">Brand</th>
                                    <th className="px-5 py-3.5">Amount</th>
                                    <th className="px-5 py-3.5">Description</th>
                                    <th className="px-5 py-3.5">Date</th>
                                    <th className="px-5 py-3.5 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTxns.map((t, idx) => (
                                    <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-5 py-3.5 font-bold text-white">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-5 h-5 bg-white/5 border border-white/10 rounded-md flex items-center justify-center text-[9px] font-black text-clay shrink-0">
                                                    {t.brandName.substring(0,2)}
                                                </div>
                                                <span className="group-hover:text-clay transition-colors">{t.brandName}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 font-mono font-bold text-clay">{t.amount}</td>
                                        <td className="px-5 py-3.5 text-white/50 max-w-xs truncate">{t.description}</td>
                                        <td className="px-5 py-3.5 text-white/35">{t.date}</td>
                                        <td className="px-5 py-3.5 text-right">
                                            <span className="inline-flex items-center gap-1 bg-clay/10 border border-clay/20 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest text-clay">
                                                Verified
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredTxns.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-10 text-center text-white/20 text-[9px] font-black uppercase tracking-widest">
                                            {scannedTransactions.length === 0 ? 'No transactions found' : 'No matching transactions'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="text-center pt-4">
                    <Link to={basePath || "/"} className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-clay transition-all">Back to Home</Link>
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
                {step === 1 && (
                    <div className="flex flex-col items-center gap-3 mb-10">
                        <button
                            onClick={handleGoogleSignup}
                            disabled={isLoadingData}
                            className="group flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-clay bg-clay/10 border border-clay/30 rounded-full px-7 py-3 shadow-[0_8px_24px_-8px_rgba(52,211,153,0.4)] transition-all duration-300 hover:bg-clay hover:text-black hover:scale-105 hover:shadow-[0_8px_30px_-6px_rgba(52,211,153,0.6)] disabled:opacity-50"
                        >
                            <LogIn size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                            Login
                        </button>
                        <button
                            onClick={() => document.getElementById('join-waitlist-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                            className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 hover:text-clay transition-colors duration-300"
                        >
                            Or Join Waitlist
                        </button>
                    </div>
                )}

                {/* Step indicator */}
                {step < 5 && (
                    <div className="mb-14 md:mb-20 max-w-sm mx-auto">
                        <div className="flex items-center justify-between relative">
                            {/* Connector track */}
                            <div className="absolute left-0 right-0 top-[14px] h-[1px] bg-white/8 -z-0" />
                            <motion.div
                                className="absolute left-0 top-[14px] h-[1px] bg-clay -z-0 origin-left"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: Math.max(0, (step - 1) / 3) }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                style={{ right: 0 }}
                            />
                            {(['Account', 'Profile', 'Cards', 'Preferences'] as const).map((label, i) => {
                                const s = i + 1;
                                const done = step > s;
                                const active = step === s;
                                return (
                                    <div key={label} className="flex flex-col items-center gap-2 z-10">
                                        <div className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${
                                            done   ? 'bg-clay border-clay' :
                                            active ? 'bg-clay/10 border-clay shadow-[0_0_12px_rgba(52,211,153,0.4)]' :
                                                     'bg-[#050505] border-white/15'
                                        }`}>
                                            {done
                                                ? <Check size={12} className="text-black" strokeWidth={3} />
                                                : <span className={`text-[10px] font-black ${active ? 'text-clay' : 'text-white/20'}`}>{s}</span>
                                            }
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-[0.15em] transition-colors duration-300 ${active || done ? 'text-white/50' : 'text-white/15'}`}>{label}</span>
                                    </div>
                                );
                            })}
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