import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, User, Building, Check, ArrowRight, Plus, Minus, 
    LayoutGrid, Rocket, ShieldCheck, Gift, Sparkles, HelpCircle, 
    Loader2, CreditCard, Landmark, Share2, Twitter, Instagram, 
    Send, MessageCircle, Copy, ChevronDown, Calendar,
    Mail, Phone, Trash2, Activity, TrendingUp, DollarSign, Award,
    Percent, Database, Search, RefreshCw, Smartphone, LogIn
} from 'lucide-react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { api, isApiError } from '@backend/lib/api/client';
import type { Waitlist as ApiWaitlist, WaitlistJoinResult } from '@backend/lib/api/types';
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

// scanner.py returns dob as "DD/MM/YYYY" — <input type="date"> needs "YYYY-MM-DD"
function parseDobToInputDate(dob?: string): string {
    if (!dob) return '';
    const parts = dob.split('/');
    if (parts.length !== 3) return '';
    const [day, month, year] = parts;
    if (!year || year.length !== 4) return '';
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function normalizeGender(gender?: string): string {
    if (!gender) return '';
    const g = gender.toLowerCase();
    if (g.startsWith('male')) return 'Male';
    if (g.startsWith('female')) return 'Female';
    return 'Other';
}

const WaitlistPage: React.FC = () => {
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/dashboard');
    const basePath = isDashboard ? '/dashboard' : '';
    const [searchParams] = useSearchParams();

    const [step, setStep] = useState(1);
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
        mostUsedFor: [] as string[],
        monthlySpend: 50000,
        referralCode: '',
        sourceChannel: '',
        otherSource: '',
        bankSearch: ''
    });

    // Gmail sign-up scan (Step 1 replaces manual email entry)
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);
    const [yurekaScore, setYurekaScore] = useState<{ score: number; decision: string } | null>(null);

    const [openBankDropdown, setOpenBankDropdown] = useState<number | null>(null);
    const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

    // Scanned Intelligence Dashboard State variables
    const [scannedProfile, setScannedProfile] = useState<any>(null);
    const [scannedTransactions, setScannedTransactions] = useState<ParsedTransaction[]>([]);

    // ─── REFERRAL PREFILLING ───
    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            setFormData(prev => ({ ...prev, referralCode: ref }));
        }
    }, [searchParams]);

    // ─── STEP 1: GMAIL SIGN-UP → runs the deep scanner, prefills Step 2 ───
    const GMAIL_SCAN_SCOPES = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/user.phonenumbers.read',
        'https://www.googleapis.com/auth/user.birthday.read',
        'https://www.googleapis.com/auth/user.gender.read',
        'https://www.googleapis.com/auth/user.addresses.read'
    ].join(' ');

    const startGoogleSignup = () => {
        setError(null);
        setScanError(null);
        const google = (window as any).google;
        if (!google?.accounts?.oauth2) {
            setScanError('Google sign-in failed to load. Please refresh the page and try again.');
            return;
        }
        const clientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID;
        const tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: GMAIL_SCAN_SCOPES,
            callback: (tokenResponse: any) => {
                if (tokenResponse?.error || !tokenResponse?.access_token) {
                    setScanError('Google sign-in was cancelled or denied. Please try again.');
                    return;
                }
                runQuickProfileFetch(tokenResponse.access_token);
            },
        });
        tokenClient.requestAccessToken();
    };

    // Fast path: only fetches name/phone/dob/age/gender/location (People API),
    // no inbox scan — so the user isn't stuck waiting on Step 1.
    const runQuickProfileFetch = async (accessToken: string) => {
        setIsScanning(true);
        setScanError(null);
        try {
            const res = await fetch('/api/scan-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessToken, fallbackData: {} }),
            });
            const result = await res.json();

            if (!res.ok || result.error) {
                setScanError(typeof result.error === 'string' ? result.error : 'Could not read your Google profile. Please try again.');
                return;
            }

            const profile = result.profile || {};
            const nameParts = (profile.name || '').trim().split(/\s+/);
            const dob = parseDobToInputDate(profile.dob);
            const genderNormalized = normalizeGender(profile.gender);

            setFormData(prev => ({
                ...prev,
                firstName: nameParts[0] || prev.firstName,
                lastName: nameParts.slice(1).join(' ') || prev.lastName,
                email: profile.email || prev.email,
                mobileNumber: (profile.phone || '').replace(/\D/g, '').slice(-10) || prev.mobileNumber,
                dateOfBirth: dob || prev.dateOfBirth,
                gender: genderNormalized || prev.gender,
            }));

            setScannedProfile(profile);
            setStep(2);

            const emailForScore = profile.email || formData.email;
            if (emailForScore) triggerBackgroundScoreScan(accessToken, emailForScore);
        } catch (e) {
            console.error('Profile lookup failed:', e);
            setScanError('Something went wrong reading your Google profile. Please try again.');
        } finally {
            setIsScanning(false);
        }
    };

    // Slow path: full inbox scan + Yureka Score. Fired in the background (not
    // awaited by the UI) once we have an email to deliver the result to —
    // the server emails the score to the user when this finishes.
    const triggerBackgroundScoreScan = (accessToken: string, email: string) => {
        fetch('/api/scan-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken, email, fallbackData: {} }),
        })
            .then(res => res.json())
            .then(result => {
                if (result.error) return;
                setScannedTransactions((result.transactions || []).map((t: any) => ({
                    brandName: t.brandName, amount: t.amount, description: t.description, date: t.date, sender: t.sender,
                })));
                if (result.score) setYurekaScore({ score: result.score.score, decision: result.score.decision });
            })
            .catch(e => console.error('Background score scan failed:', e));
    };


    // ─── HELPERS ───
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
        else if (formData.mobileNumber.length !== 10) errors.mobileNumber = 'Enter a valid 10-digit mobile number';
        if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) errors.gender = 'Gender is required';
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
            const canonicalEmail = formData.email;
            const entry = {
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: canonicalEmail,
                mobile_number: formData.mobileNumber ? `+91${formData.mobileNumber}` : '',
                date_of_birth: formData.dateOfBirth,
                gender: formData.gender,
                yureka_score: yurekaScore?.score,
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
            setStep(6);
        } catch (err: any) {
            setError(err.message || 'Failed to join waitlist. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── SHARE LOGIC ───
    const shareLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/join-waitlist?ref=${successData?.referralCode}`;
    const shareText = "I just joined the Yureka.One waitlist! Use my referral code to get priority access.";

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
                <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                    Sign up with Gmail — we'll scan your inbox to compute your Yureka Score and auto-fill your profile.
                </p>

                {isScanning ? (
                    <div className="space-y-4 py-2">
                        <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                            <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
                            <motion.div
                                className="absolute inset-0 border-2 border-t-clay border-r-transparent border-b-transparent border-l-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                            />
                        </div>
                        <p className="text-white/40 text-xs uppercase tracking-[0.2em]">Scanning your Gmail…</p>
                    </div>
                ) : (
                    <button
                        onClick={startGoogleSignup}
                        className="w-full bg-white text-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-clay transition-all duration-300 shadow-xl active:scale-[0.98]"
                    >
                        <LogIn size={16} />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Continue with Gmail</span>
                    </button>
                )}

                {scanError && (
                    <p className="mt-4 text-red-400 text-[10px] font-bold uppercase tracking-widest">{scanError}</p>
                )}

                <p className="mt-6 text-[9px] font-bold uppercase tracking-widest text-white/25">
                    No spam · Unsubscribe anytime
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

            {yurekaScore && (
                <div className="max-w-xs mx-auto flex items-center justify-center gap-2 bg-clay/10 border border-clay/25 rounded-2xl px-5 py-3">
                    <Award size={14} className="text-clay shrink-0" />
                    <span className="text-xs font-bold text-white/70">Yureka Score: <span className="text-clay font-black">{yurekaScore.score}/100</span> · {yurekaScore.decision}</span>
                </div>
            )}

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
                    <div className={`flex items-center bg-black/30 border rounded-xl transition-all focus-within:border-clay/60 focus-within:bg-white/5 ${stepErrors.mobileNumber ? 'border-red-500/60' : 'border-white/10'}`}>
                        <Phone className="ml-5 shrink-0 text-white/25" size={16} />
                        <span className="ml-3 select-none text-sm text-white/50">+91</span>
                        <input
                            type="tel" inputMode="numeric" maxLength={10}
                            value={formData.mobileNumber} placeholder="XXXXX XXXXX"
                            onChange={e => { const digits = e.target.value.replace(/\D/g, '').slice(0, 10); setFormData({...formData, mobileNumber: digits}); setStepErrors(p => ({...p, mobileNumber: ''})); }}
                            className="min-w-0 flex-1 border-0 bg-transparent pl-2 pr-5 py-3.5 text-white text-sm outline-none placeholder:text-white/25"
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
                onClick={() => { if (validateStep2()) { setStep(4); setStepErrors({}); } }}
                className="w-full bg-clay text-black py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-[0.25em] shadow-xl active:scale-[0.98] transition-all group"
            >
                Continue
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
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
                <button onClick={() => setStep(2)} className="flex-1 border border-white/10 text-white/40 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-white/5 transition-all">Back</button>
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

    const renderStep6 = () => {
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
                                    { label: 'Email', value: formData.email || 'N/A' },
                                    { label: 'Auth Method', value: 'Gmail' }
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

                {/* Score status */}
                <div className="max-w-2xl mx-auto bg-white/[0.02] border border-white/10 rounded-[2rem] p-8 flex items-center gap-5 text-left">
                    <div className="w-11 h-11 bg-clay/10 border border-clay/20 rounded-2xl flex items-center justify-center shrink-0">
                        {yurekaScore
                            ? <Award size={18} className="text-clay" />
                            : <Loader2 size={18} className="text-clay animate-spin" />}
                    </div>
                    <div>
                        {yurekaScore ? (
                            <>
                                <p className="text-sm font-bold text-white">Your Yureka Score: <span className="text-clay font-black">{yurekaScore.score}/100</span> · {yurekaScore.decision}</p>
                                <p className="text-xs text-white/40 mt-1">We've also emailed a copy to {formData.email || 'your inbox'}.</p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-bold text-white">We're calculating your Yureka Score…</p>
                                <p className="text-xs text-white/40 mt-1">You'll receive your score and full spending breakdown on {formData.email || 'your registered email'}{formData.mobileNumber ? ` and +91${formData.mobileNumber}` : ''} shortly.</p>
                            </>
                        )}
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
                {/* Step indicator */}
                {step < 5 && (
                    <div className="mb-14 md:mb-20 max-w-sm mx-auto">
                        <div className="flex items-center justify-between relative">
                            {/* Connector track */}
                            <div className="absolute left-0 right-0 top-[14px] h-[1px] bg-white/8 -z-0" />
                            <motion.div
                                className="absolute left-0 top-[14px] h-[1px] bg-clay -z-0 origin-left"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: Math.max(0, [1, 2, 4].reduce((acc, st, i) => (step >= st ? i : acc), 0) / 2) }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                style={{ right: 0 }}
                            />
                            {([
                                { label: 'Account', step: 1 },
                                { label: 'Profile', step: 2 },
                                { label: 'Preferences', step: 4 },
                            ] as const).map(({ label, step: s }, i) => {
                                const done = step > s;
                                const active = step === s;
                                return (
                                    <div key={label} className="flex flex-col items-center gap-2 z-10">
                                        <div className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${
                                            done   ? 'bg-clay border-clay' :
                                            active ? 'bg-clay/10 border-clay shadow-[0_0_12px_rgba(0,147,59,0.4)]' :
                                                     'bg-[#050505] border-white/15'
                                        }`}>
                                            {done
                                                ? <Check size={12} className="text-black" strokeWidth={3} />
                                                : <span className={`text-[10px] font-black ${active ? 'text-clay' : 'text-white/20'}`}>{i + 1}</span>
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
                    {step === 4 && renderStep4()}
                    {step === 6 && renderStep6()}
                </AnimatePresence>

                {error && step < 6 && (
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